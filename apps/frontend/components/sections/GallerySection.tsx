/**
 * GallerySection - 相册区组件
 * 用于展示婚礼照片列表，移动端纵向排列
 */

import React from 'react';

export interface GalleryImage {
  url: string;
  thumbUrl?: string;
  caption?: string;
}

export interface GallerySectionProps {
  images?: GalleryImage[];
  layout?: 'grid' | 'list';
  columns?: number;
  showCaptions?: boolean;
  placeholderEmoji?: string;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  images = [],
  layout = 'list',
  columns = 1,
  showCaptions = false,
  placeholderEmoji = '📷',
}) => {
  // 默认图片（无数据时显示）
  const defaultImages = [
    { url: '', caption: '我们的回忆' },
    { url: '', caption: '甜蜜瞬间' },
    { url: '', caption: '幸福时光' },
  ];

  const displayImages = images.length > 0 ? images : defaultImages;

  const getContainerStyle = (): React.CSSProperties => {
    if (layout === 'grid') {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '12px',
        padding: '0 16px',
      };
    }
    return {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '0 16px',
    };
  };

  const getItemStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '16px',
      aspectRatio: '4/3',
      background: 'linear-gradient(135deg, #fef3f7 0%, #ffe4ec 100%)',
    };

    if (layout === 'grid') {
      baseStyle.width = '100%';
    }

    return baseStyle;
  };

  const renderPlaceholder = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        fontSize: '40px',
        opacity: 0.4,
      }}
    >
      {placeholderEmoji}
    </div>
  );

  return (
    <section
      style={{
        padding: '48px 0 56px',
        background: '#fff',
      }}
    >
      {/* 标题 */}
      <div style={{ textAlign: 'center', marginBottom: '36px', padding: '0 16px' }}>
        <p
          style={{
            fontSize: '11px',
            color: '#f472b6',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          Photo Gallery
        </p>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#333',
            margin: 0,
            fontFamily: 'Georgia, serif',
          }}
        >
          幸福相册
        </h2>
        <div
          style={{
            width: '36px',
            height: '2px',
            background: 'linear-gradient(90deg, #f472b6, #fb7185)',
            margin: '12px auto 0',
            borderRadius: '2px',
          }}
        />
      </div>

      {/* 图片列表 */}
      <div style={getContainerStyle()}>
        {displayImages.map((image, index) => (
          <div
            key={index}
            style={getItemStyle()}
          >
            {image.url ? (
              <img
                src={image.url}
                alt={image.caption || `照片 ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
              />
            ) : (
              renderPlaceholder()
            )}

            {/* 悬停遮罩效果 */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 0%, rgba(244, 114, 182, 0.1) 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
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
                  padding: '10px 14px',
                  background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 100%)',
                  color: '#fff',
                  fontSize: '13px',
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

export default GallerySection;
