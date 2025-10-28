// CartScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import Header from "../components/Header";
// Giả định CartItem type đã được mở rộng để bao gồm color/size
import { CartItem } from "../types";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { fetchCartItems, updateCartItemQuantity } from "../api/cartApi";

export default function CartScreen() {
  const isFocused = useIsFocused();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  // Hàm tải dữ liệu giỏ hàng từ API
  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCartItems();
      setItems(data);
    } catch (e) {
      Alert.alert("Error", "Could not load cart.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadCart();
    }
  }, [isFocused, loadCart]);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  const handleUpdateQuantity = async (
    itemToUpdate: CartItem,
    delta: number
  ) => {
    const newQty = itemToUpdate.qty + delta;

    if (newQty < 0) return;

    try {
      await updateCartItemQuantity({
        product_id: itemToUpdate.product_id,
        qty: newQty,
        color: itemToUpdate.color,
        size: itemToUpdate.size,
      });
      loadCart();
    } catch (e) {
      Alert.alert("Error", "Failed to update quantity.");
    }
  };

  const CartListItem = ({ item }: { item: CartItem }) => (
    <View style={styles.row}>
      <View
        style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}
      >
        <Image
          source={{ uri: item.image_url }}
          style={{ width: 50, height: 50, borderRadius: 8 }}
          resizeMode="cover"
        />
        <View>
          <Text style={{ fontWeight: "700" }}>{item.name}</Text>

          {(item.color || item.size) && (
            <Text style={styles.variantText}>
              {item.color ? `Màu: ${item.color}` : ""}
              {item.color && item.size ? ", " : ""}
              {item.size ? `Kích cỡ: ${item.size}` : ""}
            </Text>
          )}

          <Text>${item.price.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.qtyContainer}>
        <TouchableOpacity
          onPress={() => handleUpdateQuantity(item, -1)}
          style={styles.qtyBtn}
        >
          <Ionicons name="remove" size={16} color="#333" />
        </TouchableOpacity>
        <Text style={styles.qtyText}>{item.qty}</Text>
        <TouchableOpacity
          onPress={() => handleUpdateQuantity(item, 1)}
          style={styles.qtyBtn}
        >
          <Ionicons name="add" size={16} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          Loading cart...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Cart" />
      <View style={{ flex: 1, padding: 16 }}>
        {items.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text>Your cart is empty</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(i) =>
              `${i.product_id}-${i.color || ""}-${i.size || ""}`
            }
            renderItem={({ item }) => <CartListItem item={item} />}
          />
        )}
      </View>

      {items.length > 0 && (
        <View style={styles.bottom}>
          <View>
            <Text style={{ fontWeight: "700" }}>Subtotal</Text>
            <Text>${subtotal.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => navigation.navigate("Checkout", { items })}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
  },
  // ✅ STYLE CHO VARIANTS
  variantText: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f4f6",
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  qtyBtn: {
    padding: 6,
  },
  qtyText: {
    paddingHorizontal: 8,
    fontWeight: "600",
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  checkoutBtn: {
    backgroundColor: "#ee4d2d",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
