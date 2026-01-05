/**
 * CoverSection - 封面区组件
 * 用于展示婚礼封面，包含背景图、新人姓名、副标题
 */

import React from 'react';

export interface CoverSectionProps {
  backgroundImage?: string;
  groomName: string;
  brideName: string;
  subtitle?: string;
  mainEmoji?: string;
  date?: string;
  time?: string;
  showTime?: boolean;
}

export const CoverSection: React.FC<CoverSectionProps> = ({
  backgroundImage = '',
  groomName = '新郎',
  brideName = '新娘',
  subtitle = 'WEDDING INVITATION',
  mainEmoji = '💕',
  date = '2026年1月18日',
  time = '11:30',
  showTime = true,
}) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const match = dateStr.match(/(\d+)年(\d+)月(\d+)日/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}`;
    }
    return dateStr;
  };

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        background: backgroundImage
          ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(${backgroundImage}) center/cover`
          : 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        color: '#fff',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* 装饰性纹理 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.08,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          pointerEvents: 'none',
        }}
      />

      {/* 主内容 */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* 头像/图标 */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '36px',
            animation: 'bounce 3s infinite',
          }}
        >
          {mainEmoji}
        </div>

        {/* 副标题 */}
        <p
          style={{
            fontSize: '12px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '16px',
            opacity: 0.9,
          }}
        >
          {subtitle}
        </p>

        {/* 新人姓名 */}
        <h1
          style={{
            fontSize: 'clamp(32px, 10vw, 48px)',
            fontWeight: '600',
            margin: '0 0 28px',
            fontFamily: 'Georgia, serif',
            lineHeight: 1.3,
          }}
        >
          <span style={{ display: 'block' }}>{groomName}</span>
          <span
            style={{
              display: 'block',
              fontSize: 'clamp(20px, 5vw, 32px)',
              fontWeight: '300',
              opacity: 0.8,
              margin: '8px 0',
            }}
          >
            &amp;
          </span>
          <span style={{ display: 'block' }}>{brideName}</span>
        </h1>

        {/* 日期时间卡片 */}
        {showTime && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255,255,255,0.95)',
              padding: '14px 28px',
              borderRadius: '50px',
              color: '#333',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}
          >
            <span style={{ fontSize: '18px' }}>📅</span>
            <span style={{ fontWeight: '600', fontSize: '16px' }}>
              {formatDate(date)}
            </span>
            <span style={{ width: '1px', height: '20px', background: '#ddd' }} />
            <span style={{ fontSize: '18px' }}>⏰</span>
            <span style={{ fontWeight: '600', fontSize: '16px' }}>
              {time}
            </span>
          </div>
        )}

        {/* 向下箭头 */}
        <div
          style={{
            marginTop: '48px',
            animation: 'scroll 2s infinite',
            opacity: 0.7,
          }}
        >
          <span style={{ fontSize: '24px' }}>👇</span>
        </div>
      </div>

      {/* 动画样式 */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes scroll {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(8px); opacity: 0.4; }
        }
      `}</style>
    </section>
  );
};

export default CoverSection;
