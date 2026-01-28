// 1. Hiệu ứng Fade In Up 
export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: delay, 
      duration: 0.6, 
      ease: "easeOut" 
    }
  })
};

// 2. Hiệu ứng Fade In Left 
export const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { 
      delay: delay, 
      duration: 0.8, 
      ease: "easeOut" 
    }
  })
};

// 3. Hiệu ứng Scale 
export const zoomIn = {
  hidden: (scaleStart = 0) => ({ 
    opacity: 0, 
    scale: scaleStart 
  }),
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { 
      delay: delay, 
      duration: 0.8, 
      ease: "easeOut" 
    }
  })
};

// 4. Container (Gộp staggerContainer + gridContainer)
// custom = { stagger: 0.1, delay: 0 }
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: ({ stagger = 0.1, delay = 0 } = {}) => ({
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  }),
};

// 5. Item nảy lên dùng cho nãy chữ
export const springIn = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      ...(delay > 0 && { delay: delay }),  
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  }),
};

// 6. Hiệu ứng Hover 
export const hoverSpring = {
  y: -10,
  transition: { 
    type: "spring", 
    stiffness: 300, 
    damping: 20 
  }
};

// 7. Hiệu ứng Float Y
export const floatY = {
  animate: { y: [0, -10, 0] },
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
};

// 7. Hiệu ứng Float X
export const floatX = {
  animate: { x: [0, 10, 0] },
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
};

export const floatingAnimation = {
    y: [0, -15, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
};

export const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1, x: 0,
        transition: { delay: 0.5, duration: 1, ease: "easeOut" }
    },
};


// Animation cho cả xuất hiện lên và biến mất
// Dành cho các panel
export const panelVariants = {
  hidden: { 
    height: 0, 
    opacity: 0, 
    scale: 0.98,
    transition: { duration: 0.3, ease: "easeInOut" } // Thời gian lúc biến mất
  },
  visible: { 
    height: "auto", 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: "easeInOut" } // Thời gian lúc hiện ra
  },
  exit: { 
    height: 0, 
    opacity: 0, 
    scale: 0.98,
    transition: { duration: 0.2, ease: "easeInOut" } // Mẹo: Lúc thoát cho nhanh hơn xíu (0.2s) cảm giác sẽ mượt hơn
  }
};


// dành cho các list
export const fadeInBottom = {
  hidden: { 
    opacity: 0, 
    y: 20, // Nằm ở dưới một chút
  },
  visible: { 
    opacity: 1, 
    y: 0, // Bay về vị trí gốc
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20, // Bay lên trên một chút rồi biến mất
    transition: { 
      duration: 0.3, // Lúc biến mất nên nhanh hơn lúc hiện xíu cho mượt
      ease: "easeIn" 
    }
  }
};
