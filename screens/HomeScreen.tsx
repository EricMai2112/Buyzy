import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import CategoryChip from "../components/CategoryChip";
import { fetchProducts } from "../api/api";
import { Product } from "../types";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const navigation = useNavigation<any>();

  useEffect(() => {
    (async () => {
      const data = await fetchProducts();
      setProducts(data);
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="All Deals"
        onCartPress={() => navigation.navigate("Cart")}
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.searchRow}>
          <TextInput placeholder="Search for product" style={styles.search} />
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => navigation.navigate("Filter")}
          >
            <Text>Filter</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 8 }}
          >
            <CategoryChip title="Electronics" />
            <CategoryChip title="Fashion" />
            <CategoryChip title="Beauty" />
            <CategoryChip title="Fresh Fruits" />
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
            {products.slice(0, 6).map((p) => (
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
          <Text style={{ fontSize: 18, fontWeight: "700" }}>All products</Text>
          <View style={{ marginTop: 12 }}>
            {products.map((p) => (
              <TouchableOpacity
                key={p._id}
                style={styles.rowItem}
                onPress={() =>
                  navigation.navigate("ProductDetail", { productId: p._id })
                }
              >
                <ProductCard product={p} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
  rowItem: { marginBottom: 12 },
});
