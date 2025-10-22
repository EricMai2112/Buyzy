import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Header from "../components/Header";
import { fetchProductById } from "../api/api";
import { Product } from "../types";
import { useNavigation, useRoute } from "@react-navigation/native";
import { addToCart } from "../api/cartApi"; // ⬅️ API (Giả định đã cập nhật)

// Giả định Product type được mở rộng để bao gồm variants
type ProductWithVariants = Product & {
  variants?: {
    colors?: string[];
    sizes?: string[];
  };
};

// Component đơn giản để hiển thị Variant Chip
const VariantChip = ({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[localStyles.variantChip, selected && localStyles.variantSelected]}
  >
    <Text
      style={[
        localStyles.variantText,
        selected && localStyles.variantTextSelected,
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

export default function ProductDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const [product, setProduct] = useState<ProductWithVariants | null>(
    route.params?.product ?? null
  );

  // ✅ TRẠNG THÁI MỚI: Lưu lựa chọn Variants
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!product && route.params?.productId) {
        const p: ProductWithVariants = await fetchProductById(
          route.params.productId
        );
        setProduct(p);
      }
    })();
  }, [route.params?.productId]);

  // Thiết lập Variants mặc định khi sản phẩm được tải
  useEffect(() => {
    if (product?.variants) {
      if (product.variants.colors?.length && !selectedColor) {
        setSelectedColor(product.variants.colors[0]);
      }
      if (product.variants.sizes?.length && !selectedSize) {
        setSelectedSize(product.variants.sizes[0]);
      }
    }
  }, [product, selectedColor, selectedSize]);

  // Hàm kiểm tra variants đã được chọn chưa
  const validateVariants = (): boolean => {
    if (product?.variants?.colors && !selectedColor) {
      Alert.alert("Lỗi", "Vui lòng chọn Màu sắc.");
      return false;
    }
    if (product?.variants?.sizes && !selectedSize) {
      Alert.alert("Lỗi", "Vui lòng chọn Kích cỡ.");
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!product || !product._id || !validateVariants()) return;

    try {
      // ✅ GỌI API THÊM VÀO GIỎ HÀNG VÀ TRUYỀN VARIANTS
      // Backend/Cart Model phải được cập nhật để lưu Color/Size
      await addToCart(product._id, 1, selectedColor, selectedSize);
      Alert.alert("Thành công", `${product.name} đã được thêm vào giỏ hàng!`);
    } catch (e) {
      Alert.alert("Lỗi", "Không thể thêm sản phẩm vào giỏ hàng.");
    }
  };

  const handleBuyNow = () => {
    if (!product || !validateVariants()) return;

    // ✅ TRUYỀN VARIANTS ĐÃ CHỌN ĐI CHECKOUT (Buy Now flow)
    navigation.navigate("Checkout", {
      product,
      selectedVariants: { selectedColor, selectedSize },
    });
  };

  if (!product)
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );

  const renderVariantsSection = (
    title: string,
    options: string[],
    selected: string | null,
    onSelect: (value: string) => void
  ) => (
    <View style={{ marginTop: 16 }}>
      <Text style={{ fontWeight: "700", marginBottom: 8 }}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map((value) => (
          <VariantChip
            key={value}
            title={value.toUpperCase()}
            selected={selected === value}
            onPress={() => onSelect(value)}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title={product.name}
        onCartPress={() => navigation.navigate("Cart")}
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Image
          source={{
            uri: product.image_url ?? "https://via.placeholder.com/300",
          }}
          style={{
            width: "100%",
            height: 220,
            borderRadius: 12,
            resizeMode: "contain",
          }}
        />
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: "800" }}>
            ${product.price}
          </Text>
          <Text style={{ color: "#f4a261", marginTop: 6 }}>
            ★ {product.rating ?? 4.5} ({product.review_count ?? 99} reviews)
          </Text>
        </View>

        {/* HIỂN THỊ CÁC LỰA CHỌN VARIANTS */}
        {product.variants?.colors &&
          renderVariantsSection(
            "Color",
            product.variants.colors,
            selectedColor,
            setSelectedColor
          )}

        {product.variants?.sizes &&
          renderVariantsSection(
            "Size",
            product.variants.sizes,
            selectedSize,
            setSelectedSize
          )}

        <View style={{ marginTop: 16 }}>
          <Text style={{ fontWeight: "700", marginBottom: 8 }}>
            Description
          </Text>
          <Text style={{ color: "#666" }}>
            This is a sample description of the product. It provides details
            about features and quality.
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "700" }}>Reviews</Text>
          <View style={{ marginTop: 12 }}>
            <Text>4.5/5 (99 reviews)</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  cartBtn: {
    flex: 1,
    backgroundColor: "#2a9d8f",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  buyBtn: {
    flex: 2,
    backgroundColor: "#3fb0b0",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});

const localStyles = StyleSheet.create({
  variantChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#f2f6fb",
    marginRight: 10,
  },
  variantSelected: {
    backgroundColor: "#e6f7f6",
    borderWidth: 1,
    borderColor: "#9fe6df",
  },
  variantText: { color: "#333" },
  variantTextSelected: { color: "#0b7b77", fontWeight: "700" },
});
