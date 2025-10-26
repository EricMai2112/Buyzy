import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const handleLogin = () => {
    navigation.replace("MainTabs");
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
        <TextInput label={"Tài khoản"} placeholder="Nhập tài khoản..." />
        <TextInput label={"Mật khẩu"} placeholder="Nhập mật khẩu..." />

        <Button
          mode="contained"
          buttonColor="green"
          onPress={handleLogin}
          style={{ padding: 10, marginTop: 30 }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>Đăng nhập</Text>
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
