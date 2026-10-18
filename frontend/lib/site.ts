export const SITE = {
  name: 'The Pan N Grill',
  tagline: 'Authentic Pakistani Taste in the Heart of Jhang',
  address: ['Adhiwal Chowk, Sargodha Road', 'Jhang Sadar, Jhang, Pakistan'],
  phones: [
    { label: '0318-1717763', href: 'tel:03181717763' },
    { label: '0321-7320055', href: 'tel:03217320055' },
  ],
  whatsapp: { label: '0345-6500649', href: 'https://wa.me/923456500649' },
  facebook: 'https://www.facebook.com/share/1AgzKa1R8s/',
} as const;

/** Deep links into the menu, used by the footer. */
export const MENU_LINKS = [
  { href: '/menu#deals', label: 'Deals' },
  { href: '/menu#special-pizza', label: 'Pizzas' },
  { href: '/menu#special-shawarmas', label: 'Shawarmas' },
  { href: '/menu#chorizo-burger', label: 'Burgers' },
  { href: '/menu#fried-items', label: 'Fried items' },
] as const;

export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/menu', label: 'Menu' },
  { href: '/contact', label: 'Contact' },
] as const;
