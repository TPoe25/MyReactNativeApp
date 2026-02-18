import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

export function SwipeToDelete({
    children,
    onDelete,
}: {
    children: React.ReactNode;
    onDelete: () => void;
}) {
    const renderRightActions = () => (
        <View style={styles.actions}>
            <Pressable
                onPress={onDelete}
                style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.85 }]}
            >
                <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
        </View>
    );

    return (
        <Swipeable
            renderRightActions={renderRightActions}
            overshootRight={false}
        >
            {children}
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    actions: {
        width: 110,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    deleteBtn: {
        width: 95,
        height: 48,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#DC2626",
    },
    deleteText: { color: "white", fontWeight: "900" },
});
