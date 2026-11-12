import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { EASE_OUT } from '../../lib/motion';

interface Props {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  spectrum?: boolean;
}

export function PageHeader({ eyebrow, title, children, spectrum }: Props) {
  return (
    <header className="shell pb-9 pt-10 text-center md:pb-14 md:pt-16">
      {eyebrow && (
        <motion.p
          className="eyebrow text-[11px] text-bone/80 md:text-[14px]"
          style={{ marginRight: '-0.42em' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {eyebrow}
        </motion.p>
      )}
      <h1 className="display mt-3 overflow-hidden text-[clamp(28px,8vw,40px)] tracking-[0.22em] md:text-[clamp(40px,4.4vw,68px)] md:tracking-[0.3em]">
        <motion.span
          className={`block ${spectrum ? 'spectrum' : ''}`}
          style={{ marginRight: '-0.22em' }}
          initial={{ y: '105%' }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.12 }}
        >
          {title}
        </motion.span>
      </h1>
      <motion.span
        aria-hidden="true"
        className="mx-auto mt-6 block h-px w-24 bg-bone/80"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.45 }}
      />
      {children && (
        <motion.div
          className="mx-auto mt-6 max-w-[620px] text-[15px] leading-[1.7] text-bone/75 md:text-[16px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.4 }}
        >
          {children}
        </motion.div>
      )}
    </header>
  );
}
