import type { Variants, Transition } from 'framer-motion';

// ─── Easing curves ───────────────────────────────────────────────────────────
export const easeOutQuart: [number, number, number, number] = [0.25, 1, 0.5, 1];
export const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Shared transitions ───────────────────────────────────────────────────────
export const revealTransition: Transition = {
  duration: 0.55,
  ease: easeOutQuart,
};

export const heroTransition: Transition = {
  duration: 0.7,
  ease: easeOutExpo,
};

// ─── Scroll-reveal variants ───────────────────────────────────────────────────

/** Stagger container — add to the wrapping div */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

/** Default fade + slide item */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: revealTransition,
  },
};

/** Slide in from left */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: revealTransition,
  },
};

/** Slide in from right */
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: revealTransition,
  },
};

/** Scale reveal (for dividers, icons) */
export const scaleReveal: Variants = {
  hidden: { opacity: 0, scaleX: 0, originX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.55, ease: easeOutExpo },
  },
};

// ─── Hero variants ────────────────────────────────────────────────────────────

export const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

export const heroItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: heroTransition,
  },
};

// ─── Error shake ──────────────────────────────────────────────────────────────
export const shakeVariant: Variants = {
  idle: { x: 0 },
  shake: {
    x: [0, -9, 9, -6, 6, -3, 3, 0],
    transition: { duration: 0.55, ease: 'easeInOut' },
  },
};
