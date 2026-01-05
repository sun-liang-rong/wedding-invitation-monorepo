// Content Manager - 内容管理器
// 负责生成、验证和格式化婚礼请帖内容

import { ContentConfig, ContentStyle, ComponentType, ValidationResult } from '../types';
import { DEFAULT_CONTENT, generateContentByStyle } from './defaultContent';

export class ContentManager {
  /**
   * 生成内容配置
   * @param componentType 组件类型
   * @param userContent 用户自定义内容
   * @param style 内容风格
   */
  static generateContent(
    componentType: ComponentType,
    userContent?: Partial<ContentConfig>,
    style: ContentStyle = 'romantic'
  ): ContentConfig {
    const defaultContent = this.getDefaultContent(componentType, style);
    return this.mergeContent(defaultContent, userContent);
  }

  /**
   * 获取默认内容
   */
  static getDefaultContent(componentType: ComponentType, style: ContentStyle): ContentConfig {
    const baseContent = DEFAULT_CONTENT[style];

    // 根据组件类型调整内容
    switch (componentType) {
      case 'cover':
        return {
          coverStory: baseContent.coverStory,
          style,
        };
      
      case 'narrative':
      case 'story':
        return baseContent; // 叙事型需要完整内容
      
      case 'gallery':
        return {
          coverStory: baseContent.coverStory,
          weddingExpectation: baseContent.weddingExpectation,
          guestThankYou: baseContent.guestThankYou,
          style,
        };
      
      case 'card':
        return {
          coverStory: baseContent.coverStory,
          weddingExpectation: baseContent.weddingExpectation,
          guestThankYou: baseContent.guestThankYou,
          style,
        };
      
      default:
        return baseContent;
    }
  }

  /**
   * 合并用户内容和默认内容
   */
  static mergeContent(
    defaultContent: ContentConfig,
    userContent?: Partial<ContentConfig>
  ): ContentConfig {
    if (!userContent) return defaultContent;

    return {
      ...defaultContent,
      ...userContent,
      loveStory: userContent.loveStory
        ? { ...defaultContent.loveStory, ...userContent.loveStory }
        : defaultContent.loveStory,
    };
  }

  /**
   * 验证内容完整性
   */
  static validateContent(content: ContentConfig): ValidationResult {
    const errors: string[] = [];

    // 检查必需字段
    if (!content.coverStory || content.coverStory.trim().length === 0) {
      errors.push('封面故事不能为空');
    }

    // 检查文案长度
    if (content.coverStory && content.coverStory.length > 200) {
      errors.push('封面故事过长，建议不超过200字');
    }

    // 检查爱情故事段落
    if (content.loveStory) {
      const { meeting, dating, proposal } = content.loveStory;
      
      if (meeting && meeting.length === 0) {
        errors.push('相遇故事不能为空数组');
      }
      
      if (dating && dating.length === 0) {
        errors.push('约会故事不能为空数组');
      }
      
      if (proposal && proposal.length === 0) {
        errors.push('求婚故事不能为空数组');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 格式化文案（添加标点、优化排版）
   */
  static formatContent(content: string): string {
    let formatted = content.trim();

    // 移除多余空格
    formatted = formatted.replace(/\s+/g, ' ');

    // 确保句末有标点
    if (!/[。！？.!?]$/.test(formatted)) {
      formatted += '。';
    }

    return formatted;
  }

  /**
   * 计算内容复杂度（用于决定交互模式）
   */
  static calculateContentComplexity(content: ContentConfig): number {
    let complexity = 0;

    // 封面故事
    if (content.coverStory) {
      complexity += 1;
    }

    // 爱情故事
    if (content.loveStory) {
      const { meeting, dating, proposal, custom } = content.loveStory;
      if (meeting && meeting.length > 0) complexity += meeting.length;
      if (dating && dating.length > 0) complexity += dating.length;
      if (proposal && proposal.length > 0) complexity += proposal.length;
      if (custom && custom.length > 0) {
        complexity += custom.reduce((sum, section) => sum + section.paragraphs.length, 0);
      }
    }

    // 婚礼期待
    if (content.weddingExpectation) {
      complexity += 1;
    }

    // 感谢语
    if (content.guestThankYou) {
      complexity += 1;
    }

    // 自定义段落
    if (content.customSections) {
      complexity += content.customSections.reduce(
        (sum, section) => sum + section.paragraphs.length,
        0
      );
    }

    return complexity;
  }

  /**
   * 生成段落数组（用于动画）
   */
  static generateParagraphs(content: ContentConfig): string[] {
    const paragraphs: string[] = [];

    if (content.coverStory) {
      paragraphs.push(content.coverStory);
    }

    if (content.loveStory) {
      const { meeting, dating, proposal } = content.loveStory;
      if (meeting) paragraphs.push(...meeting);
      if (dating) paragraphs.push(...dating);
      if (proposal) paragraphs.push(...proposal);
    }

    if (content.weddingExpectation) {
      paragraphs.push(content.weddingExpectation);
    }

    if (content.guestThankYou) {
      paragraphs.push(content.guestThankYou);
    }

    return paragraphs;
  }
}
