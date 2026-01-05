// useInteractionMode Hook
// 自动判断最适合的交互模式

import { useMemo } from 'react';
import { InteractionMode, ContentConfig, ImageConfig } from '../types';
import { ContentManager } from '../content/ContentManager';

interface UseInteractionModeOptions {
  content?: ContentConfig;
  images?: ImageConfig[];
  manualMode?: InteractionMode;
  isMobile?: boolean;
}

/**
 * 根据内容复杂度和图片数量自动判断交互模式
 * 
 * 规则：
 * 1. 如果内容段落 > 3，使用 auto-scroll（自动滚动）
 * 2. 如果图片数量 > 4，使用 swipe（滑动切页）
 * 3. 如果两者都满足，使用 hybrid（混合模式）
 * 4. 否则使用 swipe（默认）
 * 5. 手动指定的模式优先级最高
 */
export const useInteractionMode = ({
  content,
  images = [],
  manualMode,
  isMobile = true,
}: UseInteractionModeOptions): InteractionMode => {
  const mode = useMemo(() => {
    // 手动指定优先
    if (manualMode) {
      return manualMode;
    }

    // 计算内容复杂度
    const contentComplexity = content
      ? ContentManager.calculateContentComplexity(content)
      : 0;
    
    const paragraphCount = content
      ? ContentManager.generateParagraphs(content).length
      : 0;

    const imageCount = images.length;

    // 判断逻辑
    const hasComplexContent = contentComplexity > 3 || paragraphCount > 3;
    const hasManyImages = imageCount > 4;

    // PC 端倾向于自动滚动
    if (!isMobile && hasComplexContent) {
      return 'auto-scroll';
    }

    // 移动端判断
    if (hasComplexContent && hasManyImages) {
      return 'hybrid'; // 混合模式：封面自动滚动 + 相册滑动
    }

    if (hasComplexContent) {
      return 'auto-scroll'; // 叙事型内容，自动滚动
    }

    if (hasManyImages) {
      return 'swipe'; // 相册型，滑动切页
    }

    // 默认滑动模式
    return 'swipe';
  }, [content, images, manualMode, isMobile]);

  return mode;
};

/**
 * 获取交互模式的配置参数
 */
export const getInteractionConfig = (mode: InteractionMode) => {
  const configs = {
    'auto-scroll': {
      autoScrollSpeed: 50, // px/s
      enableKeyboard: true,
      swipeThreshold: 80,
    },
    'swipe': {
      swipeThreshold: 80,
      enableKeyboard: true,
      autoScrollSpeed: 0,
    },
    'hybrid': {
      autoScrollSpeed: 30,
      swipeThreshold: 80,
      enableKeyboard: true,
    },
  };

  return configs[mode];
};
