// Animation Presets - 动画预设配置
// 提供常用的动画效果预设

import { Variants } from 'framer-motion';

export const ANIMATION_PRESETS = {
  // 淡入上滑
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  } as Variants,

  // 淡入下滑
  fadeInDown: {
    hidden: { opacity: 0, y: -40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  } as Variants,

  // 缩放进入
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  } as Variants,

  // 图片交错进入
  staggerImages: {
    hidden: { opacity: 0, scale: 0.9, rotate: -5 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        type: 'spring',
        stiffness: 60,
      },
    }),
  } as Variants,

  // 打字机效果
  typewriter: {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: '100%',
      opacity: 1,
      transition: {
        width: { duration: 2, ease: 'linear' },
        opacity: { duration: 0.3 },
      },
    },
  } as Variants,

  // 视差滚动
  parallaxScroll: (speed: number = 0.5) => ({
    scrollBased: true,
    speed,
  }),

  // 浮动效果
  float: {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  } as Variants,

  // 脉冲效果
  pulse: {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  } as Variants,

  // 旋转进入
  rotateIn: {
    hidden: { opacity: 0, rotate: -180, scale: 0.5 },
    visible: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  } as Variants,

  // 从左滑入
  slideInLeft: {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  } as Variants,

  // 从右滑入
  slideInRight: {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  } as Variants,

  // 容器交错动画
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  } as Variants,

  // 子元素动画
  staggerItem: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  } as Variants,

  // 图片揭示效果
  imageReveal: {
    hidden: { clipPath: 'inset(0 100% 0 0)' },
    visible: {
      clipPath: 'inset(0 0% 0 0)',
      transition: {
        duration: 1.2,
        ease: [0.65, 0, 0.35, 1],
      },
    },
  } as Variants,

  // 悬停放大
  hoverScale: {
    hover: {
      scale: 1.05,
      y: -8,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  } as Variants,

  // 悬停旋转
  hoverRotate: {
    hover: {
      rotate: 5,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  } as Variants,
};

// 缓动函数
export const EASING_FUNCTIONS = {
  easeOut: [0.22, 1, 0.36, 1],
  easeIn: [0.4, 0, 1, 1],
  easeInOut: [0.65, 0, 0.35, 1],
  spring: { type: 'spring', stiffness: 100, damping: 15 },
  springBouncy: { type: 'spring', stiffness: 200, damping: 10 },
  springSmooth: { type: 'spring', stiffness: 60, damping: 20 },
  linear: 'linear',
};

// 动画时序配置
export const TIMING_PRESETS = {
  fast: {
    stagger: 50,
    duration: 400,
    easing: 'easeOut',
  },
  normal: {
    stagger: 150,
    duration: 800,
    easing: 'easeOut',
  },
  slow: {
    stagger: 300,
    duration: 1200,
    easing: 'easeOut',
  },
  elegant: {
    stagger: 200,
    duration: 1000,
    easing: 'spring',
  },
};
