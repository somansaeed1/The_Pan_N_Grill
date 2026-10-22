const catalog = require('./data/catalog.json');

const itemIndex = new Map();
for (const [categoryId, category] of Object.entries(catalog.menu)) {
  for (const item of category.items) itemIndex.set(item.id, { item, categoryId });
}

const unavailable = new Set(catalog.unavailableItemIds);

const findItem = (id) => itemIndex.get(id);
const isAvailable = (item) => item.available !== false && !unavailable.has(item.id);
const addOnsFor = (categoryId) => catalog.addOnsByCategory[categoryId] ?? [];

module.exports = { catalog, findItem, isAvailable, addOnsFor };
