import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Header from "../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function CheckoutScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const items = route.params?.items;
  const product = route.params?.product;
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const total = product
    ? product.price
    : items?.reduce((s: any, i: any) => s + i.price * i.qty, 0) || 0;

  const handlePlaceOrder = () => {
    // here call backend to create order
    navigation.replace("Success", { orderId: "ORDER123", total });
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
        />
        <TextInput
          placeholder="Address"
          style={styles.input}
          value={address}
          onChangeText={setAddress}
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
            <Text>Total: ${total}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.placeBtn} onPress={handlePlaceOrder}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Place order</Text>
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
});
