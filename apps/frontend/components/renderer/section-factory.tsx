/**
 * SectionFactory - Section 工厂组件
 * 根据 section.type 映射到对应的 React 组件
 */

import React from 'react';
import { Section, SectionType } from '@/types/template-schema';
import { PropObject } from '@/types/template-schema';

// 导入所有 Section 组件
import { SectionHeader } from '../sections/SectionHeader';
import { SectionCover } from '../sections/SectionCover';
import { SectionCouple } from '../sections/SectionCouple';
import { SectionEvent } from '../sections/SectionEvent';
import { SectionGallery } from '../sections/SectionGallery';
import { SectionBlessing } from '../sections/SectionBlessing';
import { SectionGuestbook } from '../sections/SectionGuestbook';

interface SectionFactoryProps {
  section: Section;
  data: any;
  theme: any;
  parser: any;
}

/**
 * Section 组件映射表
 */
const SECTION_COMPONENTS: Record<SectionType, React.FC<{ props?: PropObject; style?: React.CSSProperties }>> = {
  header: SectionHeader,
  cover: SectionCover,
  couple: SectionCouple,
  event: SectionEvent,
  gallery: SectionGallery,
  blessing: SectionBlessing,
  guestbook: SectionGuestbook,
  rsvp: ({ props, style }) => (
    <section style={{ padding: '40px 20px', textAlign: 'center', ...style }}>
      <h3 style={{ margin: '0 0 16px', color: '#333' }}>RSVP</h3>
      <p style={{ color: '#666' }}>请回复是否出席</p>
    </section>
  ),
  divider: ({ props, style }) => {
    const { color = '#FF8C42', height = '1px', width = '60px', margin = '20px auto' } = props || {};
    return (
      <div style={{ 
        height, 
        width, 
        background: color, 
        margin,
        borderRadius: height,
        ...style,
      }} />
    );
  },
  spacer: ({ props, style }) => {
    const { height = '24px' } = props || {};
    return <div style={{ height, ...style }} />;
  },
  custom: ({ props, style }) => {
    const { content = '' } = props || {};
    return (
      <div 
        style={{ 
          padding: '20px', 
          ...style,
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  },
};

/**
 * 递归渲染子 sections
 */
function renderChildren(
  children: Section[] | undefined,
  data: any,
  theme: any,
  parser: any
): React.ReactNode | null {
  if (!children || children.length === 0) return null;
  
  return (
    <div className="section-children">
      {children.map((child) => (
        <SectionFactory
          key={child.id}
          section={child}
          data={data}
          theme={theme}
          parser={parser}
        />
      ))}
    </div>
  );
}

/**
 * Section 工厂组件
 * 根据 section.type 选择对应的组件进行渲染
 */
export const SectionFactory: React.FC<SectionFactoryProps> = ({
  section,
  data,
  theme,
  parser,
}) => {
  const { type, name, style, props, children, condition, animation } = section;
  
  // 检查条件渲染
  if (condition) {
    const actualValue = parser.getNestedValue(data, condition.path);
    const shouldShow = condition.type === 'show' 
      ? actualValue === condition.value
      : actualValue !== condition.value;
    
    if (!shouldShow) return null;
  }
  
  // 获取对应的组件
  const Component = SECTION_COMPONENTS[type];
  
  if (!Component) {
    console.warn(`Unknown section type: ${type}`);
    return null;
  }
  
  // 解析 props 中的占位符
  const resolvedProps = parser.parse(props || {}, data);
  
  // 合并样式
  const mergedStyle: React.CSSProperties = {
    ...(style || {}),
  };
  
  // 添加动画
  if (animation) {
    mergedStyle.animation = `${animation.type} ${animation.duration} ease-out`;
    mergedStyle.animationDelay = animation.delay;
  }
  
  return (
    <div 
      className={`section section-${type}`}
      data-section-id={section.id}
      data-section-type={type}
    >
      {/* 渲染主组件 */}
      <Component 
        props={resolvedProps as PropObject}
        style={mergedStyle}
      />
      
      {/* 递归渲染子 sections */}
      {renderChildren(children, data, theme, parser)}
    </div>
  );
};

/**
 * 创建 Section 工厂的便捷函数
 */
export function createSectionFactory(
  data: any,
  theme: any,
  parser: any
) {
  return function renderSection(section: Section) {
    return (
      <SectionFactory
        key={section.id}
        section={section}
        data={data}
        theme={theme}
        parser={parser}
      />
    );
  };
}

export default SectionFactory;
