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
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productData, categoryData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);

        setAllProducts(productData);
        setDisplayedProducts(productData);

        const categoriesWithAll = [ALL_CATEGORY, ...categoryData];
        setCategories(categoriesWithAll);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        Alert.alert(
          "Lỗi",
          "Không thể tải dữ liệu. Vui lòng kiểm tra kết nối API."
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const productsByCategory =
      selectedCategoryId === "all"
        ? allProducts
        : allProducts.filter((p) => p.category_id === selectedCategoryId);

    const filteredAndSearched = productsByCategory.filter((p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setDisplayedProducts(filteredAndSearched);
  }, [allProducts, selectedCategoryId, searchQuery]);

  const handleCategoryPress = (categoryId: string) => {
    setSearchQuery("");

    if (categoryId === "all" || selectedCategoryId === categoryId) {
      setSelectedCategoryId("all");
    } else {
      setSelectedCategoryId(categoryId);
    }
  };

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
    marginHorizontal: -8,
  },
  gridItem: {
    flexGrow: 1,
    width: "50%",
    paddingHorizontal: 8,
    marginBottom: 12,
    marginLeft: 5,
  },
});
