import React, { useEffect, useState, useCallback } from "react";
import { View, Text, SafeAreaView, ScrollView, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../api/api"; // Lấy sản phẩm theo ID
import { Product } from "../types";

export default function CategoryScreen() {
  const route = useRoute<any>();
  // ✅ Lấy categoryId và title từ navigation params
  const { categoryId, title } = route.params ?? {};
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ LOGIC TẢI SẢN PHẨM THEO CATEGORY ID
  const loadProducts = useCallback(async () => {
    if (!categoryId) {
      setLoading(false);
      Alert.alert("Error", "Missing Category ID.");
      return;
    }
    setLoading(true);
    try {
      // Gọi API đã sửa đổi để lọc sản phẩm
      const data = await fetchProducts(categoryId);
      setProducts(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load products for this category.");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Hiển thị tên Category trên Header */}
      <Header title={title || "Category Products"} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
          {title || "Products"}
        </Text>

        {loading ? (
          <Text>Loading products...</Text>
        ) : products.length === 0 ? (
          <Text>No products found in this category.</Text>
        ) : (
          <View style={{ marginTop: 12 }}>
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
