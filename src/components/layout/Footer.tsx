import { Link } from 'react-router-dom';
import { Heart, Lock, PackageCheck, Truck, type LucideIcon } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { SocialIcon } from '../ui/SocialIcon';
import { Newsletter } from './Newsletter';
import { FOOTER_CONCEPT, FOOTER_SHOP, LEGAL_LINKS, SOCIAL_LINKS } from '../../data/site';
import { useUI } from '../../store/ui';

const BENEFITS: { icon: LucideIcon; lines: [string, string] }[] = [
  { icon: Truck, lines: ['Spedizione rapida', 'in 24/48h'] },
  { icon: PackageCheck, lines: ['Reso facile', 'entro 14 giorni'] },
  { icon: Lock, lines: ['Pagamenti sicuri', 'e crittografati'] },
  { icon: Heart, lines: ['Supporto clienti', 'sempre attivo'] },
];

function LinkColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h3 className="font-serif text-[15px] font-semibold uppercase tracking-[0.14em] text-bone">{title}</h3>
      <ul className="mt-3.5 space-y-1.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="inline-block py-0.5 text-[14px] text-bone/85 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { notify } = useUI();

  return (
    <footer className="border-t border-line bg-[#0a0a0a]">
      <div className="shell">
        <ul className="grid grid-cols-2 gap-y-10 py-11 lg:grid-cols-4 lg:py-[52px]">
          {BENEFITS.map(({ icon: Icon, lines }) => (
            <li key={lines[0]} className="flex flex-col items-center text-center">
              <Icon size={34} strokeWidth={1.15} className="text-bone" />
              <p className="mt-5 font-sans text-[9.5px] font-medium uppercase leading-[2.1] tracking-[0.3em] text-bone/90 sm:text-[11px]">
                {lines[0]}
                <br />
                {lines[1]}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line-soft">
        <div className="shell grid gap-x-8 gap-y-11 py-12 sm:grid-cols-2 lg:grid-cols-[1.45fr_1fr_1fr_1.35fr] lg:py-[46px]">
          <div className="flex items-center justify-center sm:col-span-2 sm:justify-start lg:col-span-1">
            <Link to="/" aria-label="CONCEPT — Homepage">
              <Logo size="lg" className="origin-left max-lg:scale-90" />
            </Link>
          </div>
          <LinkColumn title="Shop" links={FOOTER_SHOP} />
          <LinkColumn title="Concept" links={FOOTER_CONCEPT} />
          <div className="sm:col-span-2 lg:col-span-1">
            <Newsletter />
          </div>
        </div>
      </div>

      <div className="border-t border-line-soft">
        <div className="shell flex flex-col items-center gap-5 py-5 lg:flex-row lg:justify-between lg:py-4">
          <div className="-ml-2.5 flex items-center gap-1">
            {SOCIAL_LINKS.map((s) => (
              <button
                key={s.id}
                type="button"
                className="icon-btn"
                aria-label={s.label}
                onClick={() => notify(`${s.label}: profilo non collegato nella demo`)}
              >
                <SocialIcon id={s.id} />
              </button>
            ))}
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-x-9 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="py-2 text-[12.5px] text-bone/85 transition-colors duration-200 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-center text-[12.5px] text-bone/85">© 2026 CONCEPT. All rights reserved.</p>
        </div>
        <p className="shell pb-5 text-center text-[10.5px] tracking-[0.06em] text-smoke">
          Prototipo dimostrativo — prezzi, condizioni e testi legali sono segnaposto.
        </p>
      </div>
    </footer>
  );
}
