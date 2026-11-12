import { useId, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { EASE_OUT } from '../../lib/motion';

export interface AccordionItem {
  id: string;
  title: string;
  icon: LucideIcon;
  content: ReactNode;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const base = useId();

  return (
    <div className="border-t border-line">
      {items.map(({ id, title, icon: Icon, content }) => {
        const open = openId === id;
        return (
          <div key={id} className="border-b border-line">
            <h3>
              <button
                type="button"
                id={`${base}-${id}-trigger`}
                aria-expanded={open}
                aria-controls={`${base}-${id}-panel`}
                onClick={() => setOpenId(open ? null : id)}
                className="flex h-[58px] w-full items-center gap-4 px-1 text-left text-[15px] text-bone transition-opacity duration-150 active:opacity-60"
              >
                <Icon size={21} strokeWidth={1.3} className="shrink-0 text-bone/90" />
                <span className="flex-1">{title}</span>
                <ChevronDown
                  size={20}
                  strokeWidth={1.3}
                  className="transition-transform duration-300 ease-out"
                  style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={`${base}-${id}-panel`}
                  role="region"
                  aria-labelledby={`${base}-${id}-trigger`}
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } }}
                  transition={{ duration: 0.32, ease: EASE_OUT }}
                >
                  <div className="pb-6 pl-[41px] pr-2 text-[14px] leading-[1.65] text-bone/75">{content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
