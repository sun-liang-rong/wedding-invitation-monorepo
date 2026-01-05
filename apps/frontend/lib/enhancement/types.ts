// Enhanced Wedding Component Types
// 增强婚礼组件类型定义

export interface EnhancedWeddingProps {
  // 基础信息
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime?: string;
  hotelName: string;
  hotelAddress: string;
  musicUrl: string;
  photos: string[];

  // 内容增强
  content?: ContentConfig;
  
  // 图片结构
  images?: ImageStructure;
  
  // 动画配置
  animation?: AnimationConfig;
  
  // 交互模式
  interactionMode?: InteractionMode;
  
  // 埋点回调
  onContentView?: (sectionId: string) => void;
  onAnimationComplete?: (animationId: string) => void;
  onInteraction?: (type: string, data: any) => void;
}

// 内容配置
export interface ContentConfig {
  coverStory?: string;
  loveStory?: LoveStoryConfig;
  weddingExpectation?: string;
  guestThankYou?: string;
  customSections?: ContentSection[];
  style?: ContentStyle;
}

export type ContentStyle = 'romantic' | 'modern' | 'traditional' | 'casual';

export interface LoveStoryConfig {
  meeting?: string[];
  dating?: string[];
  proposal?: string[];
  custom?: { title: string; paragraphs: string[] }[];
}

export interface ContentSection {
  id: string;
  type: 'story' | 'blessing' | 'custom';
  title?: string;
  paragraphs: string[];
  style?: 'narrative' | 'poetic' | 'casual';
}

// 图片配置
export interface ImageStructure {
  cover?: ImageConfig[];
  story?: ImageConfig[];
  gallery?: ImageConfig[];
  background?: ImageConfig;
}

export interface ImageConfig {
  url: string;
  role: ImageRole;
  alt?: string;
  aspectRatio?: string;
  priority?: boolean;
  lazyLoad?: boolean;
  section?: string;
}

export type ImageRole = 'primary' | 'secondary' | 'background';

export interface ImageRequirement {
  min: number;
  max: number;
  roles: ImageRole[];
  aspectRatio?: string;
}

// 动画配置
export interface AnimationConfig {
  mode?: AnimationMode;
  timing?: AnimationTiming;
  triggers?: AnimationTrigger[];
  disabled?: boolean;
  presets?: string[];
}

export type AnimationMode = 'auto' | 'manual';

export interface AnimationTiming {
  stagger?: number;
  duration?: number;
  easing?: string;
  autoScrollSpeed?: number;
}

export interface AnimationTrigger {
  type: 'onMount' | 'onVisible' | 'onSwipe';
  threshold?: number;
}

export interface AnimationSequence {
  id: string;
  elements: AnimationElement[];
  triggers: AnimationTrigger[];
  status: 'pending' | 'playing' | 'completed';
}

export interface AnimationElement {
  target: string;
  from: React.CSSProperties;
  to: React.CSSProperties;
  duration: number;
  delay: number;
  easing: string;
}

// 交互模式
export type InteractionMode = 'auto-scroll' | 'swipe' | 'hybrid';

export interface InteractionConfig {
  mode: InteractionMode;
  autoScrollSpeed?: number;
  swipeThreshold?: number;
  enableKeyboard?: boolean;
}

// 埋点数据
export interface AnalyticsEvent {
  type: 'content_view' | 'animation_complete' | 'interaction' | 'scroll';
  timestamp: number;
  data: Record<string, any>;
}

// 组件类型
export type ComponentType = 
  | 'cover'
  | 'narrative'
  | 'gallery'
  | 'card'
  | 'story'
  | 'parallax';

// 验证结果
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
