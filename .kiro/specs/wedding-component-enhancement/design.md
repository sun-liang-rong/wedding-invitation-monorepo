# Design Document

## Overview

本设计文档详细规划了婚礼请帖组件增强系统的架构和实现方案。该系统将通过三个核心维度（内容增强、图片结构、动画交互）对现有的 13 个婚礼请帖模板组件进行全面升级，使其达到商业级产品标准。

设计遵循"增强而非重写"的原则，保持现有组件的基础架构和接口，通过扩展 props、优化内容策略和引入动画引擎来提升用户体验。

## Architecture

### 系统分层架构

```
┌─────────────────────────────────────────────────────────┐
│                    Component Layer                       │
│  (WeddingCard, WeddingStory, ClassicParallax, etc.)    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Enhancement Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Content    │  │    Image     │  │  Animation   │ │
│  │   Manager    │  │   Manager    │  │    Engine    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Utility Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Hooks      │  │   Helpers    │  │   Constants  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 核心模块职责

1. **Content Manager**: 管理文案内容的生成、验证和渲染
2. **Image Manager**: 处理图片的加载、布局和响应式适配
3. **Animation Engine**: 控制动画的时序、触发和性能优化
4. **Hooks**: 提供可复用的逻辑（useContentAnimation, useImageSequence, useInteractionMode）
5. **Helpers**: 工具函数（内容验证、图片预加载、动画配置生成）
6. **Constants**: 配置常量（默认文案、动画参数、图片规格）



## Components and Interfaces

### 1. Enhanced Component Props Interface

每个增强后的组件将扩展以下通用接口：

```typescript
interface EnhancedWeddingProps extends BaseWeddingProps {
  // 内容增强
  content?: {
    coverStory?: string;           // 封面故事文案
    loveStory?: string[];          // 爱情故事段落（2-4段）
    weddingExpectation?: string;   // 婚礼期待
    guestThankYou?: string;        // 感谢来宾
    customSections?: ContentSection[];
  };
  
  // 图片结构
  images?: {
    cover?: ImageConfig[];         // 封面图（1-2张）
    story?: ImageConfig[];         // 故事图（2-4张）
    gallery?: ImageConfig[];       // 相册图（3-8张）
    background?: ImageConfig;      // 背景图
  };
  
  // 动画配置
  animation?: {
    mode?: 'auto' | 'manual';      // 自动滚动 or 手动滑动
    timing?: AnimationTiming;      // 动画时序配置
    triggers?: AnimationTrigger[]; // 触发条件
    disabled?: boolean;            // 禁用动画（测试用）
  };
  
  // 交互模式
  interactionMode?: 'auto-scroll' | 'swipe' | 'hybrid';
  
  // 埋点回调
  onContentView?: (sectionId: string) => void;
  onAnimationComplete?: (animationId: string) => void;
  onInteraction?: (type: string, data: any) => void;
}

interface ContentSection {
  id: string;
  type: 'story' | 'blessing' | 'custom';
  title?: string;
  paragraphs: string[];
  style?: 'narrative' | 'poetic' | 'casual';
}

interface ImageConfig {
  url: string;
  role: 'primary' | 'secondary' | 'background';
  alt?: string;
  aspectRatio?: string;
  priority?: boolean;
}

interface AnimationTiming {
  stagger?: number;              // 交错延迟（ms）
  duration?: number;             // 动画时长（ms）
  easing?: string;               // 缓动函数
}

interface AnimationTrigger {
  type: 'onMount' | 'onVisible' | 'onSwipe';
  threshold?: number;            // 可见度阈值（0-1）
}
```



### 2. Content Manager 设计

Content Manager 负责管理和生成婚礼请帖的文案内容。

```typescript
// lib/content/ContentManager.ts
class ContentManager {
  private defaultContent: DefaultContentLibrary;
  
  // 生成内容配置
  generateContent(type: ComponentType, userContent?: Partial<ContentConfig>): ContentConfig {
    const defaults = this.getDefaultContent(type);
    return this.mergeContent(defaults, userContent);
  }
  
  // 验证内容完整性
  validateContent(content: ContentConfig): ValidationResult {
    // 检查必需字段
    // 检查段落数量
    // 检查文案长度
  }
  
  // 格式化文案（添加标点、换行）
  formatContent(content: string): string {
    // 智能分段
    // 添加标点符号
    // 优化排版
  }
}

// lib/content/defaultContent.ts
export const DEFAULT_CONTENT = {
  coverStory: {
    romantic: "在时光的长河中，我们相遇、相知、相爱。今天，我们将携手走进婚姻的殿堂，开启人生新的篇章。",
    modern: "两个人，一个家。从今天起，我们的故事有了新的开始。",
    traditional: "良辰吉日，喜结连理。愿与君共度余生，白首不相离。"
  },
  
  loveStory: {
    meeting: [
      "那是一个平凡的午后，阳光透过咖啡馆的玻璃窗洒在你的脸上。",
      "我端着咖啡走过，不小心撞到了你的肩膀。",
      "你抬起头，我们的目光在空中交汇，那一刻，时间仿佛静止了。"
    ],
    dating: [
      "从那以后，我们开始了无数次的约会。",
      "一起看过的电影，走过的街道，吃过的餐厅，都成为了我们共同的回忆。",
      "每一次相处，都让我更加确定，你就是我要找的那个人。"
    ],
    proposal: [
      "在那个星空璀璨的夜晚，我单膝跪地，向你许下了一生的承诺。",
      "你含着泪水点头的那一刻，是我人生中最幸福的时刻。",
      "从此，我们不再是两个人，而是一个完整的家。"
    ]
  },
  
  weddingExpectation: {
    formal: "诚挚邀请您莅临我们的婚礼现场，见证我们人生中最重要的时刻。您的到来，将是我们最大的荣幸。",
    warm: "在这个特别的日子里，我们希望与最亲爱的家人和朋友分享这份喜悦。期待您的光临，让我们的幸福更加圆满。",
    casual: "我们要结婚啦！希望你能来参加我们的婚礼，一起见证这个美好的时刻。有你在，我们的婚礼才完整。"
  },
  
  guestThankYou: {
    sincere: "感谢您一路以来的陪伴与支持。在我们人生的重要时刻，能有您的见证，是我们莫大的幸福。",
    heartfelt: "千言万语汇成一句话：谢谢你！谢谢你见证我们的爱情，谢谢你分享我们的喜悦。",
    simple: "感谢有你，让我们的婚礼更加温暖。期待与你共度这美好的一天。"
  }
};
```



### 3. Image Manager 设计

Image Manager 负责处理图片的加载、布局和优化。

```typescript
// lib/image/ImageManager.ts
class ImageManager {
  // 根据组件类型确定图片需求
  getImageRequirements(componentType: ComponentType): ImageRequirement {
    const requirements = {
      cover: { min: 1, max: 2, roles: ['primary'] },
      story: { min: 2, max: 4, roles: ['primary', 'secondary'] },
      gallery: { min: 3, max: 8, roles: ['primary'] },
      background: { min: 0, max: 1, roles: ['background'] }
    };
    
    return requirements[componentType];
  }
  
  // 预加载图片
  async preloadImages(images: ImageConfig[]): Promise<void> {
    const priorityImages = images.filter(img => img.priority);
    await Promise.all(priorityImages.map(img => this.loadImage(img.url)));
  }
  
  // 生成响应式图片配置
  generateResponsiveConfig(image: ImageConfig): ResponsiveImageConfig {
    return {
      mobile: { width: 640, quality: 75 },
      tablet: { width: 1024, quality: 80 },
      desktop: { width: 1920, quality: 85 }
    };
  }
  
  // 图片布局策略
  calculateLayout(images: ImageConfig[], containerWidth: number): LayoutConfig {
    // 根据图片数量和角色计算布局
    // 支持网格、瀑布流、堆叠等布局
  }
}

// 图片角色定义
export const IMAGE_ROLES = {
  primary: {
    description: '主视觉图片，用于封面或重点展示',
    aspectRatio: '3:4',
    minWidth: 1200,
    quality: 90
  },
  secondary: {
    description: '辅助图片，用于故事叙述或氛围营造',
    aspectRatio: '4:3',
    minWidth: 800,
    quality: 85
  },
  background: {
    description: '背景图片，用于整体氛围',
    aspectRatio: '16:9',
    minWidth: 1920,
    quality: 80
  }
};
```



### 4. Animation Engine 设计

Animation Engine 是核心动画系统，负责管理所有动画效果。

```typescript
// lib/animation/AnimationEngine.ts
class AnimationEngine {
  private animationQueue: AnimationTask[] = [];
  private activeAnimations: Map<string, Animation> = new Map();
  
  // 创建动画序列
  createSequence(config: AnimationSequenceConfig): AnimationSequence {
    const { elements, timing, triggers } = config;
    
    return {
      id: generateId(),
      elements: elements.map((el, index) => ({
        ...el,
        delay: timing.stagger * index,
        duration: timing.duration,
        easing: timing.easing
      })),
      triggers,
      status: 'pending'
    };
  }
  
  // 执行动画
  async play(sequenceId: string): Promise<void> {
    const sequence = this.getSequence(sequenceId);
    
    for (const element of sequence.elements) {
      await this.animateElement(element);
    }
    
    this.emit('complete', sequenceId);
  }
  
  // 判断交互模式
  determineInteractionMode(content: ContentConfig, images: ImageConfig[]): InteractionMode {
    const contentComplexity = this.calculateContentComplexity(content);
    const imageCount = images.length;
    
    if (contentComplexity > 3 || content.paragraphs.length > 3) {
      return 'auto-scroll';
    }
    
    if (imageCount > 4) {
      return 'swipe';
    }
    
    return 'hybrid';
  }
  
  // 性能优化：使用 requestAnimationFrame
  private animateElement(element: AnimationElement): Promise<void> {
    return new Promise((resolve) => {
      const start = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / element.duration, 1);
        
        const easedProgress = this.applyEasing(progress, element.easing);
        this.updateElementStyle(element, easedProgress);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      requestAnimationFrame(animate);
    });
  }
}

// 动画预设配置
export const ANIMATION_PRESETS = {
  fadeInUp: {
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0 },
    duration: 800,
    easing: 'easeOut'
  },
  
  staggerImages: {
    from: { opacity: 0, scale: 0.9, rotate: -5 },
    to: { opacity: 1, scale: 1, rotate: 0 },
    duration: 600,
    stagger: 100,
    easing: 'spring'
  },
  
  typewriter: {
    from: { width: 0 },
    to: { width: '100%' },
    duration: 2000,
    easing: 'linear'
  },
  
  parallaxScroll: {
    scrollBased: true,
    from: { y: 0 },
    to: { y: -100 },
    easing: 'linear'
  }
};
```



## Data Models

### 组件增强配置模型

```typescript
// types/enhancement.ts

// 内容配置
export interface ContentConfig {
  coverStory?: string;
  loveStory?: LoveStoryConfig;
  weddingExpectation?: string;
  guestThankYou?: string;
  customSections?: ContentSection[];
  style?: 'romantic' | 'modern' | 'traditional' | 'casual';
}

export interface LoveStoryConfig {
  meeting?: string[];
  dating?: string[];
  proposal?: string[];
  custom?: { title: string; paragraphs: string[] }[];
}

// 图片配置
export interface ImageConfig {
  url: string;
  role: 'primary' | 'secondary' | 'background';
  alt?: string;
  aspectRatio?: string;
  priority?: boolean;
  lazyLoad?: boolean;
}

export interface ImageRequirement {
  min: number;
  max: number;
  roles: ImageRole[];
  aspectRatio?: string;
}

// 动画配置
export interface AnimationConfig {
  mode?: 'auto' | 'manual';
  timing?: AnimationTiming;
  triggers?: AnimationTrigger[];
  disabled?: boolean;
  presets?: string[];
}

export interface AnimationSequence {
  id: string;
  elements: AnimationElement[];
  triggers: AnimationTrigger[];
  status: 'pending' | 'playing' | 'completed';
}

export interface AnimationElement {
  target: string;
  from: CSSProperties;
  to: CSSProperties;
  duration: number;
  delay: number;
  easing: EasingFunction;
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
```



## Error Handling

### 错误处理策略

```typescript
// lib/errors/ErrorHandler.ts
export class EnhancementError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'EnhancementError';
  }
}

export enum ErrorCode {
  CONTENT_MISSING = 'CONTENT_MISSING',
  IMAGE_LOAD_FAILED = 'IMAGE_LOAD_FAILED',
  ANIMATION_ERROR = 'ANIMATION_ERROR',
  INVALID_CONFIG = 'INVALID_CONFIG'
}

// 错误处理器
export class ErrorHandler {
  // 处理内容缺失
  handleContentMissing(componentType: string): ContentConfig {
    console.warn(`Content missing for ${componentType}, using defaults`);
    return ContentManager.getDefaultContent(componentType);
  }
  
  // 处理图片加载失败
  handleImageLoadFailed(image: ImageConfig): ImageConfig {
    console.error(`Failed to load image: ${image.url}`);
    return {
      ...image,
      url: '/placeholder-wedding.jpg',
      alt: 'Image unavailable'
    };
  }
  
  // 处理动画错误
  handleAnimationError(error: Error, animationId: string): void {
    console.error(`Animation error in ${animationId}:`, error);
    // 降级：禁用该动画
    AnimationEngine.disable(animationId);
  }
  
  // 配置验证
  validateConfig(config: EnhancedWeddingProps): ValidationResult {
    const errors: string[] = [];
    
    if (config.content && !this.isValidContent(config.content)) {
      errors.push('Invalid content configuration');
    }
    
    if (config.images && !this.isValidImages(config.images)) {
      errors.push('Invalid image configuration');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}
```

### 降级策略

1. **内容降级**: 缺失内容时使用默认文案
2. **图片降级**: 加载失败时显示占位符
3. **动画降级**: 低性能设备禁用非关键动画
4. **交互降级**: 不支持的交互模式回退到基础模式



## Testing Strategy

### 测试层次

#### 1. 单元测试

```typescript
// __tests__/lib/content/ContentManager.test.ts
describe('ContentManager', () => {
  it('should generate default content for romantic style', () => {
    const content = ContentManager.generateContent('cover', { style: 'romantic' });
    expect(content.coverStory).toContain('相遇');
  });
  
  it('should validate content completeness', () => {
    const result = ContentManager.validateContent({ coverStory: '' });
    expect(result.valid).toBe(false);
  });
});

// __tests__/lib/animation/AnimationEngine.test.ts
describe('AnimationEngine', () => {
  it('should determine auto-scroll mode for complex content', () => {
    const mode = AnimationEngine.determineInteractionMode(
      { paragraphs: ['p1', 'p2', 'p3', 'p4'] },
      []
    );
    expect(mode).toBe('auto-scroll');
  });
  
  it('should create animation sequence with stagger', () => {
    const sequence = AnimationEngine.createSequence({
      elements: [{ id: '1' }, { id: '2' }],
      timing: { stagger: 100, duration: 500 }
    });
    expect(sequence.elements[1].delay).toBe(100);
  });
});
```

#### 2. 集成测试

```typescript
// __tests__/components/WeddingCard.enhanced.test.tsx
describe('Enhanced WeddingCard', () => {
  it('should render with enhanced content', () => {
    const { getByText } = render(
      <WeddingCard
        {...baseProps}
        content={{
          coverStory: 'Custom story',
          loveStory: { meeting: ['First meet'] }
        }}
      />
    );
    expect(getByText('Custom story')).toBeInTheDocument();
  });
  
  it('should preload priority images', async () => {
    const preloadSpy = jest.spyOn(ImageManager, 'preloadImages');
    render(<WeddingCard {...baseProps} images={mockImages} />);
    await waitFor(() => {
      expect(preloadSpy).toHaveBeenCalled();
    });
  });
});
```

#### 3. 性能测试

```typescript
// __tests__/performance/animation.perf.test.ts
describe('Animation Performance', () => {
  it('should complete animation within 2 seconds', async () => {
    const start = performance.now();
    await AnimationEngine.play('test-sequence');
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(2000);
  });
  
  it('should not cause layout thrashing', () => {
    const layoutShiftScore = measureLayoutShift(() => {
      AnimationEngine.play('complex-sequence');
    });
    expect(layoutShiftScore).toBeLessThan(0.1);
  });
});
```

#### 4. 视觉回归测试

使用 Playwright 或 Chromatic 进行视觉回归测试：

```typescript
// __tests__/visual/components.visual.test.ts
test('WeddingCard visual regression', async ({ page }) => {
  await page.goto('/test/wedding-card-enhanced');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('wedding-card-enhanced.png');
});
```

### 测试覆盖率目标

- 单元测试覆盖率: ≥ 80%
- 集成测试覆盖率: ≥ 70%
- 关键路径测试: 100%



## Implementation Details

### 组件增强实施方案

#### Phase 1: 基础设施搭建

1. **创建工具库目录结构**
```
apps/frontend/lib/
├── content/
│   ├── ContentManager.ts
│   ├── defaultContent.ts
│   └── contentValidator.ts
├── image/
│   ├── ImageManager.ts
│   ├── imagePreloader.ts
│   └── layoutCalculator.ts
├── animation/
│   ├── AnimationEngine.ts
│   ├── animationPresets.ts
│   └── easingFunctions.ts
├── hooks/
│   ├── useContentAnimation.ts
│   ├── useImageSequence.ts
│   ├── useInteractionMode.ts
│   └── useAnalytics.ts
└── utils/
    ├── errorHandler.ts
    └── performanceMonitor.ts
```

2. **类型定义**
```
apps/frontend/types/
├── enhancement.ts
├── content.ts
├── animation.ts
└── analytics.ts
```

#### Phase 2: 组件逐个增强

每个组件的增强遵循以下步骤：

1. **分析现有组件**
   - 识别组件类型（封面型、叙事型、相册型）
   - 评估当前内容和图片数量
   - 确定适合的交互模式

2. **设计内容策略**
   - 根据组件风格选择文案风格
   - 确定需要添加的内容段落
   - 设计内容的情感递进

3. **规划图片结构**
   - 确定图片数量和角色
   - 设计图片布局方案
   - 配置响应式规则

4. **设计动画方案**
   - 选择合适的动画预设
   - 设计动画时序
   - 配置触发条件

5. **实施增强**
   - 扩展组件 props
   - 集成 Content Manager
   - 集成 Image Manager
   - 集成 Animation Engine
   - 添加埋点

6. **测试验证**
   - 单元测试
   - 视觉测试
   - 性能测试



### 具体组件增强示例

#### WeddingCard 组件增强方案

**当前状态分析**:
- 类型: 卡片滑动型
- 内容: 基础信息（姓名、日期、地点）
- 图片: 5张（封面、邀请、详情、相册、结束）
- 动画: 滑动切换、基础进入动画

**增强方案**:

1. **内容增强**
```typescript
// 封面页：添加爱情宣言
coverStory: "在时光的长河中，我们相遇、相知、相爱。今天，我们将携手走进婚姻的殿堂。"

// 邀请页：添加情感表达
invitationText: [
  "始于初见，止于终老",
  "在这温暖的日子里",
  "期待与您共度美好时光",
  "您的到来，是我们最大的幸福"
]

// 详情页：添加婚礼期待
weddingExpectation: "这一天，我们将在最爱的人面前，许下一生的誓言。"

// 结束页：添加感谢语
thankYouMessage: "感谢您一路以来的陪伴与支持，期待您的光临。"
```

2. **图片结构增强**
```typescript
images: {
  cover: [
    { url: '/cover-main.jpg', role: 'primary', priority: true },
    { url: '/cover-bg.jpg', role: 'background' }
  ],
  invitation: [
    { url: '/couple-1.jpg', role: 'primary' },
    { url: '/couple-2.jpg', role: 'secondary' }
  ],
  gallery: [
    { url: '/gallery-1.jpg', role: 'primary' },
    { url: '/gallery-2.jpg', role: 'primary' },
    { url: '/gallery-3.jpg', role: 'secondary' },
    { url: '/gallery-4.jpg', role: 'secondary' }
  ]
}
```

3. **动画增强**
```typescript
animation: {
  mode: 'manual', // 保持手动滑动
  timing: {
    stagger: 150,
    duration: 800,
    easing: 'spring'
  },
  sequences: [
    {
      id: 'cover-enter',
      elements: [
        { target: '.cover-story', preset: 'fadeInUp', delay: 300 },
        { target: '.names', preset: 'fadeInUp', delay: 500 },
        { target: '.date', preset: 'fadeInUp', delay: 700 }
      ]
    },
    {
      id: 'invitation-enter',
      elements: [
        { target: '.invitation-image', preset: 'scaleIn', delay: 0 },
        { target: '.invitation-text p', preset: 'fadeInUp', stagger: 200 }
      ]
    }
  ]
}
```

#### WeddingStory 组件增强方案

**当前状态分析**:
- 类型: 滚动叙事型
- 内容: 基础信息
- 图片: 2张（主图、副图）
- 动画: 滚动视差

**增强方案**:

1. **内容增强**（叙事型，需要更多段落）
```typescript
content: {
  loveStory: {
    meeting: [
      "那是一个平凡的午后，阳光透过咖啡馆的玻璃窗洒在你的脸上。",
      "我端着咖啡走过，不小心撞到了你的肩膀。",
      "你抬起头，我们的目光在空中交汇，那一刻，时间仿佛静止了。"
    ],
    dating: [
      "从那以后，我们开始了无数次的约会。",
      "一起看过的电影，走过的街道，吃过的餐厅，都成为了我们共同的回忆。"
    ],
    proposal: [
      "在那个星空璀璨的夜晚，我单膝跪地，向你许下了一生的承诺。",
      "你含着泪水点头的那一刻，是我人生中最幸福的时刻。"
    ]
  },
  weddingExpectation: "现在，我们即将步入婚姻的殿堂。在这个特别的日子里，我们希望与最亲爱的家人和朋友分享这份喜悦。",
  guestThankYou: "感谢您一路以来的陪伴与支持。在我们人生的重要时刻，能有您的见证，是我们莫大的幸福。"
}
```

2. **图片结构增强**（叙事型需要更多图片）
```typescript
images: {
  story: [
    { url: '/story-meeting.jpg', role: 'primary', section: 'meeting' },
    { url: '/story-dating-1.jpg', role: 'secondary', section: 'dating' },
    { url: '/story-dating-2.jpg', role: 'secondary', section: 'dating' },
    { url: '/story-proposal.jpg', role: 'primary', section: 'proposal' }
  ],
  background: { url: '/story-bg.jpg', role: 'background' }
}
```

3. **动画增强**（自动滚动 + 视差）
```typescript
animation: {
  mode: 'auto',
  interactionMode: 'auto-scroll',
  timing: {
    autoScrollSpeed: 50, // px/s
    stagger: 200,
    duration: 1000
  },
  sequences: [
    {
      id: 'story-section',
      trigger: { type: 'onVisible', threshold: 0.3 },
      elements: [
        { target: '.story-image', preset: 'parallaxScroll', speed: 0.5 },
        { target: '.story-text', preset: 'fadeInUp', stagger: 300 }
      ]
    }
  ]
}
```



## Performance Optimization

### 性能优化策略

#### 1. 图片优化

```typescript
// 懒加载策略
const ImageWithLazyLoad: React.FC<ImageProps> = ({ src, priority }) => {
  return (
    <Image
      src={src}
      loading={priority ? 'eager' : 'lazy'}
      placeholder="blur"
      blurDataURL={generateBlurDataURL(src)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
};

// 响应式图片
const getResponsiveImageUrl = (baseUrl: string, width: number) => {
  return `${baseUrl}?w=${width}&q=${width > 1200 ? 85 : 75}`;
};
```

#### 2. 动画性能优化

```typescript
// 使用 CSS transform 和 opacity（GPU 加速）
const optimizedAnimation = {
  // ✅ 好的做法
  transform: 'translateY(0)',
  opacity: 1,
  
  // ❌ 避免的做法
  // top: 0,
  // height: '100%'
};

// 使用 will-change 提示浏览器
const AnimatedElement = styled.div`
  will-change: transform, opacity;
  
  &.animating {
    will-change: auto; // 动画结束后移除
  }
`;

// 降低动画复杂度
const shouldReduceMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
```

#### 3. 内容加载优化

```typescript
// 分段加载内容
const useProgressiveContent = (content: ContentConfig) => {
  const [visibleSections, setVisibleSections] = useState<string[]>(['cover']);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => [...prev, entry.target.id]);
        }
      });
    }, { threshold: 0.1 });
    
    // 观察各个 section
    document.querySelectorAll('[data-section]').forEach(el => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);
  
  return visibleSections;
};
```

#### 4. 性能监控

```typescript
// 性能指标收集
class PerformanceMonitor {
  // 监控 LCP (Largest Contentful Paint)
  measureLCP(): void {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }
  
  // 监控 CLS (Cumulative Layout Shift)
  measureCLS(): void {
    let clsScore = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsScore += (entry as any).value;
        }
      }
      console.log('CLS:', clsScore);
    }).observe({ entryTypes: ['layout-shift'] });
  }
  
  // 监控动画帧率
  measureFPS(): void {
    let lastTime = performance.now();
    let frames = 0;
    
    const measureFrame = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        console.log('FPS:', fps);
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFrame);
    };
    
    requestAnimationFrame(measureFrame);
  }
}
```

### 性能目标

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **动画帧率**: ≥ 60 FPS
- **首屏加载时间**: < 3s



## Accessibility Considerations

### 无障碍设计

#### 1. 语义化 HTML

```typescript
// 使用正确的语义标签
<article role="article" aria-label="Wedding Invitation">
  <header>
    <h1>{groomName} & {brideName}</h1>
  </header>
  
  <section aria-labelledby="story-heading">
    <h2 id="story-heading">Our Love Story</h2>
    <p>{storyContent}</p>
  </section>
  
  <section aria-labelledby="details-heading">
    <h2 id="details-heading">Wedding Details</h2>
    <dl>
      <dt>Date</dt>
      <dd>{weddingDate}</dd>
      <dt>Location</dt>
      <dd>{hotelName}</dd>
    </dl>
  </section>
</article>
```

#### 2. 键盘导航支持

```typescript
const useKeyboardNavigation = (totalSlides: number) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          setCurrentSlide(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          setCurrentSlide(prev => Math.min(totalSlides - 1, prev + 1));
          break;
        case 'Home':
          setCurrentSlide(0);
          break;
        case 'End':
          setCurrentSlide(totalSlides - 1);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides]);
  
  return currentSlide;
};
```

#### 3. 屏幕阅读器支持

```typescript
// ARIA 实时区域
<div role="status" aria-live="polite" aria-atomic="true">
  {currentSlide + 1} of {totalSlides}
</div>

// 图片 alt 文本
<Image
  src={photo}
  alt={`Wedding photo of ${groomName} and ${brideName} - ${photoDescription}`}
/>

// 动画控制
<button
  aria-label="Pause animations"
  onClick={toggleAnimations}
>
  {animationsEnabled ? 'Pause' : 'Play'}
</button>
```

#### 4. 颜色对比度

```typescript
// 确保文字与背景的对比度符合 WCAG AA 标准（4.5:1）
const ensureContrast = (textColor: string, bgColor: string) => {
  const contrast = calculateContrast(textColor, bgColor);
  
  if (contrast < 4.5) {
    console.warn(`Low contrast: ${contrast.toFixed(2)}:1`);
    return adjustColor(textColor, bgColor);
  }
  
  return textColor;
};
```

#### 5. 减少动画选项

```typescript
// 尊重用户的动画偏好
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersReducedMotion;
};

// 在组件中使用
const AnimatedComponent = () => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { y: [0, -20, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      Content
    </motion.div>
  );
};
```



## Migration Strategy

### 向后兼容性

所有增强功能都是可选的，现有组件无需修改即可继续工作：

```typescript
// 旧的使用方式（仍然有效）
<WeddingCard
  groomName="张三"
  brideName="李四"
  weddingDate="2026-06-20"
  photos={photos}
  musicUrl={musicUrl}
/>

// 新的增强方式（可选）
<WeddingCard
  groomName="张三"
  brideName="李四"
  weddingDate="2026-06-20"
  photos={photos}
  musicUrl={musicUrl}
  content={{
    coverStory: "自定义封面故事",
    loveStory: { meeting: ["相遇的故事"] }
  }}
  images={{
    cover: [{ url: '/cover.jpg', role: 'primary' }]
  }}
  animation={{
    mode: 'auto',
    timing: { stagger: 200 }
  }}
/>
```

### 渐进式迁移

1. **Phase 1**: 部署基础设施（工具库、类型定义）
2. **Phase 2**: 选择 2-3 个代表性组件进行试点增强
3. **Phase 3**: 收集反馈，优化方案
4. **Phase 4**: 逐步增强剩余组件
5. **Phase 5**: 全面测试和性能优化

### 文档和示例

创建详细的文档和示例代码：

```markdown
# 组件增强指南

## 快速开始

### 1. 添加内容增强

\`\`\`typescript
import { DEFAULT_CONTENT } from '@/lib/content/defaultContent';

<WeddingCard
  {...baseProps}
  content={{
    coverStory: DEFAULT_CONTENT.coverStory.romantic,
    loveStory: DEFAULT_CONTENT.loveStory
  }}
/>
\`\`\`

### 2. 配置图片结构

\`\`\`typescript
<WeddingCard
  {...baseProps}
  images={{
    cover: [
      { url: '/cover-main.jpg', role: 'primary', priority: true },
      { url: '/cover-bg.jpg', role: 'background' }
    ]
  }}
/>
\`\`\`

### 3. 启用动画增强

\`\`\`typescript
<WeddingCard
  {...baseProps}
  animation={{
    mode: 'auto',
    timing: { stagger: 150, duration: 800 }
  }}
/>
\`\`\`
```

## Design Decisions and Rationales

### 为什么选择"增强而非重写"？

1. **降低风险**: 保持现有功能稳定，新功能可选
2. **渐进式改进**: 可以逐步迁移，不需要一次性完成
3. **向后兼容**: 现有用户不受影响
4. **灵活性**: 用户可以选择使用哪些增强功能

### 为什么使用独立的管理器类？

1. **关注点分离**: 内容、图片、动画各自独立管理
2. **可测试性**: 每个模块可以独立测试
3. **可复用性**: 管理器可以在多个组件间共享
4. **可维护性**: 修改一个模块不影响其他模块

### 为什么支持多种交互模式？

1. **适应不同内容**: 叙事型内容适合自动滚动，相册型适合滑动
2. **用户偏好**: 不同用户有不同的交互习惯
3. **设备适配**: 移动端和 PC 端的最佳交互方式不同

### 为什么强调性能优化？

1. **用户体验**: 流畅的动画和快速的加载是商业产品的基本要求
2. **移动端优先**: 婚礼请帖主要在移动端查看，性能更关键
3. **SEO**: 性能指标影响搜索引擎排名

