import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Header from "../components/Header";
import { fetchProductById } from "../api/api";
import { Product } from "../types";
import { useNavigation, useRoute } from "@react-navigation/native";
import { addToCart } from "../api/cartApi"; // ⬅️ IMPORT API

// ❌ XÓA HẾT MOCK LOGIC Ở ĐÂY

export default function ProductDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const [product, setProduct] = useState<Product | null>(
    route.params?.product ?? null
  );

  useEffect(() => {
    (async () => {
      if (!product && route.params?.productId) {
        const p = await fetchProductById(route.params.productId);
        setProduct(p);
      }
    })();
  }, []);

  // ✅ SỬ DỤNG API THỰC TẾ
  const handleAddToCart = async () => {
    if (product && product._id) {
      try {
        await addToCart(product._id, 1); // Gọi API thêm vào giỏ hàng
        Alert.alert("Success", `${product.name} added to cart successfully!`);
      } catch (e) {
        Alert.alert(
          "Error",
          "Failed to add product to cart. Please check your network and backend."
        );
      }
    }
  };

  if (!product)
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title={product.name}
        onCartPress={() => navigation.navigate("Cart")}
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Image
          source={{
            uri: product.image_url ?? "https://via.placeholder.com/300",
          }}
          style={{ width: "100%", height: 220, borderRadius: 12 }}
        />
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: "800" }}>
            ${product.price}
          </Text>
          <Text style={{ color: "#f4a261", marginTop: 6 }}>
            ★ {product.rating ?? 4.5} ({product.review_count ?? 99} reviews)
          </Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ fontWeight: "700", marginBottom: 8 }}>
            Description
          </Text>
          <Text style={{ color: "#666" }}>
            This is a sample description of the product. It provides details
            about features and quality.
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "700" }}>Reviews</Text>
          <View style={{ marginTop: 12 }}>
            <Text>4.5/5 (99 reviews)</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buyBtn}
          onPress={() => navigation.navigate("Checkout", { product })}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  cartBtn: {
    flex: 1,
    backgroundColor: "#2a9d8f",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  buyBtn: {
    flex: 2,
    backgroundColor: "#3fb0b0",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
