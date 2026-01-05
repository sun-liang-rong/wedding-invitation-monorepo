/**
 * WeddingInfoSection - 婚礼详情区组件
 * 用于展示婚礼日期、时间和地点信息
 */

import React from 'react';

export interface WeddingInfoSectionProps {
  date?: string;
  time?: string;
  venue?: string;
  address?: string;
  showTime?: boolean;
  showAddress?: boolean;
  calendarEmoji?: string;
  locationEmoji?: string;
  mapButtonText?: string;
}

export const WeddingInfoSection: React.FC<WeddingInfoSectionProps> = ({
  date = '2026年1月18日',
  time = '11:30',
  venue = '幸福酒店',
  address = '详细地址',
  showTime = true,
  showAddress = true,
  calendarEmoji = '📅',
  locationEmoji = '📍',
  mapButtonText = '查看地图',
}) => {
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
        padding: '56px 20px',
        background: 'linear-gradient(180deg, #fff 0%, #fef7f7 100%)',
      }}
    >
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <p
            style={{
              fontSize: '11px',
              color: '#f472b6',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            Wedding Details
          </p>
          <h2
            style={{
              fontSize: '26px',
              fontWeight: '600',
              color: '#333',
              margin: 0,
              fontFamily: 'Georgia, serif',
            }}
          >
            婚礼详情
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

        {/* 详情卡片 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          {/* 时间卡片 */}
          <div
            style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '28px 20px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(244, 114, 182, 0.1)',
              transition: 'transform 0.3s ease',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f472b6 0%, #fb7185 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                fontSize: '24px',
              }}
            >
              {calendarEmoji}
            </div>

            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#333',
                margin: '0 0 18px',
              }}
            >
              婚礼时间
            </h3>

            <div style={{ marginBottom: '10px' }}>
              <p
                style={{
                  fontSize: '11px',
                  color: '#999',
                  marginBottom: '4px',
                }}
              >
                日期
              </p>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333',
                  margin: 0,
                }}
              >
                {formatDate(date)}
              </p>
            </div>

            {showTime && (
              <div>
                <p
                  style={{
                    fontSize: '11px',
                    color: '#999',
                    marginBottom: '4px',
                  }}
                >
                  时间
                </p>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#333',
                    margin: 0,
                  }}
                >
                  {time}
                </p>
              </div>
            )}
          </div>

          {/* 地点卡片 */}
          <div
            style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '28px 20px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(244, 114, 182, 0.1)',
              transition: 'transform 0.3s ease',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fb7185 0%, #f472b6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                fontSize: '24px',
              }}
            >
              {locationEmoji}
            </div>

            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#333',
                margin: '0 0 18px',
              }}
            >
              婚礼地点
            </h3>

            <div style={{ marginBottom: '10px' }}>
              <p
                style={{
                  fontSize: '11px',
                  color: '#999',
                  marginBottom: '4px',
                }}
              >
                酒店
              </p>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333',
                  margin: 0,
                }}
              >
                {venue}
              </p>
            </div>

            {showAddress && (
              <div>
                <p
                  style={{
                    fontSize: '11px',
                    color: '#999',
                    marginBottom: '4px',
                  }}
                >
                  地址
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#666',
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {address}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 查看地图按钮 */}
        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #f472b6 0%, #fb7185 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(244, 114, 182, 0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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

export default WeddingInfoSection;
