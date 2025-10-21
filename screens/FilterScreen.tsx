import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Header from "../components/Header";

export default function FilterScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Filter" />
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: "700" }}>
          Shipping options
        </Text>
        <View style={{ marginTop: 12 }}>
          <Text>• Instant (2 hours delivery)</Text>
          <Text>• Express (2 days)</Text>
          <Text>• Standard (7-10 days)</Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "700" }}>Price range</Text>
          <View
            style={{
              height: 60,
              backgroundColor: "#f5f7f8",
              borderRadius: 10,
              marginTop: 10,
            }}
          />
        </View>

        <TouchableOpacity style={styles.apply}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Apply filters
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  apply: {
    marginTop: 24,
    backgroundColor: "#2a9d8f",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});
