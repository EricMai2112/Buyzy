// src/screens/AccountScreen.tsx

import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function AccountScreen() {
  const { userId, userName, logout } = useAuth();
  const navigation = useNavigation<any>();

  const defaultAvatarUrl = "https://i.pravatar.cc/150";

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đồng ý",
        onPress: () => {
          logout();
          navigation.replace("Login");
        },
      },
    ]);
  };

  const handleLogin = () => {
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tài Khoản</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image source={{ uri: defaultAvatarUrl }} style={styles.avatar} />
        <Text style={styles.userName}>{userName || "Guest"}</Text>
        <Text style={styles.userId}>ID: {userId || "N/A"}</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons
            name="settings-outline"
            size={24}
            color="#666"
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>Cài đặt tài khoản</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons
            name="help-circle-outline"
            size={24}
            color="#666"
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>Hỗ trợ & Trợ giúp</Text>
        </TouchableOpacity>

        {userId && (
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={24}
              color="#e74c3c"
              style={styles.menuIcon}
            />
            <Text style={[styles.menuText, { color: "#e74c3c" }]}>
              Đăng xuất
            </Text>
          </TouchableOpacity>
        )}
        {!userId && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
            }}
          >
            <TouchableOpacity style={styles.menuItem} onPress={handleLogin}>
              <Ionicons
                name="log-in-outline"
                size={24}
                color="#e74c3c"
                style={styles.menuIcon}
              />
              <Text style={[styles.menuText, { color: "#e74c3c" }]}>
                Đăng nhập
              </Text>
            </TouchableOpacity>
            <View
              style={{ height: 30, width: 1, backgroundColor: "#e74c3c" }}
            ></View>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogin}>
              <Ionicons
                name="person-add"
                size={24}
                color="#e74c3c"
                style={styles.menuIcon}
              />
              <Text style={[styles.menuText, { color: "#e74c3c" }]}>
                Đăng ký
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ee4d2d",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  profileContainer: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#007aff",
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  userId: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  menuContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuIcon: {
    width: 30,
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
});
