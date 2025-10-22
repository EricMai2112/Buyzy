// CategoryScreen.tsx
// Hiển thị danh sách các Categories để người dùng chọn.

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
// ⚠️ Thay thế bằng đường dẫn API thực tế của bạn
import { fetchCategories, Category } from "../api/categoryApi";
import { Ionicons } from "@expo/vector-icons";

export default function CategoryScreen() {
  const navigation = useNavigation<any>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // LOGIC TẢI DANH SÁCH CATEGORIES
  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      // Giả định fetchCategories không cần tham số
      const data: Category[] = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi tải categories:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách Categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleCategoryPress = (category: Category) => {
    navigation.navigate("CategoryProduct", {
      categoryId: category._id,
      title: category.name,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <Header title="Tất Cả Danh Mục" />

      {loading ? (
        <Text style={styles.loadingText}>Đang tải danh mục...</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Chọn Danh Mục</Text>

          {categories.length === 0 ? (
            <Text style={styles.emptyText}>Không tìm thấy danh mục nào.</Text>
          ) : (
            categories.map((cat) => (
              <TouchableOpacity
                key={cat._id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(cat)}
              >
                <Text style={styles.categoryText}>{cat.name}</Text>
                <Ionicons name="chevron-forward" size={20} color="#333" />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#555",
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
  },
  categoryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#007aff", // Màu xanh nổi bật
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#777",
  },
});
