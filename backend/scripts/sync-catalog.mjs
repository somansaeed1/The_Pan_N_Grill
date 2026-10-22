// Copies the menu, add-ons and delivery rules from the frontend into
// backend/src/data/catalog.json so the API prices orders from the same data
// the website shows. Run with: npm run sync-catalog (from backend/).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (file) => readFileSync(resolve(root, 'frontend', file), 'utf8');

/** Evaluates the named exports of a simple TypeScript data file. */
function evaluate(source, names) {
  const js = source
    .replace(/^import .*$/gm, '')
    .replace(/^export (const|interface|type) /gm, (_m, kind) => (kind === 'const' ? 'const ' : 'type '))
    .replace(/^type [\s\S]*?^\}/gm, '')
    .replace(/:\s*(MenuData|Record<string,\s*AddOn\[\]>|AddOn|OrderLimitRule\[\])\s*=/g, ' =')
    .replace(/new Set<string>\(/g, 'new Set(');
  const context = {};
  vm.runInNewContext(`${js}\n;__out = { ${names.join(', ')} };`, context);
  return context.__out;
}

const { menuData } = evaluate(read('lib/menuData.ts'), ['menuData']);
const { ADD_ONS_BY_CATEGORY, UNAVAILABLE_ITEM_IDS, MAX_LINE_QUANTITY } = evaluate(read('lib/catalog.ts'), [
  'ADD_ONS_BY_CATEGORY',
  'UNAVAILABLE_ITEM_IDS',
  'MAX_LINE_QUANTITY',
]);
// This file also contains typed functions, so only the two constants are extracted.
const zoneSource = read('lib/deliveryZoneUtils.ts');
const declaration = (name) => {
  const match = zoneSource.match(new RegExp(String.raw`export const ${name}[^=]*=[\s\S]*?\n[}\]];`));
  if (!match) throw new Error(`Could not find ${name} in deliveryZoneUtils.ts`);
  return match[0];
};
const { RESTAURANT_COORDS, ORDER_LIMIT_RULES } = evaluate(
  `${declaration('RESTAURANT_COORDS')}
${declaration('ORDER_LIMIT_RULES')}`,
  ['RESTAURANT_COORDS', 'ORDER_LIMIT_RULES']
);

const catalog = {
  maxLineQuantity: MAX_LINE_QUANTITY,
  unavailableItemIds: [...UNAVAILABLE_ITEM_IDS],
  addOnsByCategory: ADD_ONS_BY_CATEGORY,
  menu: menuData,
  restaurant: RESTAURANT_COORDS,
  // Infinity is not valid JSON, so the open-ended rule uses null.
  deliveryRules: ORDER_LIMIT_RULES.map((r) => ({
    minDistance: r.minDistance,
    maxDistance: Number.isFinite(r.maxDistance) ? r.maxDistance : null,
    minOrder: r.minOrder,
    message: r.message,
  })),
};

const itemCount = Object.values(catalog.menu).reduce((n, c) => n + c.items.length, 0);
if (itemCount === 0 || catalog.deliveryRules.length === 0) {
  throw new Error('Catalog sync produced empty data; the frontend files may have changed shape.');
}

const out = resolve(root, 'backend', 'src', 'data', 'catalog.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Wrote ${out} (${Object.keys(catalog.menu).length} categories, ${itemCount} items)`);
