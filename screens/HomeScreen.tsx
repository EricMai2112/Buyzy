import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import CategoryChip from "../components/CategoryChip";
import { fetchProducts } from "../api/api";
import { fetchCategories, Category } from "../api/categoryApi";
import { Product } from "../types";
import { useNavigation } from "@react-navigation/native";

// Định nghĩa Category "All" giả lập
const ALL_CATEGORY: Category = {
  _id: "all" as any,
  name: "All",
  icon_url: "",
};

export default function HomeScreen() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // Trạng thái Loading
  const navigation = useNavigation<any>();

  // Tải dữ liệu ban đầu và Categories
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Tải sản phẩm và danh mục đồng thời
        const [productData, categoryData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);

        setAllProducts(productData);
        setDisplayedProducts(productData);

        // Thêm chip "All" vào đầu danh sách Categories
        const categoriesWithAll = [ALL_CATEGORY, ...categoryData];
        setCategories(categoriesWithAll);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        Alert.alert(
          "Lỗi",
          "Không thể tải dữ liệu. Vui lòng kiểm tra kết nối API."
        );
      } finally {
        setLoading(false); // Tắt loading sau khi hoàn tất hoặc thất bại
      }
    };
    loadData();
  }, []);

  // LOGIC LỌC TỔNG HỢP (Category + Search)
  useEffect(() => {
    // 1. Lọc theo Category
    const productsByCategory =
      selectedCategoryId === "all"
        ? allProducts
        : allProducts.filter((p) => p.category_id === selectedCategoryId);

    // 2. Lọc theo Tên (Search Query)
    const filteredAndSearched = productsByCategory.filter((p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setDisplayedProducts(filteredAndSearched);
  }, [allProducts, selectedCategoryId, searchQuery]);

  // Logic xử lý khi nhấn Category Chip
  const handleCategoryPress = (categoryId: string) => {
    setSearchQuery(""); // Reset tìm kiếm

    if (categoryId === "all" || selectedCategoryId === categoryId) {
      setSelectedCategoryId("all");
    } else {
      setSelectedCategoryId(categoryId);
    }
  };

  // Hàm render cho FlatList 2 Cột (Đã fix lỗi không bấm được)
  const renderProductItem = ({ item }: { item: Product }) => (
    <View key={item._id} style={styles.gridItem}>
      <ProductCard
        product={item}
        onPress={() =>
          navigation.navigate("ProductDetail", { productId: item._id })
        }
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="All Deals"
        onCartPress={() => navigation.navigate("Cart")}
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 50, fontSize: 16 }}>
            Loading products and categories...
          </Text>
        ) : (
          <>
            <View style={styles.searchRow}>
              <TextInput
                placeholder="Search for product"
                style={styles.search}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => navigation.navigate("Filter")}
              >
                <Text>Filter</Text>
              </TouchableOpacity>
            </View>

            {/* Categories */}
            <View style={{ marginTop: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>
                Categories
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 8 }}
              >
                {categories.map((cat) => (
                  <CategoryChip
                    key={cat._id}
                    title={cat.name}
                    selected={selectedCategoryId === cat._id}
                    onPress={() => handleCategoryPress(cat._id)}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Recommended for you (Sản phẩm cuộn ngang) */}
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>
                Recommended for you
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 12 }}
              >
                {displayedProducts.slice(0, 6).map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    onPress={() =>
                      navigation.navigate("ProductDetail", { product: p })
                    }
                  />
                ))}
              </ScrollView>
            </View>

            {/* All products (FlatList 2 cột) */}
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>
                {selectedCategoryId === "all"
                  ? "All products"
                  : `Products in ${
                      categories.find((c) => c._id === selectedCategoryId)
                        ?.name || "Category"
                    }`}
              </Text>

              {displayedProducts.length === 0 ? (
                <Text style={{ marginTop: 10 }}>
                  No products found matching your criteria.
                </Text>
              ) : (
                <FlatList
                  data={displayedProducts}
                  keyExtractor={(item) => item._id!}
                  renderItem={renderProductItem}
                  numColumns={2}
                  scrollEnabled={false}
                  contentContainerStyle={styles.gridContainer}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: "row", alignItems: "center" },
  search: {
    flex: 1,
    backgroundColor: "#f2f4f6",
    padding: 12,
    borderRadius: 10,
  },
  filterBtn: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  gridContainer: {
    paddingVertical: 12,
  },
  // ✅ Style đã fix cho bố cục 2 cột (All products)
  gridItem: {
    width: "50%",
    paddingHorizontal: 4,
    marginBottom: 10,
  },
});
