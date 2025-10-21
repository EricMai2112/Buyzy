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
      {/* Nút Back (giữ nguyên) */}
      <TouchableOpacity style={styles.left}>
        <Ionicons name="arrow-back" size={22} color="#222" />
      </TouchableOpacity>

      {/* Tiêu đề (giữ nguyên) */}
      <Text style={styles.title}>{title || "All Deals"}</Text>

      {/* ✅ KHỐI BÊN PHẢI: Chứa cả Cart Icon và Avatar */}
      <View style={styles.rightGroup}>
        {/* 1. CART ICON (ACTIVE) */}
        <TouchableOpacity onPress={onCartPress} style={styles.cartBtn}>
          <Ionicons name="cart-outline" size={26} color="#222" />
        </TouchableOpacity>

        {/* 2. AVATAR IMAGE (PASSIVE - KHÔNG CÓ onPress) */}
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
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
  left: { width: 32 },
  title: { fontSize: 18, fontWeight: "600" },

  // ✅ GROUP CONTAINER MỚI: Dùng cho cả Icon và Avatar
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    width: 75, // Cung cấp đủ không gian
    justifyContent: "flex-end",
  },

  // STYLE CHO CART BUTTON
  cartBtn: {
    padding: 2,
    marginRight: 8, // Tạo khoảng cách giữa Icon và Avatar
  },

  // STYLE CŨ ĐƯỢC PHỤC HỒI CHO AVATAR
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
