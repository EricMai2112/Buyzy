import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Header from "../components/Header";
import { CartItem } from "../types";
import { useNavigation } from "@react-navigation/native";

const initial: CartItem[] = []; // you can load from backend

export default function CartScreen() {
  const [items, setItems] = useState<CartItem[]>(initial);
  const navigation = useNavigation<any>();

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

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
            keyExtractor={(i) => i.product_id}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={{ fontWeight: "700" }}>{item.name}</Text>
                <Text>
                  ${item.price} x {item.qty}
                </Text>
              </View>
            )}
          />
        )}
      </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
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
