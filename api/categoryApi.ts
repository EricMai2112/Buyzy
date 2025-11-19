import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "https://buyzy-production.up.railway.app/api";

export type Category = {
  _id: string;
  name: string;
  icon_url: string;
};

const CATEGORY_CACHE_KEY = "cached_categories";
const CACHE_LIFETIME = 3600000;

export async function fetchCategories(): Promise<Category[]> {
  const cachedData = await AsyncStorage.getItem(CATEGORY_CACHE_KEY);
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);

    if (Date.now() - timestamp < CACHE_LIFETIME) {
      console.log("DEBUG: Trả về dữ liệu Categories từ cache.");
      return data;
    }
  }
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    const freshData: Category[] = await res.json();
    const cacheItem = {
      data: freshData,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CATEGORY_CACHE_KEY, JSON.stringify(cacheItem));

    return freshData;
  } catch (err) {
    console.error("Error fetching categories:", err);
    if (cachedData) {
      const { data } = JSON.parse(cachedData);
      return data;
    }
    return [];
  }
}
