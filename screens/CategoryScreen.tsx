import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import Header from "../components/Header";

export default function CategoryScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Electronics" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
          Categories
        </Text>
        {/* placeholder content */}
        <View
          style={{ height: 300, backgroundColor: "#fff", borderRadius: 12 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
