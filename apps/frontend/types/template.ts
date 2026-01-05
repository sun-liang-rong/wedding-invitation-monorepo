export type TemplateId = 
  | 'wedding-card'
  | 'wedding-story'
  | 'classic-parallax'
  | 'wedding-h5'
  | 'wedding-invitation'
  | 'chinese-traditional'
  | 'luxury-gold'
  | 'envelope-open'
  | 'cinematic-fade'
  | 'floating-cards'
  | 'fullscreen-swiper'
  | 'interactive-map-path'
  | 'polaroid-stack';

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  component: string;
  previewImage: string;
  pcPreviewImage: string;
  primaryColor: string;
  secondaryColor: string;
  features: string[];
  layout: 'single-column' | 'double-column' | 'magazine';
  photoRequirements: {
    cover: boolean;
    gallery: number;
  };
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'wedding-card',
    name: '经典卡片',
    description: '经典卡片式设计，简洁大方，适合各类婚礼场景',
    component: 'WeddingCard',
    previewImage: '/templates/wedding-card-preview.jpg',
    pcPreviewImage: '/templates/wedding-card-pc.jpg',
    primaryColor: '#f43f5e',
    secondaryColor: '#fb7185',
    features: ['卡片式布局', '简洁设计', '适合传统婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
  {
    id: 'wedding-story',
    name: '爱情故事',
    description: '讲述你们的爱情故事，记录每一个重要时刻',
    component: 'WeddingStory',
    previewImage: '/templates/wedding-story-preview.jpg',
    pcPreviewImage: '/templates/wedding-story-pc.jpg',
    primaryColor: '#ec4899',
    secondaryColor: '#f472b6',
    features: ['故事叙述', '时间轴设计', '适合浪漫婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 8,
    },
  },
  {
    id: 'classic-parallax',
    name: '视差滚动',
    description: '现代视差滚动效果，动感十足，视觉冲击力强',
    component: 'ClassicParallax',
    previewImage: '/templates/classic-parallax-preview.jpg',
    pcPreviewImage: '/templates/classic-parallax-pc.jpg',
    primaryColor: '#6366f1',
    secondaryColor: '#a5b4fc',
    features: ['视差效果', '动态滚动', '适合现代婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
  {
    id: 'wedding-h5',
    name: 'H5动画',
    description: '精美H5动画效果，互动性强，适合移动端分享',
    component: 'WeddingH5',
    previewImage: '/templates/wedding-h5-preview.jpg',
    pcPreviewImage: '/templates/wedding-h5-pc.jpg',
    primaryColor: '#8b5cf6',
    secondaryColor: '#a78bfa',
    features: ['H5动画', '移动优先', '适合社交分享'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
  {
    id: 'wedding-invitation',
    name: '正式邀请函',
    description: '正式邀请函样式，庄重典雅，适合正式场合',
    component: 'WeddingInvitation',
    previewImage: '/templates/wedding-invitation-preview.jpg',
    pcPreviewImage: '/templates/wedding-invitation-pc.jpg',
    primaryColor: '#1f2937',
    secondaryColor: '#4b5563',
    features: ['正式风格', '典雅设计', '适合酒店婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
  {
    id: 'chinese-traditional',
    name: '中式传统',
    description: '中国传统风格，红色喜庆，传承经典文化',
    component: 'ChineseTraditional',
    previewImage: '/templates/chinese-traditional-preview.jpg',
    pcPreviewImage: '/templates/chinese-traditional-pc.jpg',
    primaryColor: '#dc2626',
    secondaryColor: '#f87171',
    features: ['中式风格', '传统红色', '适合中式婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
  {
    id: 'luxury-gold',
    name: '奢华金色',
    description: '金色奢华设计，高端大气，彰显尊贵品味',
    component: 'LuxuryGold',
    previewImage: '/templates/luxury-gold-preview.jpg',
    pcPreviewImage: '/templates/luxury-gold-pc.jpg',
    primaryColor: '#f59e0b',
    secondaryColor: '#fbbf24',
    features: ['金色主题', '奢华设计', '适合高端婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
  {
    id: 'envelope-open',
    name: '信封开启',
    description: '信封开启动画，创意十足，给宾客惊喜体验',
    component: 'EnvelopeOpen',
    previewImage: '/templates/envelope-open-preview.jpg',
    pcPreviewImage: '/templates/envelope-open-pc.jpg',
    primaryColor: '#ef4444',
    secondaryColor: '#f87171',
    features: ['开启动画', '创意设计', '适合创意婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
  {
    id: 'cinematic-fade',
    name: '电影渐变',
    description: '电影级渐变效果，艺术感强，如同电影大片',
    component: 'CinematicFade',
    previewImage: '/templates/cinematic-fade-preview.jpg',
    pcPreviewImage: '/templates/cinematic-fade-pc.jpg',
    primaryColor: '#0ea5e9',
    secondaryColor: '#38bdf8',
    features: ['电影效果', '渐变动画', '适合艺术婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
  {
    id: 'floating-cards',
    name: '浮动卡片',
    description: '卡片浮动效果，轻盈灵动，现代感十足',
    component: 'FloatingCards',
    previewImage: '/templates/floating-cards-preview.jpg',
    pcPreviewImage: '/templates/floating-cards-pc.jpg',
    primaryColor: '#a855f7',
    secondaryColor: '#c084fc',
    features: ['浮动效果', '卡片设计', '适合现代婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
  {
    id: 'fullscreen-swiper',
    name: '全屏滑动',
    description: '全屏滑动切换，沉浸式体验，视觉震撼',
    component: 'FullScreenSwiper',
    previewImage: '/templates/fullscreen-swiper-preview.jpg',
    pcPreviewImage: '/templates/fullscreen-swiper-pc.jpg',
    primaryColor: '#10b981',
    secondaryColor: '#34d399',
    features: ['全屏滑动', '沉浸体验', '适合户外婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 8,
    },
  },
  {
    id: 'interactive-map-path',
    name: '互动地图',
    description: '互动地图路径，展示婚礼地点，方便宾客导航',
    component: 'InteractiveMapPath',
    previewImage: '/templates/interactive-map-path-preview.jpg',
    pcPreviewImage: '/templates/interactive-map-path-pc.jpg',
    primaryColor: '#f43f5e',
    secondaryColor: '#fb7185',
    features: ['地图导航', '互动设计', '适合各类婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
  {
    id: 'polaroid-stack',
    name: '拍立得堆叠',
    description: '拍立得照片堆叠效果，复古文艺，充满回忆感',
    component: 'PolaroidStack',
    previewImage: '/templates/polaroid-stack-preview.jpg',
    pcPreviewImage: '/templates/polaroid-stack-pc.jpg',
    primaryColor: '#78716c',
    secondaryColor: '#a8a29e',
    features: ['拍立得风格', '复古设计', '适合文艺婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 8,
    },
  },
];

export function getTemplateById(id: TemplateId): TemplateConfig | undefined {
  return TEMPLATES.find((template) => template.id === id);
}

export function getTemplateByName(name: string): TemplateConfig | undefined {
  return TEMPLATES.find((template) => template.name === name);
}
