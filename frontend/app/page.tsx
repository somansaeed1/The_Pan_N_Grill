import Link from 'next/link';
import Image from 'next/image';
import { FacebookIcon, WhatsAppIcon } from '@/components/icons';
import { SITE } from '@/lib/site';

const FEATURED = [
  { id: 'special-pizza', name: 'Special Pizzas', image: '/images/pizza.jpg', blurb: 'Pakistani-style toppings on a crisp base' },
  { id: 'special-shawarmas', name: 'Shawarmas', image: '/images/Shawarmas.jpg', blurb: 'Grilled, wrapped and loaded' },
  { id: 'chorizo-burger', name: 'Burgers', image: '/images/Burgers.jpg', blurb: 'Juicy patties with bold spices' },
  { id: 'fried-items', name: 'Fried Items', image: '/images/Fried.jpg', blurb: 'Crispy chicken and broast' },
];

const PERKS = [
  { title: 'Made to order', text: 'Every item is prepared fresh when you order.' },
  { title: 'Delivered hot', text: 'Fast delivery across the Jhang zone.' },
  { title: 'Easy ordering', text: 'Build your cart and confirm on WhatsApp.' },
];

export default function HomePage() {
  return (
    <div className="pt-16">
      <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-primary-600">
        <Image src="/images/2.png" alt="" fill priority className="object-cover opacity-40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-600/80 to-transparent" />
        <div className="container-page relative py-20">
          <p className="mb-3 inline-block rounded-full bg-white px-4 py-1 text-sm font-bold uppercase tracking-widest text-primary-600">
            Jhang&apos;s favourite grill
          </p>
          <h1 className="max-w-3xl text-6xl uppercase leading-[1.02] text-white sm:text-7xl lg:text-8xl">
            Hot, fresh &amp; <span className="text-gold-400">full of flavour</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-gray-200">{SITE.tagline}. Pizzas, shawarmas, burgers and more.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/menu" className="btn-white">Order now</Link>
            <Link href="/contact" className="btn-outline">Find us</Link>
          </div>
        </div>
      </section>

      <div className="stripes" aria-hidden="true" />

      <section className="bg-cream py-16">
        <div className="container-page">
          <h2 className="section-title text-center">Our Specialties</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {FEATURED.map((cat) => (
              <Link
                key={cat.id}
                href={`/menu#${cat.id}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={cat.image} alt={cat.name} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition duration-500 group-hover:scale-110" />
                </div>
                <div className="p-4">
                  <h3 className="text-xl uppercase text-primary-900">{cat.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{cat.blurb}</p>
                  <span className="mt-3 inline-block text-sm font-bold uppercase text-primary-600">Order &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title">Authentic Pakistani cuisine</h2>
            <p className="mt-5 text-gray-600">
              Traditional recipes and fresh ingredients go into everything we serve, from signature pizzas to perfectly grilled shawarmas and juicy burgers.
            </p>
            <ul className="mt-6 space-y-4">
              {PERKS.map((perk) => (
                <li key={perk.title} className="flex gap-3">
                  <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-primary-600" />
                  <p>
                    <strong className="text-primary-900">{perk.title}.</strong> <span className="text-gray-600">{perk.text}</span>
                  </p>
                </li>
              ))}
            </ul>
            <Link href="/about" className="btn-primary mt-8">Our story</Link>
          </div>
          <div className="relative h-80 overflow-hidden rounded-2xl shadow-lift sm:h-96">
            <Image src="/images/1.png" alt="Dishes from The Pan N Grill" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-primary-900 py-16 text-white">
        <div className="container-page">
          <h2 className="text-center text-4xl uppercase sm:text-5xl">Visit us today</h2>
          <div className="mt-10 grid gap-8 text-center md:grid-cols-3">
            <div>
              <h3 className="text-2xl uppercase text-gold-400">Location</h3>
              <p className="mt-2 text-gray-300">
                {SITE.address[0]}
                <br />
                {SITE.address[1]}
              </p>
            </div>
            <div>
              <h3 className="text-2xl uppercase text-gold-400">Phone</h3>
              <p className="mt-2 text-gray-300">
                {SITE.phones.map((phone) => (
                  <a key={phone.href} href={phone.href} className="block hover:text-gold-400">{phone.label}</a>
                ))}
              </p>
            </div>
            <div>
              <h3 className="text-2xl uppercase text-gold-400">Follow us</h3>
              <div className="mt-3 flex justify-center gap-3">
                <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full bg-white/10 p-3 hover:bg-primary-600">
                  <FacebookIcon className="h-6 w-6" />
                </a>
                <a href={SITE.whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="rounded-full bg-white/10 p-3 hover:bg-primary-600">
                  <WhatsAppIcon className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
