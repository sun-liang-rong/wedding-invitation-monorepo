/**
 * SectionEvent - 婚礼详情区组件
 * 用于展示婚礼时间、地点等信息
 */

import React from 'react';
import { PropObject } from '@/types/template-schema';

interface SectionEventProps {
  props?: PropObject;
  style?: React.CSSProperties;
}

export const SectionEvent: React.FC<SectionEventProps> = ({ 
  props = {}, 
  style = {} 
}) => {
  const {
    date = '2026年1月18日',
    time = '11:30',
    venue = '幸福酒店',
    address = '北京市朝阳区幸福路88号',
    showTime = true,
    showAddress = true,
    calendarEmoji = '📅',
    locationEmoji = '📍',
    mapButtonText = '查看地图',
  } = props;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const match = dateStr.match(/(\d+)年(\d+)月(\d+)日/);
    if (match) {
      return `${match[1]}年${match[2]}月${match[3]}日`;
    }
    return dateStr;
  };

  return (
    <section
      style={{
        padding: '60px 20px',
        background: 'linear-gradient(180deg, #fff 0%, #fff5eb 100%)',
        ...style,
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{
            fontSize: '12px',
            color: '#FF8C42',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            Wedding Details
          </p>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#333',
            margin: 0,
            fontFamily: 'Georgia, serif',
          }}>
            婚礼详情
          </h2>
          <div style={{
            width: '40px',
            height: '2px',
            background: '#FF8C42',
            margin: '12px auto 0',
            borderRadius: '2px',
          }} />
        </div>

        {/* 详情卡片 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}>
          {/* 时间卡片 */}
          <div
            style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '32px 24px',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(255, 140, 66, 0.1)',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF8C42 0%, #FFB77A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '28px',
              }}
            >
              {calendarEmoji}
            </div>
            
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#333',
              margin: '0 0 20px',
            }}>
              婚礼时间
            </h3>
            
            <div style={{ marginBottom: '12px' }}>
              <p style={{
                fontSize: '12px',
                color: '#888',
                marginBottom: '4px',
              }}>
                日期
              </p>
              <p style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#333',
                margin: 0,
              }}>
                {formatDate(date)}
              </p>
            </div>
            
            <div>
              <p style={{
                fontSize: '12px',
                color: '#888',
                marginBottom: '4px',
              }}>
                时间
              </p>
              <p style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#333',
                margin: 0,
              }}>
                {time}
              </p>
            </div>
          </div>

          {/* 地点卡片 */}
          <div
            style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '32px 24px',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(255, 140, 66, 0.1)',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFB77A 0%, #FF8C42 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '28px',
              }}
            >
              {locationEmoji}
            </div>
            
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#333',
              margin: '0 0 20px',
            }}>
              婚礼地点
            </h3>
            
            <div style={{ marginBottom: '12px' }}>
              <p style={{
                fontSize: '12px',
                color: '#888',
                marginBottom: '4px',
              }}>
                酒店
              </p>
              <p style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#333',
                margin: 0,
              }}>
                {venue}
              </p>
            </div>
            
            <div>
              <p style={{
                fontSize: '12px',
                color: '#888',
                marginBottom: '4px',
              }}>
                地址
              </p>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0,
                lineHeight: 1.4,
              }}>
                {address}
              </p>
            </div>
          </div>
        </div>

        {/* 查看地图按钮 */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              background: '#FF8C42',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(255, 140, 66, 0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            <span>{locationEmoji}</span>
            <span>{mapButtonText}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SectionEvent;
