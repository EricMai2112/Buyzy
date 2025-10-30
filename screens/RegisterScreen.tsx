import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { login as loginApi, register, UserData } from "../api/userApi";
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login: setAuth } = useAuth();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ Tên, Email và Mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const userData: UserData = await register(email, password);

      setAuth(userData._id, userData.name, userData.role || "user");

      Alert.alert(
        "Thành công",
        `Đăng ký thành công! Chào mừng, ${userData.name}.`
      );

      navigation.replace("Login");
    } catch (error: any) {
      const errorMessage = error.message || "Đã xảy ra lỗi không xác định.";
      Alert.alert("Lỗi Đăng ký", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={{ width: "100%", height: "50%", marginBottom: 20 }}
      />
      <Text
        style={{
          textAlign: "center",
          fontSize: 30,
          fontWeight: "bold",
          marginBottom: 50,
          color: "#ee4d2d",
        }}
      >
        ĐĂNG KÝ
      </Text>
      <View style={{ gap: 20, width: "80%" }}>
        <TextInput
          label={"Email (Tài khoản)"}
          placeholder="Nhập email..."
          value={email}
          onChangeText={setEmail}
          style={{ backgroundColor: "white" }}
        />
        <TextInput
          label={"Mật khẩu"}
          placeholder="Nhập mật khẩu..."
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ backgroundColor: "white" }}
        />
        <Button
          mode="contained"
          buttonColor="#ee4d2d"
          style={{ padding: 10, marginTop: 30 }}
          onPress={handleRegister}
        >
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>Đăng ký</Text>
        </Button>
        <TouchableOpacity
          onPress={() => navigation.replace("Login")}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "#ee4d2d" }}>
            Bạn đã có tài khoản?{" "}
            <Text style={{ fontWeight: "bold" }}>Đăng nhập</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
});
