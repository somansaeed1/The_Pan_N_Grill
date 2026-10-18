import { AddOn } from '@/types';

const cheese: AddOn = { id: 'extra-cheese', name: 'Extra cheese', price: 100 };
const sauce: AddOn = { id: 'extra-sauce', name: 'Extra sauce', price: 40 };
const dip: AddOn = { id: 'garlic-dip', name: 'Garlic dip', price: 50 };
const toppings: AddOn = { id: 'extra-toppings', name: 'Extra toppings', price: 150 };

/** Add-ons offered per menu category. Prices are editable here. */
export const ADD_ONS_BY_CATEGORY: Record<string, AddOn[]> = {
  'special-pizza': [cheese, toppings],
  'regular-pizza': [cheese, toppings],
  'special-shawarmas': [cheese, sauce],
  'pratha-roll': [cheese, sauce],
  'chorizo-burger': [cheese, sauce],
  pasta: [cheese],
  'fried-items': [dip, sauce],
  fries: [cheese, dip],
};

/** Item ids that are currently sold out. Add an id here to disable ordering it. */
export const UNAVAILABLE_ITEM_IDS = new Set<string>([]);

export const MAX_LINE_QUANTITY = 20;
