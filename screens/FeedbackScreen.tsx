import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Header from "../components/Header";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function FeedbackScreen() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const orderId = route.params?.orderId;

  const submit = () => {
    // call backend to submit feedback (orderId, rating, comment)
    console.log({ orderId, rating, comment });
    navigation.navigate("MainTabs");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Feedback" />
      <View style={{ padding: 16 }}>
        <Text style={{ fontWeight: "700", fontSize: 16 }}>
          Rate your experience
        </Text>

        <View style={{ flexDirection: "row", marginTop: 12 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setRating(i)}
              style={{ marginRight: 8 }}
            >
              <Text
                style={{
                  fontSize: 24,
                  color: i <= rating ? "#f4a261" : "#ddd",
                }}
              >
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          placeholder="Write your review..."
          style={styles.input}
          multiline
          value={comment}
          onChangeText={setComment}
        />

        <TouchableOpacity style={styles.submit} onPress={submit}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#f2f4f6",
    height: 120,
    borderRadius: 10,
    marginTop: 12,
    padding: 12,
    textAlignVertical: "top",
  },
  submit: {
    marginTop: 16,
    backgroundColor: "#ee4d2d",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
