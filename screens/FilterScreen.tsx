import React, { useState } from "react"; // ✅ IMPORT useState
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";

export default function FilterScreen() {
  const navigation = useNavigation<any>();

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleApplyFilters = () => {
    const filters = {
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    };

    navigation.navigate("MainTabs", {
      screen: "Home",
      params: { filters },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Filter" />
      <View style={{ padding: 16, flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "700" }}>
          Shipping options
        </Text>
        <View style={{ marginTop: 12, marginBottom: 20 }}>
          <Text>• Instant (2 hours delivery)</Text>
          <Text>• Express (2 days)</Text>
          <Text>• Standard (7-10 days)</Text>
        </View>

        <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 10 }}>
          Price range
        </Text>
        <View style={localStyles.priceInputContainer}>
          <TextInput
            style={localStyles.priceInput}
            placeholder="Min Price ($)"
            keyboardType="numeric"
            value={minPrice}
            onChangeText={setMinPrice}
          />
          <Text style={{ fontSize: 18, marginHorizontal: 10 }}>-</Text>
          <TextInput
            style={localStyles.priceInput}
            placeholder="Max Price ($)"
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={setMaxPrice}
          />
        </View>

        <TouchableOpacity style={styles.apply} onPress={handleApplyFilters}>
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

const localStyles = StyleSheet.create({
  priceInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  priceInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#f5f7f8",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
