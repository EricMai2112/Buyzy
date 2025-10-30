// src/screens/AdminProductScreen.tsx

import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import Header from "../components/Header";
import { Category, fetchCategories } from "../api/categoryApi";
import { useAuth } from "../context/AuthContext";
import {
  createProductApi,
  deleteProductApi,
  fetchProducts,
  updateProductApi,
} from "../api/api";
import { Product } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function AdminProductScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [rating, setRating] = useState("");
  const [reviewCount, setReviewCount] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const { userId, userRole } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    if (userRole !== "admin") return;
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (e) {
      Alert.alert("Lỗi", "Không thể tải danh sách sản phẩm.");
    }
  }, [userRole]);

  useEffect(() => {
    loadProducts();

    setLoadingCategories(true);
    fetchCategories()
      .then((data) => {
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0]._id);
        }
      })
      .catch((error) => {
        Alert.alert("Lỗi", "Không thể tải danh sách danh mục.");
      })
      .finally(() => setLoadingCategories(false));
  }, [loadProducts]);

  const handleSaveProduct = async () => {
    if (!name || !price || !imageUrl || !categoryId) {
      Alert.alert(
        "Lỗi",
        "Vui lòng điền đầy đủ các trường bắt buộc (Tên, Giá, Ảnh, Danh mục)."
      );
      return;
    }

    if (userRole !== "admin" || !userId) {
      setLoading(false);
      Alert.alert(
        "Lỗi Quyền",
        "Bạn phải đăng nhập với quyền Admin để thực hiện chức năng này."
      );
      return;
    }

    setLoading(true);
    try {
      const productData = {
        name,
        category_id: categoryId,
        price: parseFloat(price),
        image_url: imageUrl,
        rating: parseFloat(rating) || 0,
        review_count: parseInt(reviewCount) || 0,
      };

      let successMessage = "";

      if (isEditing && currentProductId) {
        await updateProductApi(currentProductId, productData, userId);
        Alert.alert("Thành công", `Sản phẩm đã được cập nhật.`);
      } else {
        await createProductApi(productData, userId);
        Alert.alert("Thành công", `Sản phẩm '${name}' đã được thêm.`);
      }

      navigation.navigate("MainTabs", {
        screen: "Home",
        params: { shouldRefresh: true },
      });

      resetForm();
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể thêm sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPress = (product: Product) => {
    setIsEditing(true);
    setCurrentProductId(product._id as string);
    setName(product.name);
    setPrice(product.price.toString());
    setImageUrl(product.image_url || "");
    setRating(product.rating?.toString() || "");
    setReviewCount(product.review_count?.toString() || "");
    setCategoryId(product.category_id || null);
  };

  const handleDeletePress = (productId: string, productName: string) => {
    if (userRole !== "admin" || !userId) {
      return;
    }

    Alert.alert(
      "Xác nhận Xóa",
      `Bạn có chắc chắn muốn xóa sản phẩm '${productName}'?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProductApi(productId, userId);
              Alert.alert("Thông báo", "Sản phẩm đã được xóa.");
              navigation.navigate("MainTabs", {
                screen: "Home",
                params: { shouldRefresh: true },
              });
            } catch (e: any) {
              Alert.alert("Lỗi", e.message || "Không thể xóa sản phẩm.");
            }
          },
        },
      ]
    );
  };

  const categoryPickerItems = categories.map((cat) => ({
    label: cat.name,
    value: cat._id,
  }));

  const resetForm = () => {
    setIsEditing(false);
    setCurrentProductId(null);
    setName("");
    setPrice("");
    setImageUrl("");
    setRating("");
    setReviewCount("");
  };

  const ProductListItem = ({ item }: { item: Product }) => (
    <View style={localStyles.listItem}>
      <Image
        source={{ uri: item.image_url }}
        style={{ width: 50, height: 50, borderRadius: 8, marginRight: 5 }}
        resizeMode="cover"
      />
      <Text style={localStyles.listItemText}>{item.name}</Text>
      <Text style={localStyles.listItemPrice}>${item.price.toFixed(2)}</Text>
      <View style={localStyles.listItemActions}>
        <TouchableOpacity
          onPress={() => handleEditPress(item)}
          style={localStyles.actionButton}
        >
          <Ionicons name="create-outline" size={20} color="#007aff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeletePress(item._id as string, item.name)}
          style={localStyles.actionButton}
        >
          <Ionicons name="trash-outline" size={20} color="#ee4d2d" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Quản Lý Sản Phẩm"
        onCartPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Thêm Sản Phẩm Mới</Text>

        <TextInput
          label="Tên Sản Phẩm"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Danh Mục</Text>
        <View style={styles.pickerContainer}>
          {loadingCategories ? (
            <Text>Đang tải danh mục...</Text>
          ) : (
            <RNPickerSelect
              onValueChange={(value: any) => setCategoryId(value)}
              items={categoryPickerItems}
              value={categoryId}
              placeholder={{ label: "Chọn Danh Mục...", value: null }}
              style={pickerSelectStyles}
            />
          )}
        </View>

        <TextInput
          label="Giá"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="URL Hình Ảnh"
          value={imageUrl}
          onChangeText={setImageUrl}
          style={styles.input}
        />

        <TextInput
          label="Đánh Giá (Rating)"
          value={rating}
          onChangeText={setRating}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="Số Lượng Đánh Giá"
          value={reviewCount}
          onChangeText={setReviewCount}
          keyboardType="numeric"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleSaveProduct}
          loading={loading}
          disabled={loading || loadingCategories}
          style={styles.button}
          labelStyle={{ fontWeight: "bold" }}
        >
          {isEditing ? "Lưu" : "Thêm Sản Phẩm"}
        </Button>

        <Text style={localStyles.listTitle}>Quản Lý ({products.length})</Text>
        <View>
          {products.map((item) => (
            <ProductListItem key={item._id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  content: { padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: { marginBottom: 15, backgroundColor: "white" },
  label: {
    fontSize: 20,
    marginBottom: 5,
    marginTop: 5,
    fontWeight: "500",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 50,
    justifyContent: "center",
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: "#ee4d2d",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "black",
    paddingRight: 30,
  },
});

const localStyles = StyleSheet.create({
  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  listItemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2a9d8f",
    width: 60,
    textAlign: "right",
  },
  listItemActions: {
    flexDirection: "row",
    width: 80,
    justifyContent: "space-around",
    marginLeft: 10,
  },
  actionButton: {
    padding: 5,
  },
});
