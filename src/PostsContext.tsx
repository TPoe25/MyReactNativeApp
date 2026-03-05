import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  deleteDoc,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

import { auth, db } from "./firebase";
import { uploadPostImage } from "./uploadImage";

export type Post = {
  id: string;
  uid: string;
  imageUrl: string;
  caption: string;
  createdAt?: any; // Firestore timestamp
  captionLower?: string;
};

type PostsCtx = {
  user: User | null;
  posts: Post[];
  favoriteIds: Set<string>;
  favoritePosts: Post[];
  addPost: (p: { imageUri: string; caption: string }) => Promise<void>;
  toggleFavorite: (postId: string) => Promise<void>;
  isFavorite: (postId: string) => boolean;

  // used for search (posts)
  searchPosts: (text: string) => Promise<Post[]>;
};

const Ctx = createContext<PostsCtx | null>(null);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  // realtime posts feed
  useEffect(() => {
    const qy = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(qy, (snap) => {
      const arr: Post[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setPosts(arr);
    });

    return unsub;
  }, []);

  // realtime favorites (per user)
  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }

    const favCol = collection(db, "favorites", user.uid, "posts");
    const unsub = onSnapshot(favCol, (snap) => {
      const ids = new Set<string>();
      snap.docs.forEach((d) => ids.add(d.id));
      setFavoriteIds(ids);
    });

    return unsub;
  }, [user]);

  const favoritePosts = useMemo(() => {
    if (!favoriteIds.size) return [];
    return posts.filter((p) => favoriteIds.has(p.id));
  }, [posts, favoriteIds]);

  const addPost = useCallback(async (p: { imageUri: string; caption: string }) => {
    if (!user) throw new Error("Not logged in");

    const caption = p.caption.trim();
    const postId = String(Date.now());

    // upload image to Storage -> get https URL
    const imageUrl = await uploadPostImage({
      uid: user.uid,
      postId,
      imageUri: p.imageUri,
    });

    // save metadata in Firestore
    const postRef = doc(db, "posts", postId);
    await setDoc(postRef, {
      uid: user.uid,
      imageUrl,
      caption,
      captionLower: caption.toLowerCase(),
      createdAt: serverTimestamp(),
    });
  }, [user]);

  const toggleFavorite = useCallback(async (postId: string) => {
    if (!user) throw new Error("Not logged in");

    const favRef = doc(db, "favorites", user.uid, "posts", postId);
    const snap = await getDoc(favRef);

    if (snap.exists()) {
      await deleteDoc(favRef);
    } else {
      await setDoc(favRef, { postId, createdAt: serverTimestamp() });
    }
  }, [user]);

  const isFavorite = useCallback((postId: string) => {
    return favoriteIds.has(postId);
  }, [favoriteIds]);

  const searchPosts = useCallback(async (text: string) => {
    const t = text.trim().toLowerCase();
    if (!t) return [];

    // Firestore doesn’t support contains directly without extra indexing strategy,
    // so for now we do a prefix-like search using captionLower range.
    // This works well enough for the project.
    const start = t;
    const end = t + "\uf8ff";

    const qy = query(
      collection(db, "posts"),
      where("captionLower", ">=", start),
      where("captionLower", "<=", end),
      orderBy("captionLower"),
      limit(20)
    );

    const snap = await getDocs(qy);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Post[];
  }, []);

  const value = useMemo(
    () => ({
      user,
      posts,
      favoriteIds,
      favoritePosts,
      addPost,
      toggleFavorite,
      isFavorite,
      searchPosts,
    }),
    [user, posts, favoriteIds, favoritePosts, addPost, toggleFavorite, isFavorite, searchPosts]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePosts() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePosts must be used inside PostsProvider");
  return ctx;
}
