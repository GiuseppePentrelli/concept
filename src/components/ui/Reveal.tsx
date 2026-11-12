import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE_OUT } from '../../lib/motion';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}

/** Reveal editoriale allo scroll: una sola volta, solo transform e opacity. */
export function Reveal({ children, delay = 0, className, y = 18 }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -70px 0px' }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}
