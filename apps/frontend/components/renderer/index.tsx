/**
 * WeddingRenderer - 婚礼请帖渲染引擎
 * 
 * 这是整个模板系统的核心组件，负责：
 * 1. 接收模板和数据进行渲染
 * 2. 解析占位符
 * 3. 递归渲染所有 sections
 * 4. 处理响应式样式
 * 
 * @example
 * const template = { ... }; // 模板 JSON
 * const data = { ... };     // 用户数据
 * 
 * <WeddingRenderer template={template} data={data} />
 */

import React, { useMemo } from 'react';
import { WeddingTemplate } from '@/types/template-schema';
import { WeddingData } from '@/types/wedding-data';
import { createTemplateParser, TemplateParser } from './placeholder';
import { SectionFactory, createSectionFactory } from './section-factory';

interface WeddingRendererProps {
  template: WeddingTemplate;
  data: WeddingData;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * WeddingRenderer - 主渲染组件
 */
export const WeddingRenderer: React.FC<WeddingRendererProps> = ({
  template,
  data,
  className = '',
  style = {},
}) => {
  // 创建模板解析器实例
  const parser = useMemo(() => createTemplateParser(), []);
  
  // 准备渲染上下文
  const renderContext = useMemo(() => ({
    template,
    data,
    theme: template.theme,
    page: template.page,
  }), [template, data]);
  
  // 注入全局样式
  const globalStyles = useMemo(() => getGlobalStyles(template.theme), [template.theme]);
  
  // 过滤需要渲染的 sections
  const visibleSections = useMemo(() => {
    return template.sections.filter((section) => {
      if (!section.condition) return true;
      
      const { path, value, type } = section.condition;
      const actualValue = parser.getNestedValue(data, path);
      
      return type === 'show' ? actualValue === value : actualValue !== value;
    });
  }, [template.sections, data, parser]);
  
  return (
    <div 
      className={`wedding-renderer ${className}`}
      style={style}
    >
      {/* 全局样式注入 */}
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      
      {/* 页面容器 */}
      <div 
        className="wedding-page"
        style={{
          maxWidth: template.page.maxWidth,
          margin: '0 auto',
          background: template.theme.colors.background,
          minHeight: '100vh',
        }}
      >
        {/* 遍历渲染所有 sections */}
        {visibleSections.map((section) => (
          <SectionFactory
            key={section.id}
            section={section}
            data={data}
            theme={template.theme}
            parser={parser}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * 生成全局样式
 */
function getGlobalStyles(theme: WeddingTemplate['theme']): string {
  return `
    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }
    
    html, body {
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: ${theme.fonts.body};
      background: ${theme.colors.background};
      color: ${theme.colors.text};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    img {
      max-width: 100%;
      height: auto;
    }
    
    a {
      color: inherit;
      text-decoration: none;
    }
    
    button {
      font-family: inherit;
    }
    
    input, textarea {
      font-family: inherit;
    }
    
    /* 动画关键帧 */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(30px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideDown {
      from { 
        opacity: 0;
        transform: translateY(-30px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes zoomIn {
      from { 
        opacity: 0;
        transform: scale(0.9);
      }
      to { 
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    /* 移动端响应式 */
    @media (max-width: 768px) {
      .wedding-page {
        max-width: 100% !important;
      }
      
      section {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
    }
    
    /* 触摸优化 */
    @media (hover: none) {
      button:hover {
        transform: none !important;
      }
    }
  `;
}

/**
 * 创建 Renderer 的便捷 hook
 */
export function useWeddingRenderer(template: WeddingTemplate, data: WeddingData) {
  const parser = useMemo(() => createTemplateParser(), []);
  
  const renderSection = useMemo(() => {
    return createSectionFactory(data, template.theme, parser);
  }, [data, template.theme, parser]);
  
  return {
    parser,
    renderSection,
    sections: template.sections,
    theme: template.theme,
  };
}

/**
 * 异步渲染组件 - 用于 SSR
 */
export const AsyncWeddingRenderer: React.FC<{
  template: Promise<WeddingTemplate> | WeddingTemplate;
  data: WeddingData;
}> = ({ template, data }) => {
  const [resolvedTemplate, setResolvedTemplate] = React.useState<WeddingTemplate | null>(null);
  
  React.useEffect(() => {
    if (template instanceof Promise) {
      template.then(setResolvedTemplate);
    } else {
      setResolvedTemplate(template);
    }
  }, [template]);
  
  if (!resolvedTemplate) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        加载中...
      </div>
    );
  }
  
  return <WeddingRenderer template={resolvedTemplate} data={data} />;
};

export default WeddingRenderer;
