import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Header from "../components/Header";
import { CartItem } from "../types";
import { useNavigation, useIsFocused } from "@react-navigation/native"; // ⬅️ Cần useIsFocused
import { Ionicons } from "@expo/vector-icons";
import { fetchCartItems, updateCartItemQuantity } from "../api/cartApi"; // ⬅️ IMPORT API

// ❌ XÓA const initial: CartItem[] = [];

export default function CartScreen() {
  const isFocused = useIsFocused(); // Dùng để refresh dữ liệu khi màn hình được focus
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  // ✅ HÀM TẢI DỮ LIỆU GIỎ HÀNG THỰC TẾ
  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCartItems();
      setItems(data);
    } catch (e) {
      console.error("Could not load cart:", e);
      Alert.alert("Error", "Failed to load cart data.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ GỌI HÀM TẢI DỮ LIỆU KHI MÀN HÌNH ĐƯỢC FOCUS
  useEffect(() => {
    if (isFocused) {
      loadCart();
    }
  }, [isFocused, loadCart]);

  // ✅ HÀM CẬP NHẬT SỐ LƯỢNG VÀ GỌI API
  const handleUpdateQuantity = async (productId: string, delta: number) => {
    const currentItem = items.find((i) => i.product_id === productId);
    if (!currentItem) return;

    const newQty = currentItem.qty + delta;

    try {
      if (newQty <= 0) {
        // Backend cần xử lý việc xóa sản phẩm khi gửi qty = 0
        await updateCartItemQuantity(productId, 0);
      } else {
        await updateCartItemQuantity(productId, newQty);
      }

      loadCart(); // Tải lại giỏ hàng để cập nhật UI
    } catch (e) {
      Alert.alert("Error", "Failed to update quantity.");
    }
  };

  // ✅ COMPONENT HIỂN THỊ ITEM TRONG GIỎ HÀNG (đã thêm nút +/-)
  const CartListItem = ({ item }: { item: CartItem }) => (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "700" }}>{item.name}</Text>
        <Text>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.qtyContainer}>
        <TouchableOpacity
          onPress={() => handleUpdateQuantity(item.product_id, -1)}
          style={styles.qtyBtn}
        >
          <Ionicons name="remove" size={16} color="#333" />
        </TouchableOpacity>
        <Text style={styles.qtyText}>{item.qty}</Text>
        <TouchableOpacity
          onPress={() => handleUpdateQuantity(item.product_id, 1)}
          style={styles.qtyBtn}
        >
          <Ionicons name="add" size={16} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Cart" />
      <View style={{ flex: 1, padding: 16 }}>
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Loading cart...
          </Text>
        ) : items.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text>Your cart is empty</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(i) => i.product_id}
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
    backgroundColor: "#2a9d8f",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
