// CategoryProductScreen.tsx

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../api/api";
import { Product } from "../types";

interface CategoryProductRouteParams {
  categoryId: string;
  title: string;
}

export default function CategoryProductScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const { categoryId, title } =
    (route.params as CategoryProductRouteParams) ?? {};

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    console.log("DEBUG: categoryId received:", categoryId);
    if (!categoryId) {
      setLoading(false);
      Alert.alert("Lỗi", "Thiếu Category ID để tải sản phẩm.");
      return;
    }
    setLoading(true);
    try {
      const data = await fetchProducts(undefined, undefined, categoryId);
      setProducts(data);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
      Alert.alert("Lỗi", "Không thể tải sản phẩm cho danh mục này.");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <Header title={title || "Sản Phẩm Danh Mục"} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>
          Sản phẩm của: {title || "Không rõ danh mục"}
        </Text>

        {loading ? (
          <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
        ) : products.length === 0 ? (
          <Text style={styles.emptyText}>
            Không có sản phẩm nào trong danh mục này.
          </Text>
        ) : (
          <View style={styles.productsGridContainer}>
            {products.map((p) => (
              <View key={p._id} style={styles.gridItem}>
                <ProductCard
                  product={p}
                  onPress={() =>
                    navigation.navigate("ProductDetail", { productId: p._id })
                  }
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
  },
  productsGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: -8,
    marginTop: 10,
  },
  gridItem: {
    width: "48%",
    paddingHorizontal: 8,
    marginBottom: 15,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#777",
  },
});
