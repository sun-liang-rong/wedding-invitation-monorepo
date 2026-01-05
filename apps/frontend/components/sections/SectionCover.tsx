/**
 * SectionCover - 封面区组件
 * 用于显示婚礼封面，包含新人姓名、日期时间等
 */

import React from 'react';
import { PropObject } from '@/types/template-schema';

interface SectionCoverProps {
  props?: PropObject;
  style?: React.CSSProperties;
}

export const SectionCover: React.FC<SectionCoverProps> = ({ 
  props = {}, 
  style = {} 
}) => {
  const {
    groomName = '新郎',
    brideName = '新娘',
    date = '2026年1月18日',
    time = '11:30',
    backgroundImage,
    showTime = true,
    mainEmoji = '💑',
    dateLabel = '婚礼日期',
  } = props;

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
        padding: '40px 20px',
        background: backgroundImage 
          ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(${backgroundImage}) center/cover`
          : 'linear-gradient(135deg, #FF8C42 0%, #FFB77A 100%)',
        color: '#fff',
        textAlign: 'center',
        ...style,
      }}
    >
      {/* 装饰性图案 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          pointerEvents: 'none',
        }}
      />

      {/* 主内容 */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* 头像/图标 */}
        <div 
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '40px',
            animation: 'bounce 2s infinite',
          }}
        >
          {mainEmoji}
        </div>

        {/* 副标题 */}
        <p style={{
          fontSize: '14px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '16px',
          opacity: 0.9,
        }}>
          Wedding Invitation
        </p>

        {/* 新人姓名 */}
        <h1 style={{
          fontSize: 'clamp(32px, 8vw, 56px)',
          fontWeight: '700',
          margin: '0 0 24px',
          fontFamily: 'Georgia, serif',
          lineHeight: 1.2,
        }}>
          <span style={{ display: 'block' }}>{groomName}</span>
          <span style={{ 
            fontSize: 'clamp(24px, 5vw, 40px)', 
            fontWeight: '300',
            opacity: 0.7,
            margin: '8px 0',
          }}>
            &amp;
          </span>
          <span style={{ display: 'block' }}>{brideName}</span>
        </h1>

        {/* 邀请语 */}
        <p style={{
          fontSize: '16px',
          opacity: 0.9,
          marginBottom: '32px',
        }}>
          诚邀您参加我们的婚礼
        </p>

        {/* 日期时间卡片 */}
        {showTime && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              background: 'rgba(255,255,255,0.95)',
              padding: '16px 32px',
              borderRadius: '50px',
              color: '#333',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>📅</span>
              <span style={{ fontWeight: '600', fontSize: '18px' }}>
                {formatDate(date)}
              </span>
            </div>
            
            <div style={{ width: '1px', height: '24px', background: '#ddd' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>⏰</span>
              <span style={{ fontWeight: '600', fontSize: '18px' }}>
                {time}
              </span>
            </div>
          </div>
        )}

        {/* 向下箭头 */}
        <div style={{ 
          marginTop: '48px',
          animation: 'scroll 2s infinite',
          opacity: 0.8,
        }}>
          <span style={{ fontSize: '28px' }}>👇</span>
        </div>
      </div>

      {/* 动画关键帧 */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes scroll {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(10px); opacity: 0.4; }
        }
      `}</style>
    </section>
  );
};

export default SectionCover;
