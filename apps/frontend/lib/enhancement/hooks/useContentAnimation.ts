// useContentAnimation Hook
// 处理内容动画逻辑

import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import { AnimationTrigger } from '../types';

interface UseContentAnimationOptions {
  trigger?: AnimationTrigger;
  delay?: number;
  onComplete?: () => void;
}

/**
 * 内容动画 Hook
 * 支持 onMount、onVisible、onSwipe 三种触发方式
 */
export const useContentAnimation = ({
  trigger = { type: 'onVisible', threshold: 0.3 },
  delay = 0,
  onComplete,
}: UseContentAnimationOptions = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // 使用 framer-motion 的 useInView
  const isInView = useInView(ref, {
    once: trigger.type === 'onVisible',
    margin: `-${(1 - (trigger.threshold || 0.3)) * 100}% 0px`,
  });

  useEffect(() => {
    if (trigger.type === 'onMount') {
      // 组件挂载时立即触发
      const timer = setTimeout(() => {
        setShouldAnimate(true);
        setHasAnimated(true);
        onComplete?.();
      }, delay);
      return () => clearTimeout(timer);
    }

    if (trigger.type === 'onVisible' && isInView && !hasAnimated) {
      // 可见时触发
      const timer = setTimeout(() => {
        setShouldAnimate(true);
        setHasAnimated(true);
        onComplete?.();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [trigger.type, isInView, delay, hasAnimated, onComplete]);

  return {
    ref,
    shouldAnimate,
    isInView,
    hasAnimated,
  };
};

/**
 * 段落交错动画 Hook
 * 用于多段文字的交错进入效果
 */
export const useStaggerAnimation = (itemCount: number, stagger: number = 150) => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  useEffect(() => {
    if (!isInView) return;

    const timers: NodeJS.Timeout[] = [];

    for (let i = 0; i < itemCount; i++) {
      const timer = setTimeout(() => {
        setVisibleItems((prev) => [...prev, i]);
      }, i * stagger);
      timers.push(timer);
    }

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [isInView, itemCount, stagger]);

  return {
    ref,
    visibleItems,
    isItemVisible: (index: number) => visibleItems.includes(index),
  };
};

/**
 * 打字机效果 Hook
 */
export const useTypewriter = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [isInView, text, speed]);

  return {
    ref,
    displayText,
    isComplete,
  };
};
