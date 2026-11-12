import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { NAV_LINKS } from '../../data/site';
import { useUI } from '../../store/ui';
import { useCart } from '../../store/cart';

interface Props {
  overlayHero: boolean;
}

export function Header({ overlayHero }: Props) {
  const { open, user } = useUI();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-40 h-0">
      <header
        data-scrolled={scrolled}
        className={`group/header absolute inset-x-0 top-0 h-[var(--header-h)] border-b transition-[background-color,border-color,height,backdrop-filter] duration-300 ease-out data-[scrolled=true]:h-16 data-[scrolled=true]:border-line-soft data-[scrolled=true]:bg-ink/85 data-[scrolled=true]:backdrop-blur-md lg:data-[scrolled=true]:h-[84px] ${
          overlayHero ? 'border-transparent' : 'border-line-soft'
        }`}
      >
        <div className="relative mx-auto flex h-full max-w-[1680px] items-center justify-between pl-2 pr-1.5 lg:pl-[var(--gutter)] lg:pr-[clamp(16px,2.7vw,40px)]">
          <button
            type="button"
            className="icon-btn lg:hidden"
            onClick={() => open('menu')}
            aria-label="Apri il menu"
            aria-haspopup="dialog"
          >
            <Menu size={26} strokeWidth={1.4} />
          </button>

          <Link
            to="/"
            aria-label="CONCEPT — Homepage"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out group-data-[scrolled=true]/header:scale-[0.86] lg:static lg:translate-x-0 lg:translate-y-0 lg:origin-left lg:group-data-[scrolled=true]/header:scale-[0.62]"
          >
            <span className="block lg:hidden">
              <Logo size="md" />
            </span>
            <span className="hidden lg:block">
              <Logo size="lg" />
            </span>
          </Link>

          <nav
            aria-label="Navigazione principale"
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-[clamp(40px,5.6vw,84px)] lg:flex"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="group relative py-3 font-sans text-[13px] font-normal uppercase tracking-[0.32em] text-bone/90 transition-colors duration-200 hover:text-white"
                style={{ marginRight: '-0.32em' }}
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute bottom-1.5 left-0 right-[0.32em] h-px origin-left bg-bone transition-transform duration-300 ease-out ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center lg:gap-3">
            <button type="button" className="icon-btn" onClick={() => open('search')} aria-label="Cerca">
              <Search size={23} strokeWidth={1.5} className="lg:h-[26px] lg:w-[26px]" />
            </button>
            <button
              type="button"
              className="icon-btn relative hidden lg:inline-grid"
              onClick={() => open('account')}
              aria-label={user ? 'Il tuo profilo' : 'Accedi'}
            >
              <User size={27} strokeWidth={1.5} />
              {user && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-bone" />}
            </button>
            <button
              type="button"
              className="icon-btn relative"
              onClick={() => open('cart')}
              aria-label={`Carrello, ${count} ${count === 1 ? 'articolo' : 'articoli'}`}
            >
              <ShoppingBag size={24} strokeWidth={1.5} className="lg:h-[27px] lg:w-[27px]" />
              <span
                key={count}
                className="absolute right-0.5 top-1 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-bone px-1 text-[10px] font-semibold leading-none text-ink [animation:badge-pop_260ms_var(--ease-out)]"
              >
                {count}
              </span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
