import Link from 'next/link';
import Image from 'next/image';
import { FacebookIcon, WhatsAppIcon } from '@/components/icons';
import { SITE } from '@/lib/site';

const SPECIALTIES = [
  { id: 'special-pizza', name: 'Special Pizzas', image: '/images/pizza.jpg', blurb: 'Authentic Pakistani-style pizzas with traditional flavors' },
  { id: 'special-shawarmas', name: 'Shawarmas', image: '/images/Shawarmas.jpg', blurb: 'Fresh and flavorful shawarmas made with premium ingredients' },
  { id: 'chorizo-burger', name: 'Burgers', image: '/images/Burgers.jpg', blurb: 'Juicy burgers with Pakistani spices and fresh toppings' },
  { id: 'fried-items', name: 'Fried Items', image: '/images/Fried.jpg', blurb: 'Crispy and delicious fried chicken and broast' },
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
              Authentic Pakistani taste in the heart of Jhang. Order online for delivery or pick it up at the shop.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/menu" className="btn-primary">Order online</Link>
              <Link href="/contact" className="btn border-2 border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white">
                Find us
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

      <section className="py-16">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="section-title">Our Specialties</h2>
            <p className="mt-3 text-primary-800/80">
              Our most popular dishes, made with authentic Pakistani flavors and the finest ingredients.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {SPECIALTIES.map((item) => (
              <Link
                key={item.id}
                href={`/menu#${item.id}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-primary-900/10 bg-white shadow-card transition hover:shadow-lift"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={item.image} alt={item.name} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-xl uppercase text-primary-900">{item.name}</h3>
                  <p className="mt-1 flex-1 text-sm text-primary-800/80">{item.blurb}</p>
                  <span className="mt-3 text-sm font-bold uppercase text-primary-600 group-hover:underline">View menu &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title">Authentic Pakistani cuisine since day one</h2>
            <p className="mt-5 text-primary-800/80">
              At The Pan N Grill, we bring you the authentic taste of Pakistan with every dish. Traditional recipes and the freshest ingredients go into everything we serve.
            </p>
            <p className="mt-4 text-primary-800/80">
              From our signature pizzas with Pakistani spices to perfectly grilled shawarmas and juicy burgers, every item on our menu is crafted with passion and served with pride.
            </p>
            <Link href="/about" className="btn-primary mt-8">Learn more about us</Link>
          </div>
          <div className="relative h-72 overflow-hidden rounded-lg shadow-lift sm:h-96">
            <Image src="/images/1.png" alt="Inside The Pan N Grill" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-primary-900 py-14 text-white">
        <div className="container-page grid gap-8 text-center md:grid-cols-3 md:text-left">
          <div>
            <h3 className="text-2xl uppercase text-gold-400">Find us</h3>
            <p className="mt-2 text-gray-300">
              {SITE.address[0]}
              <br />
              {SITE.address[1]}
            </p>
          </div>
          <div>
            <h3 className="text-2xl uppercase text-gold-400">Call to order</h3>
            <p className="mt-2 text-gray-300">
              {SITE.phones.map((phone) => (
                <a key={phone.href} href={phone.href} className="block hover:text-gold-400">{phone.label}</a>
              ))}
            </p>
          </div>
          <div>
            <h3 className="text-2xl uppercase text-gold-400">Follow us</h3>
            <div className="mt-3 flex justify-center gap-3 md:justify-start">
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full bg-white/10 p-3 hover:bg-primary-600">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href={SITE.whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="rounded-full bg-white/10 p-3 hover:bg-primary-600">
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
