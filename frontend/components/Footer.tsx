import Link from 'next/link';
import Image from 'next/image';
import { FacebookIcon, WhatsAppIcon } from './icons';
import { MENU_LINKS, NAV_ITEMS, SITE } from '@/lib/site';

const linkClass = 'inline-block py-1 text-stone-300 transition-colors hover:text-gold-400';
const headingClass = 'mb-3 text-lg uppercase tracking-wide text-white';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-sm text-stone-300">
      <div className="stripes" aria-hidden="true" />

      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/images/pan_n_grill_logo.jpg" alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
            <span className="font-heading text-2xl uppercase text-white">{SITE.name}</span>
          </Link>
          <p className="mt-4 max-w-xs leading-relaxed">
            Pizzas, shawarmas, burgers and more, cooked fresh at Adhiwal Chowk and delivered across Jhang.
          </p>
          <div className="mt-4 flex gap-2">
            <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full bg-white/10 p-2.5 text-white hover:bg-primary-600">
              <FacebookIcon />
            </a>
            <a href={SITE.whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="rounded-full bg-white/10 p-2.5 text-white hover:bg-primary-600">
              <WhatsAppIcon />
            </a>
          </div>
        </div>

        <nav aria-label="Menu categories">
          <h3 className={headingClass}>Order</h3>
          <ul>
            {MENU_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Quick links">
          <h3 className={headingClass}>Quick links</h3>
          <ul>
            {NAV_ITEMS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>{link.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/delivery-zone" className={linkClass}>Delivery area</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className={headingClass}>Contact</h3>
          <address className="space-y-3 not-italic">
            <p>
              {SITE.address[0]}
              <br />
              {SITE.address[1]}
            </p>
            <p>
              {SITE.phones.map((phone) => (
                <a key={phone.href} href={phone.href} className="block py-0.5 hover:text-gold-400">{phone.label}</a>
              ))}
            </p>
            <a href={SITE.whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn-gold !px-5 !py-2 !text-sm">
              Order on WhatsApp
            </a>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-stone-400">
        &copy; {new Date().getFullYear()} {SITE.name}, Jhang. All rights reserved.
      </div>
    </footer>
  );
}
