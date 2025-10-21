// CheckoutScreen.tsx (FINAL VERSION)

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
export default function CheckoutScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const items = route.params?.items;
  const product = route.params?.product;
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const total = product
    ? product.price
    : items?.reduce((s: any, i: any) => s + i.price * i.qty, 0) || 0;

  const orderItems = product
    ? [
        {
          product_id: product._id,
          name: product.name,
          price: product.price,
          qty: 1,
          image_url: product.image_url,
        },
      ]
    : items;

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;

    if (!name || !address) {
      Alert.alert("Error", "Please fill in your full name and address.");
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

      if (items) {
        await clearCart();
      }

      navigation.replace("Success", {
        orderId: result.orderId,
        total: result.total.toFixed(2),
      });
    } catch (e: any) {
      console.error("Place Order Error:", e.message);
      Alert.alert(
        "Error",
        e.message || "An unknown error occurred during checkout."
      );

      setIsPlacingOrder(false);
    }
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
          <Text style={{ fontWeight: "700", fontSize: 16 }}>Order Summary</Text>
          <View style={{ marginTop: 10 }}>
            <Text>Total: ${total.toFixed(2)}</Text>
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
