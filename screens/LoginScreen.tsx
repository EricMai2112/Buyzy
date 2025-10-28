import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { login as loginApi, UserData } from "../api/userApi";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login: setAuth } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userData: UserData = await loginApi(email, password);

      setAuth(userData._id, userData.name);

      Alert.alert("Thành công", `Chào mừng, ${userData.name}!`);

      navigation.replace("MainTabs");
    } catch (error: any) {
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
        }}
      >
        ĐĂNG NHẬP
      </Text>
      <View style={{ gap: 20, width: "80%" }}>
        <TextInput
          label={"Tài khoản"}
          placeholder="Nhập tài khoản..."
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          label={"Mật khẩu"}
          placeholder="Nhập mật khẩu..."
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          mode="contained"
          buttonColor="green"
          onPress={handleLogin}
          style={{ padding: 10, marginTop: 30 }}
          disabled={loading}
          loading={loading}
        >
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </Text>
        </Button>
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
