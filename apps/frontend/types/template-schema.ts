/**
 * Template Schema - 婚礼请帖模板结构定义
 * 使用 JSON Schema 方式描述模板结构
 */

import { TemplateId } from './wedding-data';

// ==================== 基础类型定义 ====================

export type SectionType = 
  | 'header'
  | 'cover'
  | 'couple'
  | 'event'
  | 'gallery'
  | 'blessing'
  | 'guestbook'
  | 'rsvp'
  | 'divider'
  | 'spacer'
  | 'custom';

export type LayoutType = 
  | 'single-column'
  | 'double-column'
  | 'magazine'
  | 'full-width'
  | 'card';

export type TextAlign = 'left' | 'center' | 'right';

export type Position = 'before' | 'after' | 'prepend' | 'append';

// ==================== 主题配置 ====================

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textMuted: string;
  };
  fonts: {
    primary: string;
    heading: string;
    body: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    full: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// ==================== 样式系统 ====================

export interface SectionStyle {
  padding?: string;
  margin?: string;
  background?: string;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'fill' | 'auto';
  backgroundPosition?: string;
  borderRadius?: string;
  boxShadow?: string;
  textAlign?: TextAlign;
  minHeight?: string;
  maxWidth?: string;
  display?: string;
  flexDirection?: 'row' | 'column';
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  opacity?: number;
  transform?: string;
  transition?: string;
}

export interface TextStyle {
  fontSize?: string;
  fontWeight?: string | number;
  color?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textDecoration?: string;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize';
}

export interface ImageStyle {
  width?: string;
  height?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  borderRadius?: string;
  aspectRatio?: string;
}

// ==================== Props 表达式 ====================

export type PropValue = 
  | string
  | number
  | boolean
  | null
  | undefined
  | PropObject
  | PropArray
  | PlaceholderExpression;

export interface PropObject {
  [key: string]: PropValue;
}

export interface PropArray extends Array<PropValue> {}

/**
 * 占位符表达式
 * 格式: {{data.path.to.value}} 或 {{data.name||默认值}}
 */
export interface PlaceholderExpression {
  type: 'placeholder';
  path: string;
  defaultValue?: string;
  transform?: string;
}

// ==================== Section 定义 ====================

export interface Section {
  id: string;
  type: SectionType;
  name?: string;
  style?: SectionStyle;
  props?: PropObject;
  children?: Section[];
  condition?: {
    type: 'show' | 'hide';
    path: string;
    value: any;
  };
  animation?: {
    type: 'fade' | 'slide' | 'bounce' | 'zoom';
    duration: string;
    delay: string;
    direction?: 'up' | 'down' | 'left' | 'right';
  };
}

// ==================== 页面配置 ====================

export interface PageConfig {
  layout: LayoutType;
  maxWidth: string;
  mobileBreakpoint: string;
  enableResponsive: boolean;
}

// ==================== 模板元信息 ====================

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  author: string;
  version: string;
  thumbnail: string;
  tags: string[];
  category: 'romantic' | 'elegant' | 'modern' | 'nature' | 'theme';
  style: 'traditional' | 'modern' | 'artistic';
  supportedOrientations: ('portrait' | 'landscape')[];
  estimatedTime: string;
}

// ==================== 完整模板定义 ====================

export interface WeddingTemplate {
  meta: TemplateMeta;
  theme: ThemeConfig;
  page: PageConfig;
  sections: Section[];
}

/**
 * 创建默认主题配置
 */
export function createDefaultTheme(): ThemeConfig {
  return {
    colors: {
      primary: '#FF8C42',
      secondary: '#FFB77A',
      accent: '#E67328',
      background: '#fffaf7',
      text: '#333333',
      textMuted: '#888888',
    },
    fonts: {
      primary: 'system-ui, -apple-system, sans-serif',
      heading: 'Georgia, serif',
      body: 'system-ui, -apple-system, sans-serif',
    },
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '16px',
      full: '9999px',
    },
    shadows: {
      small: '0 1px 2px rgba(0,0,0,0.05)',
      medium: '0 4px 6px rgba(0,0,0,0.1)',
      large: '0 10px 15px rgba(0,0,0,0.1)',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
  };
}

/**
 * 占位符工厂函数
 */
export function placeholder(path: string, defaultValue?: string): PlaceholderExpression {
  return {
    type: 'placeholder',
    path,
    defaultValue,
  };
}

/**
 * 创建占位符表达式（便捷方法）
 */
export function ph(path: string, defaultValue?: string): PlaceholderExpression {
  return placeholder(path, defaultValue);
}
