/**
 * SectionBlessing - 祝福区组件
 * 用于展示底部祝福文案
 */

import React from 'react';
import { PropObject } from '@/types/template-schema';

interface SectionBlessingProps {
  props?: PropObject;
  style?: React.CSSProperties;
}

export const SectionBlessing: React.FC<SectionBlessingProps> = ({ 
  props = {}, 
  style = {} 
}) => {
  const {
    text = '感谢您见证我们的幸福时刻！',
    author,
    showDecorations = true,
    decorationEmojis = ['💕', '🎉', '💕'],
  } = props;

  return (
    <section
      style={{
        padding: '60px 20px',
        background: 'linear-gradient(180deg, #fff 0%, #fff5eb 100%)',
        textAlign: 'center',
        ...style,
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* 装饰 */}
        {showDecorations && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {decorationEmojis.map((emoji, index) => (
              <span
                key={index}
                style={{
                  fontSize: '24px',
                  animation: `pulse ${1.5 + index * 0.3}s infinite`,
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}

        {/* 祝福语 */}
        <p
          style={{
            fontSize: '20px',
            color: '#FF8C42',
            fontWeight: '500',
            margin: '0 0 32px',
            lineHeight: 1.6,
          }}
        >
          {text}
        </p>

        {/* 署名 */}
        {author && (
          <p
            style={{
              fontSize: '14px',
              color: '#888',
              margin: 0,
            }}
          >
            —— {author}
          </p>
        )}

        {/* 动画 */}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
        `}</style>
      </div>
    </section>
  );
};

export default SectionBlessing;
