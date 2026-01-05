/**
 * SectionGallery - 相册区组件
 * 用于展示婚礼照片网格
 */

import React from 'react';
import { PropObject } from '@/types/template-schema';

interface SectionGalleryProps {
  props?: PropObject;
  style?: React.CSSProperties;
}

export const SectionGallery: React.FC<SectionGalleryProps> = ({ 
  props = {}, 
  style = {} 
}) => {
  const {
    images = [],
    layout = 'grid', // grid | carousel | masonry
    columns = 3,
    showCaptions = false,
    placeholderEmoji = '📷',
  } = props;

  // 默认图片（如果没有提供）
  const defaultImages = [
    { url: '', caption: '照片1' },
    { url: '', caption: '照片2' },
    { url: '', caption: '照片3' },
    { url: '', caption: '照片4' },
    { url: '', caption: '照片5' },
    { url: '', caption: '照片6' },
  ];

  const displayImages = images.length > 0 ? images : defaultImages;

  const getGridStyle = () => {
    switch (layout) {
      case 'carousel':
        return {
          display: 'flex',
          overflowX: 'auto',
          gap: '16px',
          padding: '0 20px',
          scrollSnapType: 'x mandatory',
        };
      case 'masonry':
        return {
          columnCount: columns,
          columnGap: '16px',
          padding: '0 20px',
        };
      default:
        return {
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '12px',
          padding: '0 20px',
        };
    }
  };

  const getItemStyle = (index: number): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '12px',
      aspectRatio: '4/3',
      background: 'linear-gradient(135deg, #fff5eb 0%, #FFE4CC 100%)',
    };

    if (layout === 'masonry') {
      baseStyle.pageBreakInside = 'avoid';
      baseStyle.marginBottom = '12px';
    }

    if (layout === 'carousel') {
      baseStyle.flex = '0 0 280px';
      scrollSnapAlign = 'center';
    }

    return baseStyle;
  };

  const renderPlaceholder = (index: number) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        fontSize: '48px',
        opacity: 0.5,
      }}
    >
      {placeholderEmoji}
    </div>
  );

  return (
    <section
      style={{
        padding: '60px 0',
        background: '#fff',
        ...style,
      }}
    >
      {/* 标题 */}
      <div style={{ textAlign: 'center', marginBottom: '40px', padding: '0 20px' }}>
        <p style={{
          fontSize: '12px',
          color: '#FF8C42',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          Photo Gallery
        </p>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#333',
          margin: 0,
          fontFamily: 'Georgia, serif',
        }}>
          幸福相册
        </h2>
        <div style={{
          width: '40px',
          height: '2px',
          background: '#FF8C42',
          margin: '12px auto 0',
          borderRadius: '2px',
        }} />
      </div>

      {/* 图片网格 */}
      <div style={getGridStyle()}>
        {displayImages.map((image, index) => (
          <div
            key={index}
            style={getItemStyle(index)}
          >
            {image.url ? (
              <img
                src={image.url}
                alt={image.caption || `照片 ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s',
                }}
              />
            ) : (
              renderPlaceholder(index)
            )}

            {/* 悬停效果 */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 0%, rgba(255, 140, 66, 0.3) 100%)',
                opacity: 0,
                transition: 'opacity 0.3s',
              }}
            />

            {/* 标题 */}
            {showCaptions && image.caption && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '8px 12px',
                  background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%)',
                  color: '#fff',
                  fontSize: '12px',
                }}
              >
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionGallery;
