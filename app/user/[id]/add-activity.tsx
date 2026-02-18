import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { addStrengthActivity, addConditioningActivity, initDb, ActivityKind } from "../../../src/db";

export default function AddActivity() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const userId = Number(id);

    const [kind, setKind] = useState<ActivityKind>("strength");
    const [title, setTitle] = useState("");

    const [sets, setSets] = useState("3");
    const [reps, setReps] = useState("10");
    const [weight, setWeight] = useState("");

    const [duration, setDuration] = useState("20");
    const [distance, setDistance] = useState("");

    const [notes, setNotes] = useState("");

    function save() {
        initDb();

        if (kind === "strength") {
            addStrengthActivity({
                userId,
                title,
                sets: Number(sets) || 0,
                reps: Number(reps) || 0,
                weight: weight.trim() ? Number(weight) : undefined,
                notes,
            });
        } else {
            addConditioningActivity({
                userId,
                title,
                durationMinutes: Number(duration) || 0,
                distanceMiles: distance.trim() ? Number(distance) : undefined,
                notes,
            });
        }

        router.back();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.h1}>Add Activity</Text>

            <View style={styles.toggleRow}>
                <Pressable
                    style={[styles.toggleBtn, kind === "strength" && styles.toggleActive]}
                    onPress={() => setKind("strength")}
                >
                    <Text style={[styles.toggleText, kind === "strength" && styles.toggleTextActive]}>Strength</Text>
                </Pressable>
                <Pressable
                    style={[styles.toggleBtn, kind === "conditioning" && styles.toggleActive]}
                    onPress={() => setKind("conditioning")}
                >
                    <Text style={[styles.toggleText, kind === "conditioning" && styles.toggleTextActive]}>Conditioning</Text>
                </Pressable>
            </View>

            <TextInput value={title} onChangeText={setTitle} placeholder="Title (ex: Bench, 3-mile run)" style={styles.input} />

            {kind === "strength" ? (
                <>
                    <TextInput value={sets} onChangeText={setSets} keyboardType="number-pad" placeholder="Sets" style={styles.input} />
                    <TextInput value={reps} onChangeText={setReps} keyboardType="number-pad" placeholder="Reps" style={styles.input} />
                    <TextInput value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder="Weight (optional)" style={styles.input} />
                </>
            ) : (
                <>
                    <TextInput value={duration} onChangeText={setDuration} keyboardType="number-pad" placeholder="Minutes" style={styles.input} />
                    <TextInput value={distance} onChangeText={setDistance} keyboardType="decimal-pad" placeholder="Distance miles (optional)" style={styles.input} />
                </>
            )}

            <TextInput value={notes} onChangeText={setNotes} placeholder="Notes (optional)" style={styles.input} />

            <Pressable style={styles.primaryBtn} onPress={save}>
                <Text style={styles.primaryText}>Save</Text>
            </Pressable>

            <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
                <Text style={styles.secondaryText}>Go back</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 50, backgroundColor: "#F3F4F6" },
    h1: { fontSize: 28, fontWeight: "900", marginBottom: 14, color: "#111827" },

    toggleRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
    toggleBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    toggleActive: { backgroundColor: "#111827", borderColor: "#111827" },
    toggleText: { fontWeight: "900", color: "#111827" },
    toggleTextActive: { color: "white" },

    input: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
    },
    primaryBtn: {
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        backgroundColor: "#111827",
        marginTop: 6,
        marginBottom: 10,
    },
    primaryText: { color: "white", fontWeight: "900" },
    secondaryBtn: {
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    secondaryText: { fontWeight: "900", color: "#111827" },
});
