import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import HomeScreen from "./screens/HomeScreen";
import CategoryScreen from "./screens/CategoryScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import FilterScreen from "./screens/FilterScreen";
import CartScreen from "./screens/CartScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import SuccessScreen from "./screens/SuccessScreen";
import FeedbackScreen from "./screens/FeedbackScreen";
import CategoryProductScreen from "./screens/CategoryProductScreen";
import LoginScreen from "./screens/LoginScreen";
import OrderScreen from "./screens/OrderScreen";
import { AuthProvider } from "./context/AuthContext";
import AccountScreen from "./screens/AccountScreen";
import AdminProductScreen from "./screens/AdminProductScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ee4d2d",
        },
        tabBarActiveTintColor: "#ffe1c9",
        tabBarInactiveTintColor: "#f0f0f0",
        tabBarLabelStyle: {
          fontWeight: "600",
          fontSize: 12,
        },
        tabBarIcon: ({ color, size }) => {
          let name = "home";
          if (route.name === "Categories") name = "grid-outline";
          else if (route.name === "Favorites") name = "heart";
          else if (route.name === "Order") name = "receipt-outline";
          else if (route.name === "Account") name = "person";
          return <Ionicons name={name as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Categories" component={CategoryScreen} />
      <Tab.Screen name="Favorites" component={HomeScreen} />
      <Tab.Screen name="Order" component={OrderScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            // initialRouteName="Login"
          >
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Category" component={CategoryScreen} />
            <Stack.Screen
              name="CategoryProduct"
              component={CategoryProductScreen}
            />
            <Stack.Screen
              name="AdminProductManagement"
              component={AdminProductScreen}
            />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Filter" component={FilterScreen} />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
            />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="Success" component={SuccessScreen} />
            <Stack.Screen name="Feedback" component={FeedbackScreen} />
          </Stack.Navigator>
          <Toast />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
