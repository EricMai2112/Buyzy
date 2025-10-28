import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
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
      <Header title="Mua hàng" />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <Image
          source={require("../assets/check.png")}
          style={{
            objectFit: "cover",
            width: 200,
            height: 200,
            marginBottom: 100,
          }}
        />
        <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 8 }}>
          Đặt hàng thành công
        </Text>
        <Text>Order ID: {orderId}</Text>
        <Text style={{ marginTop: 8, fontWeight: "bold" }}>
          Total: ${total}
        </Text>

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
    backgroundColor: "#ee4d2d",
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
    alignItems: "center",
    width: 180,
  },
});
