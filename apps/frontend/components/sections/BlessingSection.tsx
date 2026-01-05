/**
 * BlessingSection - 祝福区组件
 * 用于展示婚礼祝福文案
 */

import React from 'react';

export interface BlessingSectionProps {
  text?: string;
  author?: string;
  showDecorations?: boolean;
  decorationEmojis?: string[];
}

export const BlessingSection: React.FC<BlessingSectionProps> = ({
  text = '感谢您见证我们的幸福时刻！',
  author,
  showDecorations = true,
  decorationEmojis = ['💕', '🎉', '💕'],
}) => {
  return (
    <section
      style={{
        padding: '56px 20px',
        background: 'linear-gradient(180deg, #fff 0%, #fef7f7 100%)',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        {/* 装饰 */}
        {showDecorations && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '14px',
              marginBottom: '28px',
            }}
          >
            {decorationEmojis.map((emoji, index) => (
              <span
                key={index}
                style={{
                  fontSize: '22px',
                  animation: `pulse ${1.5 + index * 0.3}s infinite`,
                  animationDelay: `${index * 0.2}s`,
                  display: 'inline-block',
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
            fontSize: '18px',
            color: '#f472b6',
            fontWeight: '500',
            margin: '0 0 28px',
            lineHeight: 1.7,
          }}
        >
          {text}
        </p>

        {/* 署名 */}
        {author && (
          <p
            style={{
              fontSize: '13px',
              color: '#999',
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            —— {author}
          </p>
        )}

        {/* 动画装饰 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '32px',
          }}
        >
          <span style={{ fontSize: '16px', opacity: 0.6 }}>💕</span>
          <span style={{ fontSize: '16px', opacity: 0.8 }}>💕</span>
          <span style={{ fontSize: '16px', opacity: 1 }}>💕</span>
          <span style={{ fontSize: '16px', opacity: 0.8 }}>💕</span>
          <span style={{ fontSize: '16px', opacity: 0.6 }}>💕</span>
        </div>

        {/* 动画样式 */}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default BlessingSection;
