export type Product = {
  _id?: string;
  name: string;
  price: number;
  image_url?: string;
  category_id?: string;
  rating?: number;
  review_count?: number;
};

export type CartItem = {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  image_url?: string;
};
