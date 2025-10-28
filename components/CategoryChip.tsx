import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function CategoryChip({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.wrap, selected && styles.sel]}
    >
      <Text style={[styles.txt, selected && styles.selTxt]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#f2f6fb",
    marginRight: 10,
  },
  sel: { backgroundColor: "#ffe1c9", borderWidth: 1, borderColor: "#ee4d2d" },
  txt: { color: "#333" },
  selTxt: { color: "#ee4d2d", fontWeight: "700" },
});
