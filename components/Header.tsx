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
        <Ionicons name="arrow-back" size={22} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightGroup}>
        <TouchableOpacity onPress={onCartPress} style={styles.cartBtn}>
          <Ionicons name="cart-outline" size={26} color="#fff" />
        </TouchableOpacity>

        <View style={styles.avatarWrap}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.avatar}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    elevation: 4,
    zIndex: 10,
    paddingHorizontal: 12,
    justifyContent: "space-between",
    backgroundColor: "#ee4d2d",
  },
  left: { width: 32 },
  title: { fontSize: 18, fontWeight: "600", color: "white" },

  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    width: 75,
    justifyContent: "flex-end",
  },

  cartBtn: {
    padding: 2,
    marginRight: 8,
  },

  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
});
