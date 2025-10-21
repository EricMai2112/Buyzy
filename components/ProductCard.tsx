import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Product } from "../types";

export default function ProductCard({
  product,
  onPress,
}: {
  product: Product;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={s.card} onPress={onPress}>
      <Image
        source={{ uri: product.image_url || "https://via.placeholder.com/150" }}
        style={s.img}
      />
      <Text style={s.name} numberOfLines={1}>
        {product.name}
      </Text>
      <View style={s.row}>
        <Text style={s.price}>${product.price}</Text>
        <Text style={s.rating}>★ {product.rating ?? 4.5}</Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    width: 140,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  img: { width: "100%", height: 90, borderRadius: 8, marginBottom: 8 },
  name: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  price: { fontWeight: "700", color: "#2a9d8f" },
  rating: { color: "#f4a261" },
});
