export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number | null;
  sizes: { [key: string]: number } | null;
  image: string;
  description: string;
  /** Defaults to true; set false to show the item as sold out. */
  available?: boolean;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface MenuData {
  [categoryId: string]: MenuCategory;
}

export interface CartItem {
  /** Unique per item + size + add-on combination. */
  lineId: string;
  id: string;
  name: string;
  /** Base price of one unit, before add-ons. */
  price: number;
  size: string;
  addOns: AddOn[];
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