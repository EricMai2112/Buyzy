// src/screens/OrderScreen.tsx

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import Header from "../components/Header";
import { fetchOrders } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";

interface Order {
  _id: string;
  total: number;
  items: { name: string; qty: number }[];
  status: string;
  created_at: string;
}

export default function OrderScreen() {
  const { userId } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    // Kiểm tra nếu chưa đăng nhập
    if (!userId) {
      setLoading(false);
      Alert.alert("Lỗi", "Vui lòng đăng nhập để xem đơn hàng.");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchOrders(userId);
      setOrders(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.headerRow}>
        <Text style={styles.orderId}>#{item._id.slice(-6)}</Text>
        <Text
          style={[
            styles.status,
            item.status === "Success"
              ? styles.statusPending
              : styles.statusShipped,
          ]}
        >
          Success
        </Text>
      </View>
      <Text style={styles.date}>Ngày đặt: 28/10/2025</Text>

      <View style={styles.itemDetail}>
        <Text>{item.items.length} sản phẩm</Text>
        <Text style={styles.total}>Tổng cộng: ${item.total.toFixed(2)}</Text>
      </View>

      {item.items.slice(0, 2).map((i, index) => (
        <Text key={index} style={styles.itemText}>
          - {i.name} (x{i.qty})
        </Text>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
      <Header title="Đơn Hàng Của Tôi" />

      <View style={styles.listContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
        ) : orders.length === 0 ? (
          <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào.</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item._id}
            renderItem={renderOrderItem}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContainer: { paddingHorizontal: 16, flex: 1 },
  loadingText: { textAlign: "center", marginTop: 50 },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#777",
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderId: { fontSize: 16, fontWeight: "700", color: "#ee4d2d" },
  date: { fontSize: 12, color: "#999", marginBottom: 10 },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    fontWeight: "bold",
    fontSize: 12,
  },
  statusPending: { backgroundColor: "#fff3cd", color: "#856404" },
  statusShipped: { backgroundColor: "#d4edda", color: "#155724" },
  itemDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  total: { fontSize: 16, fontWeight: "700", color: "#007aff" },
  itemText: { fontSize: 13, color: "#666" },
});
