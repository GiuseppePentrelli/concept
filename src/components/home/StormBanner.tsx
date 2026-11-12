import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import storm from '../../assets/images/storm.webp';
import { LightningEffect } from './LightningEffect';
import { Reveal } from '../ui/Reveal';
import { DROP } from '../../data/collections';

const STORM_RATIO = 2172 / 724;

interface Props {
  to?: string;
  cta?: string;
}

export function StormBanner({ to = '/drops', cta = 'Scopri la collezione' }: Props) {
  const ref = useRef<HTMLElement>(null);
  const flashRef = useRef<HTMLImageElement>(null);
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-5%', '5%']);
  const fogY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['4%', '-4%']);

  return (
    <section
      ref={ref}
      data-paused={!active}
      aria-labelledby="drop-00-title"
      className="grain relative h-[400px] overflow-hidden border-y border-[#3a3a3a] bg-black md:h-[clamp(300px,26.8vw,470px)]"
    >
      <motion.div className="absolute inset-x-0 inset-y-[-7%]" style={{ y }}>
        <img
          src={storm}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover object-[16%_50%] md:object-center"
        />
        <img
          ref={flashRef}
          src={storm}
          alt=""
          aria-hidden="true"
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover object-[16%_50%] opacity-0 mix-blend-screen md:object-center"
          style={{
            filter: 'brightness(3.1) contrast(1.2)',
            WebkitMaskImage: 'radial-gradient(ellipse 120% 190% at var(--fx, 70%) 0%, #000 22%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.2) 100%)',
            maskImage: 'radial-gradient(ellipse 120% 190% at var(--fx, 70%) 0%, #000 22%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.2) 100%)',
          }}
        />
        <LightningEffect flashRef={flashRef} imageRatio={STORM_RATIO} onActiveChange={setActive} />
      </motion.div>

      <motion.div aria-hidden="true" className="absolute inset-0" style={{ y: fogY }}>
        <div className="fog fog-a" />
        <div className="fog fog-b" />
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_62%_at_50%_50%,rgba(0,0,0,0.72),transparent_78%)] md:bg-[radial-gradient(ellipse_46%_70%_at_50%_50%,rgba(0,0,0,0.5),transparent_75%)]"
      />

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <h2
            id="drop-00-title"
            className="font-serif text-[clamp(21px,6.4vw,30px)] font-medium uppercase italic leading-tight tracking-[0.26em] text-bone md:text-[clamp(22px,2.85vw,48px)] md:tracking-[0.32em]"
            style={{ marginRight: '-0.26em' }}
          >
            {DROP.code}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 font-sans text-[10px] font-normal uppercase leading-[2.3] tracking-[0.42em] text-bone/90 md:mt-[1.7vw] md:text-[clamp(10px,0.92vw,15px)] md:tracking-[0.5em]">
            {DROP.title}
            <br />
            {DROP.subtitle}
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <Link
            to={to}
            className="btn btn-outline mt-7 !min-h-[50px] !px-8 !text-[10.5px] md:mt-[2.1vw] md:!min-h-[clamp(46px,4vw,64px)] md:!px-[3.2vw] md:!text-[clamp(10px,0.88vw,14px)] md:!tracking-[0.34em]"
          >
            {cta}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
