import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import type { Activity } from "./db";

export function ActivityRow({
    item,
    onDelete,
}: {
    item: Activity;
    onDelete: () => void;
}) {
    const renderDelete = () => (
        <Pressable style={styles.deleteBtn} onPress={onDelete}>
            <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
    );

    const subtitle =
        item.kind === "strength"
            ? `${item.sets ?? 0} sets • ${item.reps ?? 0} reps${item.weight ? ` • ${item.weight} lb` : ""}`
            : `${item.duration_minutes ?? 0} min${item.distance_miles ? ` • ${item.distance_miles} mi` : ""}`;

    return (
        <Swipeable renderLeftActions={renderDelete} renderRightActions={renderDelete}>
            <View style={styles.row}>
                <Text style={styles.title}>
                    {item.kind === "strength" ? "🏋️ " : "🏃 "}
                    {item.title}
                </Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
                {!!item.notes && <Text style={styles.notes}>{item.notes}</Text>}
            </View>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    row: {
        padding: 14,
        borderRadius: 12,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 10,
    },
    title: { fontSize: 16, fontWeight: "700" },
    subtitle: { marginTop: 4, fontSize: 12, opacity: 0.7 },
    notes: { marginTop: 6, fontSize: 12, opacity: 0.85 },
    deleteBtn: {
        justifyContent: "center",
        alignItems: "center",
        width: 96,
        marginBottom: 10,
        borderRadius: 12,
        backgroundColor: "#EF4444",
    },
    deleteText: { color: "white", fontWeight: "800" },
});
