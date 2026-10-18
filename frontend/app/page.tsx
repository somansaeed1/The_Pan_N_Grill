import Link from 'next/link';
import Image from 'next/image';
import { FacebookIcon, WhatsAppIcon } from '@/components/icons';
import { menuData } from '@/lib/menuData';
import { formatPrice } from '@/lib/cartUtils';
import { SITE } from '@/lib/site';
import { MenuItem } from '@/types';

const startingPrice = (item: MenuItem): number =>
  item.price ?? Math.min(...Object.values(item.sizes ?? { regular: 0 }));

const deals = menuData.deals.items;
const cheapestDeal = Math.min(...deals.map(startingPrice));

const POPULAR = [
  { categoryId: 'special-pizza', item: menuData['special-pizza'].items[0] },
  { categoryId: 'special-shawarmas', item: menuData['special-shawarmas'].items[0] },
  { categoryId: 'chorizo-burger', item: menuData['chorizo-burger'].items[0] },
  { categoryId: 'fried-items', item: menuData['fried-items'].items[0] },
];

const STEPS = [
  { n: '1', title: 'Pick your food', text: 'Choose size and add-ons, then add it to your cart.' },
  { n: '2', title: 'Share your details', text: 'Enter your name, phone and delivery address.' },
  { n: '3', title: 'Confirm on WhatsApp', text: 'Your order opens in WhatsApp and we confirm the time.' },
];

export default function HomePage() {
  return (
    <div className="pt-16">
      <section className="bg-cream">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <div className="flex flex-col justify-center px-4 py-12 sm:px-8 lg:py-20 lg:pl-8 lg:pr-12">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-600">
              Adhiwal Chowk &middot; Jhang
            </p>
            <h1 className="mt-3 text-5xl uppercase leading-[1.02] text-primary-900 sm:text-6xl xl:text-7xl">
              Pizza, shawarma <span className="text-primary-600">&amp; burgers</span>, made to order
            </h1>
            <p className="mt-5 max-w-lg text-lg text-primary-800/80">
              Pakistani flavour on every plate. Order online for delivery in Jhang or pick it up at the shop.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/menu" className="btn-primary">Order online</Link>
              <Link href="/menu#deals" className="btn border-2 border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white">
                Deals from {formatPrice(cheapestDeal)}
              </Link>
            </div>
          </div>

          <div className="relative min-h-[300px] lg:min-h-[560px]">
            <Image
              src="/images/2.png"
              alt="The Pan N Grill shop front at Adhiwal Chowk"
              fill
              priority
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
      <div className="stripes" aria-hidden="true" />

      <section className="py-14">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <h2 className="section-title">Deals</h2>
            <Link href="/menu#deals" className="text-sm font-bold uppercase text-primary-600 hover:underline">
              All deals
            </Link>
          </div>
          <ul className="no-scrollbar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {deals.slice(0, 4).map((deal) => (
              <li key={deal.id} className="w-[75%] shrink-0 snap-start sm:w-auto">
                <Link href="/menu#deals" className="group block overflow-hidden rounded-lg border border-primary-900/10 bg-white shadow-card transition hover:shadow-lift">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={deal.image} alt={deal.name} fill sizes="(min-width:1024px) 25vw, 75vw" className="object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute bottom-0 left-0 bg-primary-600 px-3 py-1.5 text-lg text-white">
                      {formatPrice(startingPrice(deal))}
                    </span>
                  </div>
                  <p className="p-3 text-sm font-bold uppercase leading-snug text-primary-900">{deal.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-primary-900 py-14 text-white">
        <div className="container-page">
          <h2 className="text-4xl uppercase sm:text-5xl">Customer favourites</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {POPULAR.map(({ categoryId, item }) => (
              <Link key={item.id} href={`/menu#${categoryId}`} className="group overflow-hidden rounded-lg bg-primary-800 transition hover:bg-primary-700/40">
                <div className="relative aspect-square overflow-hidden">
                  <Image src={item.image} alt={item.name} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="text-lg uppercase leading-tight sm:text-xl">{item.name}</h3>
                  <p className="mt-1 text-sm text-gold-400">
                    {item.price ? '' : 'From '}
                    {formatPrice(startingPrice(item))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page">
          <h2 className="section-title">How ordering works</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.n} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-600 text-2xl text-white">
                  {step.n}
                </span>
                <div>
                  <h3 className="text-xl uppercase text-primary-900">{step.title}</h3>
                  <p className="mt-1 text-primary-800/80">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream py-14">
        <div className="container-page grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-2xl uppercase text-primary-900">Find us</h3>
            <p className="mt-2 text-primary-800/80">
              {SITE.address[0]}
              <br />
              {SITE.address[1]}
            </p>
          </div>
          <div>
            <h3 className="text-2xl uppercase text-primary-900">Call to order</h3>
            <p className="mt-2 text-primary-800/80">
              {SITE.phones.map((phone) => (
                <a key={phone.href} href={phone.href} className="block font-semibold hover:text-primary-600">{phone.label}</a>
              ))}
            </p>
          </div>
          <div>
            <h3 className="text-2xl uppercase text-primary-900">Follow us</h3>
            <div className="mt-3 flex gap-3">
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full bg-primary-900 p-3 text-white hover:bg-primary-600">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href={SITE.whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="rounded-full bg-primary-900 p-3 text-white hover:bg-primary-600">
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
