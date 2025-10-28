import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let name = "home";
          if (route.name === "Search") name = "search";
          else if (route.name === "Favorites") name = "heart";
          else if (route.name === "Inbox") name = "chatbubble";
          else if (route.name === "Account") name = "person";
          return <Ionicons name={name as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={CategoryScreen} />
      <Tab.Screen name="Favorites" component={HomeScreen} />
      <Tab.Screen name="Order" component={OrderScreen} />
      <Tab.Screen name="Account" component={HomeScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Login"
        >
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Category" component={CategoryScreen} />
          <Stack.Screen
            name="CategoryProduct"
            component={CategoryProductScreen}
          />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Filter" component={FilterScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Success" component={SuccessScreen} />
          <Stack.Screen name="Feedback" component={FeedbackScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
