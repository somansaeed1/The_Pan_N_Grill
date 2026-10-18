import Link from 'next/link';
import Image from 'next/image';

const SPECIALTIES = [
  { id: 'special-pizza', name: 'Special Pizzas', image: '/images/pizza.jpg', blurb: 'Authentic Pakistani-style pizzas with traditional flavors' },
  { id: 'special-shawarmas', name: 'Shawarmas', image: '/images/Shawarmas.jpg', blurb: 'Fresh and flavorful shawarmas made with premium ingredients' },
  { id: 'chorizo-burger', name: 'Burgers', image: '/images/Burgers.jpg', blurb: 'Juicy burgers with Pakistani spices and fresh toppings' },
  { id: 'fried-items', name: 'Fried Items', image: '/images/Fried.jpg', blurb: 'Crispy and delicious fried chicken and broast' },
];

export default function HomePage() {
  return (
    <div className="pt-16">
      <section className="relative isolate flex min-h-[540px] items-center overflow-hidden bg-primary-900 lg:min-h-[620px]">
        <Image
          src="/images/2.png"
          alt="The Pan N Grill shop front at Adhiwal Chowk"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-primary-900/65 lg:bg-gradient-to-r lg:from-primary-900/95 lg:via-primary-900/70 lg:to-primary-900/10" />

        <div className="container-page py-16">
          <p className="inline-block border-l-4 border-primary-600 pl-3 text-sm font-bold uppercase tracking-widest text-gold-400">
            Adhiwal Chowk, Jhang
          </p>
          <h1 className="mt-4 max-w-2xl text-5xl uppercase leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Real Pakistani taste, <span className="text-gold-400">made fresh</span> to order
          </h1>
          <p className="mt-5 max-w-lg text-lg text-stone-200">
            Pizzas, shawarmas and burgers from our kitchen to your door, or come and sit with us.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/menu" className="btn-primary">Order online</Link>
            <Link href="/contact" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-900">
              Visit the shop
            </Link>
          </div>
        </div>
      </section>

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

    </div>
  );
}
