# Fitness Tracker App

A full-stack mobile fitness application built with **React Native (Expo)** and **Firebase**.  
The app allows users to create accounts, log workouts, upload posts, and search exercises using a real API.

---

## Overview

This project focuses on building a real-world fitness tracking platform with:

- User authentication  
- Workout logging  
- Social-style posting (images + captions)  
- Exercise search with API integration  
- Cloud storage + database integration  

The goal was to create a scalable, data-driven mobile app that demonstrates full-stack capabilities.

---

## Features

### User Authentication (Firebase Auth)
- Register / Login with email + password  
- Persistent login state  

### Workout Tracking
- Log workouts tied to a user  
- Store and retrieve workout history  
- Structured data stored in Firestore  

### Exercise Search
- Search exercises (bench, curl, run, etc.)  
- Powered by API Ninjas  
- Results enhanced with GIFs when available  

### Social Feed
- Users can create posts  
- Image uploads stored in Firebase Storage  
- Feed updates in real-time using Firestore listeners  

### User Profiles
- View user-specific content  
- Workout logs tied to profiles  
- Expandable for follower system  

---

## Tech Stack

### Frontend
- React Native (Expo)  
- Expo Router  
- FlashList (performance optimized lists)  

### Backend / Cloud
- Firebase Authentication  
- Firebase Firestore (NoSQL database)  
- Firebase Storage (image uploads)  

### APIs
- API Ninjas (exercise search)  

---

## Data Flow

```
User → App → Firebase Auth → Firestore / Storage → UI updates in real-time
```

- Auth manages user identity  
- Firestore stores structured data (posts, logs, profiles)  
- Storage handles media uploads  
- Snapshot listeners keep UI in sync  

---

## Project Structure

```bash
app/
  (auth)/
    login.tsx
    register.tsx
  (tabs)/
    home.tsx
    search.tsx
    add-post.tsx
    profile.tsx
  user/
    [id].tsx

src/
  firebase.ts
  PostsContext.tsx
  ProfileContext.tsx
  uploadImage.ts

  workouts/
    logs.ts
    types.ts
    apiNinjas.ts
    attachGifs.ts
```

---

## Setup Instructions

### 1. Clone repo
```bash
git clone https://github.com/TPoe25/MyReactNativeApp.git
cd MyReactNativeApp
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env`
```env
EXPO_PUBLIC_API_NINJAS_KEY=your_key

EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Start the app
```bash
npx expo start --clear
```

---

## Firebase Setup

- Enable **Authentication → Email/Password**  
- Create **Firestore Database**  
- Enable **Storage**  
- Update **Firestore rules** for authenticated access  

---

## Key Implementation Details

- Debounced search prevents excessive API calls  
- `AbortController` cancels outdated requests  
- Context API manages global state (posts + profile)  
- Real-time updates via `onSnapshot`  
- Secure writes tied to authenticated user IDs  

---

## Challenges

- Managing Firebase security rules with real-time listeners  
- Handling async state between authentication and Firestore queries  
- Integrating external APIs with mobile UI performance  
- Debugging Expo + Firebase + environment variable issues  

---

## Future Improvements

- Add workout analytics (charts, progress tracking)  
- Implement followers / social interactions  
- Improve recommendation system for exercises  
- Add notifications  
- Deploy production build (EAS + App Store)  

---

## Author

**Taylor Poe**  
Full Stack Developer  
