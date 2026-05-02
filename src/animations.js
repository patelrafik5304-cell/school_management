import { motion } from 'framer-motion';

// Page transition variants
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

// Stagger container for lists
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Individual item variants for staggered animations
export const staggerItem = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 }
};

// Card hover animations
export const cardHover = {
  rest: { scale: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  hover: { 
    scale: 1.05, 
    boxShadow: '0 20px 40px rgba(37, 99, 235, 0.3)',
    transition: { type: 'spring', stiffness: 300 }
  }
};

// Button animations
export const buttonTap = {
  tap: { scale: 0.95 }
};

// Text reveal animation
export const textReveal = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// Hero section animations
export const heroVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  }
};

// Slide in from left
export const slideLeft = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 }
};

// Slide in from right
export const slideRight = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 }
};

// Floating animation
export const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Pulse glow animation
export const pulseGlow = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(37, 99, 235, 0.3)',
      '0 0 40px rgba(37, 99, 235, 0.6)',
      '0 0 20px rgba(37, 99, 235, 0.3)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Rotate in animation
export const rotateIn = {
  initial: { opacity: 0, rotate: -180, scale: 0 },
  animate: { opacity: 1, rotate: 0, scale: 1 }
};

// Bounce animation
export const bounceIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20
    }
  }
};

// Modal animations
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.8, y: 50 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: 50 }
};

// Table row animations
export const tableRow = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 }
};

// Navbar animation
export const navbarVariants = {
  initial: { y: -100 },
  animate: { y: 0 },
  transition: { type: 'spring', stiffness: 100 }
};

// Gradient animation for text
export const gradientText = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// 3D tilt animation
export const tilt3D = {
  rest: { rotateX: 0, rotateY: 0 },
  hover: {
    rotateX: 5,
    rotateY: 5,
    transition: { type: 'spring', stiffness: 300 }
  }
};

// Smooth scroll reveal
export const scrollReveal = {
  offscreen: { opacity: 0, y: 50 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', bounce: 0.4, duration: 1 }
  }
};

// Notification toast
export const toastVariants = {
  initial: { opacity: 0, x: 300 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 300 }
};

// Loading spinner
export const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};
