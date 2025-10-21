import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header({
  title,
  onCartPress,
}: {
  title?: string;
  onCartPress?: () => void;
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.left}>
        <Ionicons name="arrow-back" size={22} color="#222" />
      </TouchableOpacity>
      <Text style={styles.title}>{title || "All Deals"}</Text>
      <TouchableOpacity style={styles.avatarWrap} onPress={onCartPress}>
        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={styles.avatar}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
  left: { width: 32 },
  title: { fontSize: 18, fontWeight: "600" },
  avatarWrap: { width: 36, height: 36, borderRadius: 18, overflow: "hidden" },
  avatar: { width: "100%", height: "100%" },
});
