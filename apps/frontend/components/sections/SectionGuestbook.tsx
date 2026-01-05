/**
 * SectionGuestbook - 留言板区组件
 * 用于展示宾客留言
 */

import React, { useState } from 'react';
import { PropObject } from '@/types/template-schema';

interface GuestEntry {
  name: string;
  message: string;
  createdAt?: string;
  avatar?: string;
}

interface SectionGuestbookProps {
  props?: PropObject;
  style?: React.CSSProperties;
}

export const SectionGuestbook: React.FC<SectionGuestbookProps> = ({ 
  props = {}, 
  style = {} 
}) => {
  const {
    entries = [] as GuestEntry[],
    title = '送祝福',
    subtitle = 'BLESSINGS',
    placeholderName = '您的姓名',
    placeholderMessage = '请输入您的祝福语...',
    submitText = '送上祝福',
    emptyText = '暂无祝福，快来抢沙发！',
  } = props;

  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [submittedEntries, setSubmittedEntries] = useState<GuestEntry[]>(entries);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (guestName.trim() && guestMessage.trim()) {
      const newEntry: GuestEntry = {
        name: guestName,
        message: guestMessage,
        createdAt: new Date().toISOString(),
      };
      
      setSubmittedEntries([newEntry, ...submittedEntries]);
      setGuestName('');
      setGuestMessage('');
      setIsSubmitted(true);
      
      // 3秒后重置提交状态
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section
      style={{
        padding: '60px 20px',
        background: '#fff',
        ...style,
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{
            fontSize: '12px',
            color: '#FF8C42',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            {subtitle}
          </p>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#333',
            margin: 0,
            fontFamily: 'Georgia, serif',
          }}>
            {title}
          </h2>
          <div style={{
            width: '40px',
            height: '2px',
            background: '#FF8C42',
            margin: '12px auto 0',
            borderRadius: '2px',
          }} />
        </div>

        {/* 留言表单 */}
        <div
          style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '32px 24px',
            boxShadow: '0 10px 40px rgba(255, 140, 66, 0.1)',
            marginBottom: '40px',
          }}
        >
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF8C42 0%, #FFB77A 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '40px',
                }}
              >
                ✅
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#333',
                margin: '0 0 8px',
              }}>
                祝福已送达！
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#888',
                margin: 0,
              }}>
                感谢您的祝福
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ space: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '8px',
                    fontWeight: '500',
                  }}
                >
                  {placeholderName}
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder={placeholderName}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '8px',
                    fontWeight: '500',
                  }}
                >
                  {placeholderMessage}
                </label>
                <textarea
                  value={guestMessage}
                  onChange={(e) => setGuestMessage(e.target.value)}
                  placeholder={placeholderMessage}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    resize: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              
              <button
                type="submit"
                disabled={!guestName.trim() || !guestMessage.trim()}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #FF8C42 0%, #FFB77A 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(255, 140, 66, 0.3)',
                  opacity: (!guestName.trim() || !guestMessage.trim()) ? 0.5 : 1,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                {submitText}
              </button>
            </form>
          )}
        </div>

        {/* 留言列表 */}
        <div>
          {submittedEntries.length > 0 ? (
            <div style={{ space: '16px' }}>
              {submittedEntries.map((entry, index) => (
                <div
                  key={index}
                  style={{
                    padding: '20px',
                    background: '#fafafa',
                    borderRadius: '16px',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FF8C42 0%, #FFB77A 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: '500',
                        marginRight: '12px',
                      }}
                    >
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#333',
                        margin: 0,
                      }}>
                        {entry.name}
                      </p>
                      {entry.createdAt && (
                        <p style={{
                          fontSize: '12px',
                          color: '#888',
                          margin: '2px 0 0',
                        }}>
                          {new Date(entry.createdAt).toLocaleDateString('zh-CN')}
                        </p>
                      )}
                    </div>
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: 1.6,
                    margin: 0,
                    paddingLeft: '52px',
                  }}>
                    {entry.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{
                fontSize: '48px',
                marginBottom: '16px',
              }}>
                💬
              </p>
              <p style={{
                fontSize: '14px',
                color: '#888',
                margin: 0,
              }}>
                {emptyText}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SectionGuestbook;
