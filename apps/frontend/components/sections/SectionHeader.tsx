/**
 * SectionHeader - 标题区组件
 * 用于显示页面标题、副标题等
 */

import React from 'react';
import { PropObject } from '@/types/template-schema';

interface SectionHeaderProps {
  props?: PropObject;
  style?: React.CSSProperties;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  props = {}, 
  style = {} 
}) => {
  const {
    title = '婚礼请帖',
    subtitle,
    emoji,
    showDivider = true,
    dividerColor,
  } = props;

  return (
    <section 
      style={{
        padding: '24px 16px',
        textAlign: 'center',
        ...style,
      }}
    >
      {emoji && (
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>
          {emoji}
        </div>
      )}
      
      {subtitle && (
        <p style={{
          fontSize: '12px',
          color: '#888',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}>
          {subtitle}
        </p>
      )}
      
      <h2 style={{
        fontSize: '24px',
        fontWeight: '600',
        color: '#333',
        margin: 0,
        fontFamily: 'Georgia, serif',
      }}>
        {title}
      </h2>
      
      {showDivider && (
        <div 
          style={{
            width: '40px',
            height: '2px',
            background: dividerColor || '#FF8C42',
            margin: '16px auto 0',
            borderRadius: '2px',
          }}
        />
      )}
    </section>
  );
};

export default SectionHeader;
