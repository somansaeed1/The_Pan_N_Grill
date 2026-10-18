import Link from 'next/link';
import { FacebookIcon, WhatsAppIcon } from './icons';
import { NAV_ITEMS, SITE } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-gray-300">
      <div className="stripes" aria-hidden="true" />
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <h3 className="font-heading text-2xl font-bold uppercase text-gold-400">{SITE.name}</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed">
            Authentic Pakistani flavors, freshly made and delivered hot. Pizzas, shawarmas, burgers and more from the heart of Jhang.
          </p>
          <div className="mt-4 flex gap-2">
            <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full bg-white/10 p-2.5 hover:bg-primary-600">
              <FacebookIcon />
            </a>
            <a href={SITE.whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="rounded-full bg-white/10 p-2.5 hover:bg-primary-600">
              <WhatsAppIcon />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-lg uppercase text-white">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV_ITEMS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-gold-400">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-lg uppercase text-white">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {SITE.phones.map((phone) => (
              <li key={phone.href}><a href={phone.href} className="hover:text-gold-400">{phone.label}</a></li>
            ))}
            <li>
              <a href={SITE.whatsapp.href} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400">
                WhatsApp {SITE.whatsapp.label}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">
        &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
