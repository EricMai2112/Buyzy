import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Header from "../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function SuccessScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const orderId = route.params?.orderId;
  const total = route.params?.total;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Success" />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 8 }}>
          Order placed successfully!
        </Text>
        <Text>Order ID: {orderId}</Text>
        <Text style={{ marginTop: 8 }}>Total: ${total}</Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("Feedback", { orderId })}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Leave feedback
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#ccc", marginTop: 12 }]}
          onPress={() => navigation.replace("MainTabs", { screen: "Order" })}
        >
          <Text>Back to order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#2a9d8f",
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
    alignItems: "center",
    width: 180,
  },
});
