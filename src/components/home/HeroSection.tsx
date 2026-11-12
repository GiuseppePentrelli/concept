import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import statue from '../../assets/images/hero-statue.webp';
import { WaterEffect } from './WaterEffect';
import { EASE_OUT } from '../../lib/motion';

const line = {
  hidden: { y: '108%' },
  show: (i: number) => ({ y: 0, transition: { duration: 1.15, ease: EASE_OUT, delay: 0.3 + i * 0.1 } }),
};

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT, delay: 0.2 + i * 0.12 } }),
};

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const flashRef = useRef<HTMLImageElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 70]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -24]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const driftX = useSpring(pointerX, { stiffness: 50, damping: 18, mass: 1 });
  const driftY = useSpring(pointerY, { stiffness: 50, damping: 18, mass: 1 });
  const mistX = useTransform(driftX, (v) => v * -2.2);
  const mistY = useTransform(driftY, (v) => v * -2.2);

  useEffect(() => {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * -14);
      pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * -9);
    };
    const onLeave = () => {
      pointerX.set(0);
      pointerY.set(0);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced, pointerX, pointerY]);

  return (
    <section
      ref={ref}
      aria-label="CONCEPT Clothing Collection"
      className="grain relative overflow-hidden bg-ink md:h-[clamp(520px,62.6vw,1040px)]"
    >
      {/* fumo di fondo */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-6%]"
        style={{
          x: mistX,
          y: mistY,
          background:
            'radial-gradient(ellipse 34% 40% at 46% 44%, rgba(120,120,125,0.13), transparent 70%), radial-gradient(ellipse 30% 36% at 20% 78%, rgba(90,90,95,0.1), transparent 72%)',
        }}
      />

      {/* statua + acqua */}
      <motion.div
        className="absolute left-1/2 top-[58px] w-[118%] -translate-x-1/2 md:left-auto md:right-0 md:top-[9.2%] md:w-[63.2%] md:translate-x-0"
        style={{ y: imageY }}
      >
        <motion.div
          className="hero-mask relative aspect-[478/440]"
          style={{ x: driftX, y: driftY }}
          initial={{ opacity: 0, scale: 1.045 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, ease: EASE_OUT }}
        >
          <img
            src={statue}
            alt="Volto monumentale di una statua classica in pietra, segnato da crepe e rivoli d'acqua"
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
            draggable={false}
          />
          <img
            ref={flashRef}
            src={statue}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover opacity-0 mix-blend-screen"
            style={{ filter: 'brightness(1.9) contrast(1.25)' }}
          />
          <WaterEffect flashRef={flashRef} />
        </motion.div>
      </motion.div>

      {/* leggibilità su mobile */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[40%] bg-gradient-to-b from-transparent via-ink/70 to-ink md:hidden"
      />

      <motion.div
        className="relative flex flex-col items-center px-6 pb-10 pt-[calc(54px+62vw)] text-center md:absolute md:left-[8.2vw] md:top-[35.5%] md:items-start md:p-0 md:text-left"
        style={{ y: textY }}
        initial="hidden"
        animate="show"
      >
        <motion.p
          variants={fade}
          custom={0}
          className="eyebrow text-[9px] text-bone/80 md:text-[clamp(11px,1.16vw,19px)] md:tracking-[0.78em] md:text-bone"
          style={{ marginRight: '-0.42em' }}
        >
          Concept
        </motion.p>

        <h1 className="display mt-2.5 text-[clamp(25px,7.1vw,40px)] tracking-[0.2em] text-bone md:mt-[2.2vw] md:text-[clamp(30px,4.15vw,70px)] md:leading-[1.14] md:tracking-[0.37em]">
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span className="block" variants={line} custom={0} style={{ marginRight: '-0.2em' }}>
              Clothing
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span className="block" variants={line} custom={1} style={{ marginRight: '-0.2em' }}>
              Collection
            </motion.span>
          </span>
        </h1>

        <motion.span
          aria-hidden="true"
          className="mt-4 block h-[1.5px] w-[76px] origin-center bg-bone/90 md:mt-[2.3vw] md:w-[8.8vw] md:origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.75 }}
        />

        <motion.p
          variants={fade}
          custom={5}
          className="mt-7 font-serif text-[11px] font-medium uppercase leading-[2] tracking-[0.36em] text-bone/90 md:mt-[2.6vw] md:text-[clamp(11px,1.16vw,19px)] md:leading-[1.95] md:tracking-[0.5em]"
        >
          Più di un brand,
          <br />
          un concetto.
        </motion.p>

        <motion.div variants={fade} custom={6.5} className="mt-6 md:mt-[2.5vw]">
          <Link
            to="/drops"
            className="btn btn-solid !min-h-[46px] !gap-7 !px-9 !text-[10.5px] md:!min-h-[clamp(44px,3.9vw,62px)] md:!gap-[2.4vw] md:!px-[3.3vw] md:!text-[clamp(10px,0.84vw,13.5px)]"
          >
            Scopri i drops
            <ArrowRight className="btn-arrow h-[17px] w-[17px] md:h-5 md:w-5" strokeWidth={1.3} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
