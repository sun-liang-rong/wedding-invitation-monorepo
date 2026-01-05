/**
 * SectionCouple - 新人信息区组件
 * 用于展示新郎和新娘的信息，包含头像、介绍等
 */

import React from 'react';
import { PropObject } from '@/types/template-schema';

interface SectionCoupleProps {
  props?: PropObject;
  style?: React.CSSProperties;
}

export const SectionCouple: React.FC<SectionCoupleProps> = ({ 
  props = {}, 
  style = {} 
}) => {
  const {
    groomName = '新郎',
    groomAvatar,
    groomBio = '温柔体贴，才华横溢',
    groomIntro = ['遇见你，是我最美丽的意外', '余生请多指教'],
    
    brideName = '新娘',
    brideAvatar,
    brideBio = '美丽大方，善良可爱',
    brideIntro = ['从此以后，我的故事都是你', '执子之手，与子偕老'],
    
    layout = 'horizontal', // horizontal | vertical
    showBoth = true,
    coupleEmoji = '💕',
  } = props;

  const AvatarPlaceholder = ({ gender }: { gender: 'male' | 'female' }) => {
    const gradient = gender === 'male'
      ? 'linear-gradient(135deg, #FF8C42 0%, #FFB77A 100%)'
      : 'linear-gradient(135deg, #FFB77A 0%, #FF8C42 100%)';
    
    return (
      <div
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 10px 30px rgba(255, 140, 66, 0.3)',
          fontSize: '48px',
        }}
      >
        {groomAvatar || brideAvatar ? (
          <img 
            src={gender === 'male' ? groomAvatar : brideAvatar} 
            alt={gender === 'male' ? groomName : brideName}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <span>{gender === 'male' ? '👨‍💼' : '👩‍💼'}</span>
        )}
      </div>
    );
  };

  const PersonCard = ({ 
    name, 
    bio, 
    intros, 
    gender,
    isLeft 
  }: { 
    name: string; 
    bio: string; 
    intros: string[];
    gender: 'male' | 'female';
    isLeft?: boolean;
  }) => (
    <div
      style={{
        textAlign: isLeft ? 'right' : 'left',
        flex: 1,
        maxWidth: layout === 'horizontal' ? '300px' : '100%',
      }}
    >
      <AvatarPlaceholder gender={gender} />
      
      <h3 style={{
        fontSize: '24px',
        fontWeight: '600',
        color: '#333',
        margin: '0 0 8px',
        fontFamily: 'Georgia, serif',
      }}>
        {name}
      </h3>
      
      <p style={{
        fontSize: '14px',
        color: '#888',
        margin: '0 0 16px',
      }}>
        {bio}
      </p>
      
      <div style={{
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.8',
        whiteSpace: 'pre-line',
      }}>
        {intros.map((intro, i) => (
          <p key={i} style={{ margin: '4px 0' }}>
            {intro}
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <section
      style={{
        padding: '60px 20px',
        background: '#fff',
        ...style,
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{
            fontSize: '12px',
            color: '#FF8C42',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            The Couple
          </p>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#333',
            margin: 0,
            fontFamily: 'Georgia, serif',
          }}>
            新郎新娘
          </h2>
          <div style={{
            width: '40px',
            height: '2px',
            background: '#FF8C42',
            margin: '12px auto 0',
            borderRadius: '2px',
          }} />
        </div>

        {/* 新人卡片 */}
        {layout === 'horizontal' ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '60px',
              flexWrap: 'wrap',
            }}
          >
            {showBoth ? (
              <>
                <PersonCard 
                  name={groomName} 
                  bio={groomBio} 
                  intros={groomIntro} 
                  gender="male"
                  isLeft
                />
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '24px',
                  color: '#FF8C42',
                  marginTop: '60px',
                }}>
                  {coupleEmoji}
                </div>
                
                <PersonCard 
                  name={brideName} 
                  bio={brideBio} 
                  intros={brideIntro} 
                  gender="female"
                />
              </>
            ) : (
              <PersonCard 
                name={groomName} 
                bio={groomBio} 
                intros={groomIntro} 
                gender="male"
              />
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <PersonCard 
              name={groomName} 
              bio={groomBio} 
              intros={groomIntro} 
              gender="male"
              isLeft
            />
            <PersonCard 
              name={brideName} 
              bio={brideBio} 
              intros={brideIntro} 
              gender="female"
            />
          </div>
        )}

        {/* 底部装饰 */}
        <div style={{
          textAlign: 'center',
          marginTop: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          color: '#FF8C42',
        }}>
          <span>💕</span>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>我们在一起了</span>
          <span>💕</span>
        </div>
      </div>
    </section>
  );
};

export default SectionCouple;
