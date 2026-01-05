export type TemplateId = 'classic' | 'romantic' | 'elegant' | 'modern' | 'garden' | 'fairy-tale' | 'ocean' | 'autumn' | 'spring';

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
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
    id: 'classic',
    name: '经典雅致',
    description: '传统红色系设计，经典大气，适合追求传统仪式感的新人',
    previewImage: '/templates/classic-preview.jpg',
    pcPreviewImage: '/templates/classic-pc.jpg',
    primaryColor: '#f43f5e',
    secondaryColor: '#fb7185',
    features: ['传统红色主题', '经典排版', '适合传统婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
  {
    id: 'romantic',
    name: '浪漫粉彩',
    description: '柔和粉色系设计，温馨浪漫，营造甜蜜氛围',
    previewImage: '/templates/romantic-preview.jpg',
    pcPreviewImage: '/templates/romantic-pc.jpg',
    primaryColor: '#ec4899',
    secondaryColor: '#f472b6',
    features: ['粉色浪漫主题', '柔和配色', '适合户外婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
  {
    id: 'elegant',
    name: '简约高雅',
    description: '黑金配色设计，简约而不简单，彰显品味与格调',
    previewImage: '/templates/elegant-preview.jpg',
    pcPreviewImage: '/templates/elegant-pc.jpg',
    primaryColor: '#1f2937',
    secondaryColor: '#f59e0b',
    features: ['黑金配色', '简约设计', '适合高端酒店婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
  {
    id: 'modern',
    name: '现代简约',
    description: '纯白极简设计，干净利落，突显新人本身',
    previewImage: '/templates/modern-preview.jpg',
    pcPreviewImage: '/templates/modern-pc.jpg',
    primaryColor: '#6366f1',
    secondaryColor: '#a5b4fc',
    features: ['极简设计', '白色主题', '适合西式婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
  {
    id: 'garden',
    name: '花园森系',
    description: '绿色自然系设计，清新自然，如沐春风',
    previewImage: '/templates/garden-preview.jpg',
    pcPreviewImage: '/templates/garden-pc.jpg',
    primaryColor: '#10b981',
    secondaryColor: '#34d399',
    features: ['绿色自然主题', '清新风格', '适合草坪婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
  {
    id: 'fairy-tale',
    name: '童话梦幻',
    description: '紫色梦幻设计，童话般的浪漫爱情故事',
    previewImage: '/templates/fairy-tale-preview.jpg',
    pcPreviewImage: '/templates/fairy-tale-pc.jpg',
    primaryColor: '#8b5cf6',
    secondaryColor: '#a78bfa',
    features: ['紫色梦幻主题', '童话风格', '适合主题婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
  {
    id: 'ocean',
    name: '浪漫与你',
    description: '蓝色海洋系设计，清新浪漫，奔赴一场浪漫',
    previewImage: '/templates/ocean-preview.jpg',
    pcPreviewImage: '/templates/ocean-pc.jpg',
    primaryColor: '#0ea5e9',
    secondaryColor: '#38bdf8',
    features: ['蓝色海洋主题', '清新浪漫', '适合海边婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
  {
    id: 'autumn',
    name: '秋日拿铁',
    description: '暖色调拿铁设计，温暖温柔，秋冬婚礼首选',
    previewImage: '/templates/autumn-preview.jpg',
    pcPreviewImage: '/templates/autumn-pc.jpg',
    primaryColor: '#d97706',
    secondaryColor: '#fbbf24',
    features: ['暖色调', '拿铁风格', '适合秋冬婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
  {
    id: 'spring',
    name: '沐浴阳光',
    description: '阳光活力系设计，明媚温暖，充满希望',
    previewImage: '/templates/spring-preview.jpg',
    pcPreviewImage: '/templates/spring-pc.jpg',
    primaryColor: '#fbbf24',
    secondaryColor: '#fcd34d',
    features: ['阳光活力', '温暖明媚', '适合春季婚礼'],
    layout: 'single-column',
    photoRequirements: {
      cover: true,
      gallery: 6,
    },
  },
];

export function getTemplateById(id: TemplateId): TemplateConfig | undefined {
  return TEMPLATES.find((template) => template.id === id);
}

export function getTemplateByName(name: string): TemplateConfig | undefined {
  return TEMPLATES.find((template) => template.name === name);
}
