import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Header from "../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { clearCart } from "../api/cartApi";
import { createOrder } from "../api/orderApi";

// Giả định CheckoutItem type đã được mở rộng
type CheckoutItem = {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  image_url?: string;
  color?: string;
  size?: string;
};

export default function CheckoutScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const items = route.params?.items; // Luồng Checkout từ Cart (selectedVariants = null)
  const product = route.params?.product; // Luồng Buy Now
  const selectedVariants = route.params?.selectedVariants; // Variants chỉ có trong luồng Buy Now

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // TÍNH TOÁN TỔNG TIỀN
  const total = product
    ? product.price
    : items?.reduce((s: any, i: any) => s + i.price * i.qty, 0) || 0;

  // CHUẨN BỊ MẢNG ITEMS CHO API
  const orderItems: CheckoutItem[] = product
    ? [
        {
          product_id: product._id,
          name: product.name,
          price: product.price,
          qty: 1,
          image_url: product.image_url,
          // Thêm variants vào dữ liệu đặt hàng (chỉ có trong luồng Buy Now)
          color: selectedVariants?.selectedColor,
          size: selectedVariants?.selectedSize,
        },
      ]
    : items || [];

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;

    if (!name || !address) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ họ tên và địa chỉ.");
      return;
    }

    if (orderItems.length === 0) {
      Alert.alert("Lỗi", "Đơn hàng rỗng!");
      return;
    }

    const orderData = {
      items: orderItems,
      total: total,
      shipping_address: address,
    };

    setIsPlacingOrder(true);

    try {
      const result = await createOrder(orderData);

      // Nếu checkout từ giỏ hàng (có `items`), thì xóa giỏ hàng
      if (items) {
        await clearCart();
      }

      navigation.replace("Success", {
        orderId: result.orderId || "N/A",
        total: total.toFixed(2),
      });
    } catch (e: any) {
      console.error("Place Order Error:", e.message);
      Alert.alert(
        "Lỗi",
        e.message || "Không thể đặt hàng. Vui lòng kiểm tra API."
      );
      setIsPlacingOrder(false);
    }
  };

  // ✅ LOGIC HIỂN THỊ CÓ ĐIỀU KIỆN
  const renderVariantSummary = () => {
    if (!selectedVariants) return null; // ẨN nếu là Checkout từ Cart

    const { selectedColor, selectedSize } = selectedVariants;
    if (!selectedColor && !selectedSize) return null;

    return (
      <View style={localStyles.variantInfo}>
        {selectedColor && (
          <Text style={localStyles.variantText}>Màu sắc: {selectedColor}</Text>
        )}
        {selectedSize && (
          <Text style={localStyles.variantText}>Kích cỡ: {selectedSize}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Checkout" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontWeight: "700", fontSize: 18 }}>
          Shipping Address
        </Text>
        <TextInput
          placeholder="Full name"
          style={styles.input}
          value={name}
          onChangeText={setName}
          editable={!isPlacingOrder}
        />
        <TextInput
          placeholder="Address"
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          editable={!isPlacingOrder}
        />
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "700" }}>Payment method</Text>
          <View style={{ marginTop: 10 }}>
            <Text>• Cash on delivery</Text>
            <Text>• Card (not implemented)</Text>
          </View>
        </View>
        <View style={{ marginTop: 30 }}>
          <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 10 }}>
            Order Summary
          </Text>

          {orderItems.map((item, index) => (
            <View key={index} style={localStyles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={localStyles.itemName}>
                  {item.name} (x{item.qty})
                </Text>

                {(item.color || item.size) && (
                  <Text style={localStyles.itemVariant}>
                    {item.color ? `Màu: ${item.color}` : ""}
                    {item.color && item.size ? ", " : ""}
                    {item.size ? `Kích cỡ: ${item.size}` : ""}
                  </Text>
                )}
              </View>
              <Text style={localStyles.itemPrice}>
                ${(item.price * item.qty).toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={localStyles.totalRow}>
            <Text style={localStyles.totalText}>Total:</Text>
            <Text style={localStyles.totalText}>${total.toFixed(2)}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.placeBtn, isPlacingOrder && styles.disabledBtn]}
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            {isPlacingOrder ? "Placing Order..." : "Place order"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#f2f4f6",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  placeBtn: {
    marginTop: 24,
    backgroundColor: "#2a9d8f",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledBtn: {
    backgroundColor: "#ccc",
  },
});

const localStyles = StyleSheet.create({
  variantInfo: {
    marginTop: 8,
    borderLeftWidth: 2,
    borderColor: "#ccc",
    paddingLeft: 10,
  },
  variantText: {
    fontSize: 12,
    color: "#555",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemName: {
    fontWeight: "500",
  },
  itemVariant: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  itemPrice: {
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2a9d8f",
  },
});
