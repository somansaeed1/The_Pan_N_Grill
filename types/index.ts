export interface MenuItem {
  id: string;
  name: string;
  price: number | null;
  sizes: { [key: string]: number } | null;
  image: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface MenuData {
  [categoryId: string]: MenuCategory;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image?: string;
}

export interface DeliveryInfo {
  distanceKm: number | null;
  allowed: boolean;
  minOrder: number;
  message: string;
}

export interface LocationData {
  lat: number;
  lng: number;
  timestamp: number;
  distanceKm: number;
  message: string;
  mapsLink: string;
  name: string | null;
}