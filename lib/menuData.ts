import { MenuData } from '@/types';

export const menuData: MenuData = {
  'special-pizza': {
    name: 'Special Pizza',
    items: [
      { id: 'family-pizza', name: 'Family Pizza', price: 2000, sizes: null, image: '/images/pizzas/family-pizza.jpg' },
      { id: 'xlarge-pizza', name: 'X-Large Pizza', price: 1750, sizes: null, image: '/images/pizzas/xlarge-pizza.jpg' },
      { id: 'royal-kabab-crust', name: 'Royal Kabab Crust', price: null, sizes: { S: 600, M: 1100, L: 1650 }, image: '/images/pizzas/royal-kabab-crust.jpg' },
      { id: 'pan-n-grill-special', name: 'Pan N Grill Special', price: null, sizes: { S: 600, M: 1100, L: 1650 }, image: '/images/pizzas/pan-n-grill-special.jpg' },
      { id: 'kabab-crust-pizza', name: 'Kabab Crust Pizza', price: null, sizes: { S: 600, M: 1100, L: 1650 }, image: '/images/pizzas/kabab-crust-pizza.jpg' },
      { id: 'malaie-boti-pizza', name: 'Malaie Boti Pizza', price: null, sizes: { S: 600, M: 1100, L: 1650 }, image: '/images/pizzas/malaie-boti-pizza.jpg' },
      { id: 'mughlai-pizza', name: 'Mughlai Pizza', price: null, sizes: { S: 600, M: 1100, L: 1650 }, image: '/images/pizzas/mughlai-pizza.jpg' },
      { id: 'chicken-tandoori-pizza', name: 'Chicken Tandoori Pizza', price: null, sizes: { S: 600, M: 1100, L: 1650 }, image: '/images/pizzas/chicken-tandoori-pizza.jpg' },
      { id: 'afghani-pizza', name: 'Afghani Pizza', price: null, sizes: { S: 600, M: 1100, L: 1650 }, image: '/images/pizzas/afghani-pizza.jpg' },
      { id: 'kabab-stuff-pizza', name: 'Kabab Stuff Pizza', price: null, sizes: { S: 600, M: 1100, L: 1650 }, image: '/images/pizzas/kabab-stuff-pizza.jpg' }
    ]
  },
  'regular-pizza': {
    name: 'Regular Pizza',
    items: [
      { id: 'tikka-pizza', name: 'Tikka Pizza', price: null, sizes: { S: 500, M: 1000, L: 1500 }, image: '/images/pizzas/tikka-pizza.jpg' },
      { id: 'fajita-pizza', name: 'Fajita Pizza', price: null, sizes: { S: 500, M: 1000, L: 1500 }, image: '/images/pizzas/fajita-pizza.jpg' },
      { id: 'supreme-pizza', name: 'Supreme Pizza', price: null, sizes: { S: 500, M: 1000, L: 1500 }, image: '/images/pizzas/supreme-pizza.jpg' },
      { id: 'bar-bq-pizza', name: 'Bar B-Q Pizza', price: null, sizes: { S: 500, M: 1000, L: 1500 }, image: '/images/pizzas/bar-bq-pizza.jpg' },
      { id: 'achari-pizza', name: 'Achari Pizza', price: null, sizes: { S: 500, M: 1000, L: 1500 }, image: '/images/pizzas/achari-pizza.jpg' },
      { id: 'italian-pizza', name: 'Italian Pizza', price: null, sizes: { S: 500, M: 1000, L: 1500 }, image: '/images/pizzas/italian-pizza.jpg' },
      { id: 'hot-n-spicy-pizza', name: 'Hot N Spicy Pizza', price: null, sizes: { S: 500, M: 1000, L: 1500 }, image: '/images/pizzas/hot-n-spicy-pizza.jpg' },
      { id: 'multi-flavour-pizza', name: 'Multi Flavour Pizza', price: null, sizes: { S: 600, M: 1100, L: 1650 }, image: '/images/pizzas/multi-flavour-pizza.jpg' }
    ]
  },
  'special-shawarmas': {
    name: 'Special Shawarmas',
    items: [
      { id: 'chicken-shawarma', name: 'Chicken Shawarma', price: 200, sizes: null, image: '/images/shawarmas/chicken-shawarma.jpg' },
      { id: 'achari-shawarma', name: 'Achari Shawarma', price: 220, sizes: null, image: '/images/shawarmas/achari-shawarma.jpg' },
      { id: 'malai-boti-shawarma', name: 'Malai Boti Shawarma', price: 250, sizes: null, image: '/images/shawarmas/malai-boti-shawarma.jpg' },
      { id: 'zinger-shawarma', name: 'Zinger Shawarma', price: 300, sizes: null, image: '/images/shawarmas/zinger-shawarma.jpg' },
      { id: 'special-shawarma', name: 'Special Shawarma', price: 250, sizes: null, image: '/images/shawarmas/special-shawarma.jpg' },
      { id: 'grilled-shawarma', name: 'Grilled Shawarma', price: 300, sizes: null, image: '/images/shawarmas/grilled-shawarma.jpg' },
      { id: 'chicken-cheese-shawarma', name: 'Chicken Cheese Shawarma', price: 250, sizes: null, image: '/images/shawarmas/chicken-cheese-shawarma.jpg' },
      { id: 'zinger-cheese-shawarma', name: 'Zinger Cheese Shawarma', price: 350, sizes: null, image: '/images/shawarmas/zinger-cheese-shawarma.jpg' },
      { id: 'platter-shawarma', name: 'Platter Shawarma', price: 350, sizes: null, image: '/images/shawarmas/platter-shawarma.jpg' },
      { id: 'slice-cheese', name: 'Slice Cheese', price: 50, sizes: null, image: '/images/shawarmas/slice-cheese.jpg' }
    ]
  },
  'pratha-roll': {
    name: 'Pratha Roll',
    items: [
      { id: 'chicken-pratha-roll', name: 'Chicken Pratha Roll', price: 300, sizes: null, image: '/images/rolls/chicken-pratha-roll.jpg' },
      { id: 'zinger-pratha-roll', name: 'Zinger Pratha Roll', price: 400, sizes: null, image: '/images/rolls/zinger-pratha-roll.jpg' },
      { id: 'afghani-pratha-roll', name: 'Afghani Pratha Roll', price: 400, sizes: null, image: '/images/rolls/afghani-pratha-roll.jpg' },
      { id: 'pizza-pratha-roll', name: 'Pizza Pratha Roll', price: 350, sizes: null, image: '/images/rolls/pizza-pratha-roll.jpg' },
      { id: 'patty-pratha-roll', name: 'Patty Pratha Roll', price: 300, sizes: null, image: '/images/rolls/patty-pratha-roll.png' },
      { id: 'grill-pratha-roll', name: 'Grill Pratha Roll', price: 350, sizes: null, image: '/images/rolls/grill-pratha-roll.jpg' }
    ]
  },
  'chorizo-burger': {
    name: 'Chorizo Burger',
    items: [
      { id: 'modern-burger', name: 'Modern Burger', price: 450, sizes: null, image: '/images/burgers/modern-burger.jpg' },
      { id: 'zinger-burger', name: 'Zinger Burger', price: 350, sizes: null, image: '/images/burgers/zinger-burger.jpg' },
      { id: 'chicken-patty-burger', name: 'Chicken Patty Burger', price: 300, sizes: null, image: '/images/burgers/chicken-patty-burger.jpg' },
      { id: 'chapli-burger', name: 'Chapli Burger', price: 250, sizes: null, image: '/images/burgers/chapli-burger.jpg' },
      { id: 'special-kabab-burger', name: 'Special Kabab Burger', price: 400, sizes: null, image: '/images/burgers/special-kabab-burger.jpg' },
      { id: 'grill-burger', name: 'Grill Burger', price: 320, sizes: null, image: '/images/burgers/grill-burger.jpg' },
      { id: 'tower-burger', name: 'Tower Burger', price: 450, sizes: null, image: '/images/burgers/tower-burger.jpg' },
      { id: 'jelo-pino-burger', name: 'Jelo Pino Burger', price: 380, sizes: null, image: '/images/burgers/jelo-pino-burger.jpg' },
      { id: 'double-decker-cheese-burger', name: 'Double Decker Cheese Burger', price: 500, sizes: null, image: '/images/burgers/double-decker-cheese-burger.jpg' }
    ]
  },
  'pasta': {
    name: 'Pasta',
    items: [
      { id: 'malai-botti-pasta', name: 'Malai Botti Pasta', price: 800, sizes: null, image: '/images/malai-botti-pasta.jpg' },
      { id: 'crunchy-pasta', name: 'Crunchy Pasta', price: 750, sizes: null, image: '/images/crunchy-pasta.jpg' },
      { id: 'creamy-cheesy-pasta', name: 'Creamy & Cheesy Pasta', price: 700, sizes: null, image: '/images/creamy-cheesy-pasta.jpg' },
      { id: 'tandoori-pasta', name: 'Tandoori Pasta', price: 700, sizes: null, image: '/images/tandoori-pasta.jpg' },
      { id: 'hot-spicy-pasta', name: 'Hot & Spicy Pasta', price: 650, sizes: null, image: '/images/hot-spicy-pasta.jpg' }
    ]
  },
  'fried-items': {
    name: 'Fried Items',
    items: [
      { id: 'bake-oven-broast', name: 'Bake Oven Broast', price: 1600, sizes: null, image: '/images/fried/bake-oven-broast.jpg' },
      { id: 'broast', name: 'Broast', price: null, sizes: { "full": 1600, "half": 800, "quarter": 400 }, image: '/images/fried/broast.jpg' },
      { id: 'hot-wings', name: 'Hot Wings', price: null, sizes: { "10p": 700, "5p": 350 }, image: '/images/fried/hot-wings.jpg' },
      { id: 'nuggets', name: 'Nuggets', price: null, sizes: { "10p": 600, "5p": 300 }, image: '/images/fried/nuggets.jpg' },
      { id: 'chest-piece', name: 'Chest Piece', price: 350, sizes: null, image: '/images/fried/chest-piece.jpg' },
      { id: 'leg-piece', name: 'Leg Piece', price: 350, sizes: null, image: '/images/fried/leg-piece.jpg' },
      { id: 'chicken-samosa', name: 'Chicken Samosa', price: 80, sizes: null, image: '/images/fried/chicken-samosa.jpg' },
      { id: 'chicken-pakora', name: 'Chicken Pakoda (1 kg)', price: 1000, sizes: null, image: '/images/fried/chicken-pakora.jpg' }
    ]
  },
  'pan-n-grill-special': {
    name: 'Pan N Grill Special',
    items: [
      { id: 'pan-grill-sp-platter', name: 'Pan & Grill Special Platter', price: 650, sizes: null, image: '/images/special/pan-grill-sp-platter.jpg' },
      { id: 'pizza-sandwich', name: 'Pizza Sandwich', price: 550, sizes: null, image: '/images/special/pizza-sandwich.jpg' },
      { id: 'pizza-fries', name: 'Pizza Fries', price: 650, sizes: null, image: '/images/special/pizza-fries.jpg' },
      { id: 'cheesy-spring-roll', name: 'Cheesy Spring Roll (4p)', price: 1000, sizes: null, image: '/images/special/cheesy-spring-roll.jpg' },
      { id: 'ch-cheese-garlic-bread', name: 'Chicken Cheese Garlic Bread', price: 500, sizes: null, image: '/images/special/ch-cheese-garlic-bread.jpg' }
    ]
  },
  'fries': {
    name: 'Fries',
    items: [
      { id: 'oppa-fries', name: 'Oppa Fries', price: 150, sizes: null, image: '/images/fries/oppa-fries.jpg' },
      { id: 'large-fries', name: 'Large Fries', price: 250, sizes: null, image: '/images/fries/large-fries.jpg' },
      { id: 'family-fries', name: 'Family Fries', price: 300, sizes: null, image: '/images/fries/family-fries.jpg' }
    ]
  },
  'deals': {
    name: 'Deals',
    items: [
      { id: 'deal-1', name: '2X-Large Pizza + 1.5 Ltr Coke', price: 3200, sizes: null, image: '/images/deals/deal-1.jpg' },
      { id: 'deal-2', name: '2 Large Pizza + 1.5 Ltr Coke', price: 2700, sizes: null, image: '/images/deals/deal-2.jpg' },
      { id: 'deal-3', name: '2 Medium Pizza + 1.5 Ltr Coke', price: 1800, sizes: null, image: '/images/deals/deal-3.jpg' },
      { id: 'deal-4', name: '3 Small Pizza + 1.5 Ltr Coke', price: 1500, sizes: null, image: '/images/deals/deal-4.jpg' },
      { id: 'deal-5', name: '5 Zinger Burger + 1.5 Ltr Coke', price: 1600, sizes: null, image: '/images/deals/deal-5.jpg' },
      { id: 'deal-6', name: '1 Creamy Pasta + 1 Zinger Burger + 1 Reg. Fries + 1 Ltr Coke', price: 1100, sizes: null, image: '/images/deals/deal-6.jpg' },
      { id: 'deal-7', name: '1 Large Pizza + 5 Hot Wings + 5 Nuggets + 2 Zinger Burgers + 1.5 Ltr Coke', price: 2500, sizes: null, image: '/images/deals/deal-7.jpg' }
    ]
  },
  'sauces': {
    name: 'Sauces',
    items: [
      { id: 'chili-garlic-sauce', name: 'Chili Garlic Sauce', price: 100, sizes: null, image: '/images/sauces/chili-garlic-sauce.jpg' },
      { id: 'dip-sauce', name: 'Dip Sauce', price: 50, sizes: null, image: '/images/sauces/dip-sauce.jpg' },
      { id: 'mayonnaise', name: 'Mayonnaise', price: 50, sizes: null, image: '/images/sauces/mayonnaise.jpg' }
    ]
  },
  'cold-coffee': {
    name: 'Cold Coffee',
    items: [
      { id: 'americano', name: 'Americano', price: 300, sizes: null, image: '/images/coffees/americano.jpg' },
      { id: 'crazy-lot-kat', name: 'Crazy Lot-Kat', price: 320, sizes: null, image: '/images/coffees/crazy-lot-kat.jpg' },
      { id: 'cookies-cream', name: 'Cookies & Cream', price: 320, sizes: null, image: '/images/coffees/cookies-cream.jpg' },
      { id: 'caramel-craves', name: 'Caramel Craves', price: 320, sizes: null, image: '/images/coffees/caramel-craves.jpg' }
    ]
  },
  'tea-coffee': {
    name: 'Tea & Coffee',
    items: [
      { id: 'nescafe-tea', name: "Nescafe Tea", price: 150, sizes: null, image: '/images/coffees/nescafe-tea.jpg' },
      { id: 'cappuccino', name: 'Cappuccino', price: 300, sizes: null, image: '/images/coffees/cappuccino.jpg' }
    ]
  },
  'ice-cream-flavors': {
    name: 'Ice Cream Flavors',
    items: [
      { id: 'vanilla-ice', name: 'Vanilla', price: null, sizes: { S: 140, L: 200 }, image: '/images/ice/vanilla-ice.jpg' },
      { id: 'chocolate-chip-ice', name: 'Chocolate Chip', price: null, sizes: { S: 140, L: 200 }, image: '/images/ice/chocolate-chip-ice.jpg' },
      { id: 'mango-ice', name: 'Mango', price: null, sizes: { S: 140, L: 200 }, image: '/images/mango-ice.jpg' },
      { id: 'strawberry-ice', name: 'Strawberry', price: null, sizes: { S: 140, L: 200 }, image: '/images/ice/strawberry-ice.jpg' },
      { id: 'caramel-crunch-ice', name: 'Caramel Crunch', price: null, sizes: { S: 140, L: 200 }, image: '/images/ice/caramel-crunch-ice.jpg' },
      { id: 'kulfa-ice', name: 'Kulfa', price: null, sizes: { S: 140, L: 200 }, image: '/images/ice/kulfa-ice.jpg' },
      { id: 'pista-ice', name: 'Pista', price: null, sizes: { S: 140, L: 200 }, image: '/images/ice/pista-ice.jpg' },
      { id: 'tutti-frutti-ice', name: 'Tutti Frutti', price: 300, sizes: null, image: '/images/ice/tutti-frutti-ice.jpg' }
    ]
  },
  'ice-cream-shake': {
    name: 'Ice Cream Shake',
    items: [
      { id: 'vanilla-shake', name: 'Vanilla Shake', price: null, sizes: { S: 200, L: 300}, image: '/images/shakes/vanilla-shake.jpg' },
      { id: 'chocolate-shake', name: 'Chocolate Shake', price: null, sizes: { S: 200, L: 300}, image: '/images/shakes/chocolate-shake.jpg' },
      { id: 'mango-shake', name: 'Mango Ice Shake', price: null, sizes: { S: 200, L: 300}, image: '/images/shakes/mango-shake.jpg' },
      { id: 'strawberry-shake', name: 'Strawberry Ice Shake', price: null, sizes: { S: 200, L: 300}, image: '/images/shakes/strawberry-shake.jpg' },
      { id: 'caramel-crunch-shake', name: 'Caramel Crunch Shake', price: null, sizes: { S: 200, L: 300}, image: '/images/shakes/caramel-crunch-shake.jpg' },
      { id: 'kulfa-shake', name: 'Kulfa Shake', price: null, sizes: { S: 200, L: 300}, image: '/images/shakes/kulfa-shake.jpg' },
      { id: 'pista-shake', name: 'Pista Shake', price: null, sizes: { S: 200, L: 300}, image: '/images/shakes/pista-shake.jpg' }
    ]
  },
  'yums-shake': {
    name: "Yum's Shake",
    items: [
      { id: 'apple-banana-shake', name: 'Apple Banana Shake', price: 200, sizes: null, image: '/images/shakes/apple-banana-shake.jpg' },
      { id: 'mango-shake-yums', name: 'Mango Shake', price: 200, sizes: null, image: '/images/shakes/mango-shake.jpg' },
      { id: 'strawberry-shake-yums', name: 'Strawberry Shake', price: 200, sizes: null, image: '/images/shakes/strawberry-shake.jpg' },
      { id: 'khoya-khajoor-shake', name: 'Khoya Khajoor Shake', price: 300, sizes: null, image: '/images/shakes/khoya-khajoor-shake.jpg' },
      { id: 'mix-fruit-shake', name: 'Mix Fruit Shake', price: 300, sizes: null, image: '/images/shakes/mix-fruit-shake.jpg' },
      { id: 'pineapple-shake', name: 'Pineapple Shake', price: 300, sizes: null, image: '/images/shakes/pineapple-shake.jpg' }
    ]
  },
  'russian-salad': {
    name: 'Russian Salad',
    items: [
      { id: 'russian-salad', name: 'Russian Salad', price: null, sizes: { "Cup": 200, "½ Ltr": 350, "1 Ltr": 700 }, image: '/images/salad/russian-salad.jpg' },
      { id: 'careem-chat', name: 'Careem Chat', price: 250, sizes: null, image: '/images/salad/careem-chat.jpg' }
    ]
  },
  'margaritas': {
    name: "Margarita's",
    items: [
      { id: 'lemonade', name: 'Lemonade', price: 150, sizes: null, image: '/images/margaritas/lemonade.jpg' },
      { id: 'blue-berry-margarita', name: 'Blue Berry Margarita', price: 250, sizes: null, image: '/images/margaritas/blue-berry-margarita.jpg' },
      { id: 'mint-margarita', name: 'Mint Margarita', price: 250, sizes: null, image: '/images/margaritas/mint-margarita.jpg' },
      { id: 'fresh-lime', name: 'Fresh Lime', price: 150, sizes: null, image: '/images/margaritas/fresh-lime.jpg' }
    ]
  },
  'juices': {
        name: 'Juices',
        items: [
        { id: 'apple-juice', name: 'Apple Juice', price: 300, sizes: null, image: '/images/juices/apple-juice.jpg' },
        { id: 'pomegranate-juice', name: 'Pomegranate Juice', price: 400, sizes: null, image: '/images/juices/pomegranate-juice.jpg' },
        { id: 'limca-juice', name: 'Limca Juice', price: 100, sizes: null, image: '/images/juices/limca-juice.jpg' },
        { id: 'falsa-juice', name: 'Falsa Juice', price: 150, sizes: null, image: '/images/juices/falsa-juice.jpg' },
        { id: 'peach-juice', name: 'Peach Juice', price: 200, sizes: null, image: '/images/juices/peach-juice.jpg' }
        ]
    },

    'beverages': {
    name: 'Beverages',
    items: [
      { id: 'coke', name: 'Coke', price: null, sizes: { "350 ml": 100, "500 ml": 120, "1 Ltr": 180, "1.5 Ltr": 220 }, image: '/images/beverages/coke.jpg' },
      { id: 'sprite', name: 'Sprite', price: null, sizes: { "350 ml": 100, "500 ml": 120, "1 Ltr": 180, "1.5 Ltr": 220 }, image: '/images/beverages/sprite.jpg' },
      { id: 'next-cola', name: 'Next Cola', price: null, sizes: { "1 Ltr": 150, "1.5 Ltr": 200 }, image: '/images/beverages/next-cola.jpg' },
      { id: 'mineral-water', name: 'Mineral Water', price: null, sizes: { "350 ml": 70, "1.5 Ltr": 100 }, image: '/images/beverages/mineral-water.jpg' }
        ]
    }
};