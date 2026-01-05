'use client';

import React from 'react';
import { WeddingRenderer } from '@/components/renderer';
import { WeddingData, createDefaultWeddingData } from '@/types/wedding-data';
import { WeddingTemplate } from '@/types/template-schema';
import romanticYouTemplate from '@/templates/romantic-you.json';

/**
 * WeddingRenderer 使用示例页面
 * 
 * 这个页面展示了如何使用 WeddingRenderer 组件：
 * 1. 导入模板 JSON
 * 2. 准备用户数据 WeddingData
 * 3. 使用 WeddingRenderer 进行渲染
 * 
 * 访问 /pc/template-demo 查看效果
 */

export default function TemplateDemoPage() {
  // 示例 1: 使用默认数据
  const defaultData = createDefaultWeddingData();
  
  // 示例 2: 自定义数据
  const sampleData: WeddingData = {
    meta: {
      id: 'invitation-001',
      templateId: 'romantic-you',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    couple: {
      groom: {
        name: '王子',
        avatar: '',
        bio: '温柔体贴，才华横溢',
        intro: [
          '遇见你，是我最美丽的意外',
          '余生请多指教',
          '执子之手，与子偕老'
        ],
      },
      bride: {
        name: '公主',
        avatar: '',
        bio: '美丽大方，善良可爱',
        intro: [
          '从此以后，我的故事都是你',
          '山河远阔，人间烟火',
          '无一是你，无一不是你'
        ],
      },
    },
    event: {
      primary: {
        date: '2026年1月18日',
        time: '11:30',
        venue: '幸福海洋酒店',
        address: '北京市朝阳区海滨路888号',
        mapUrl: 'https://maps.google.com',
      },
    },
    cover: {
      image: '',
    },
    gallery: {
      images: [
        { url: '', caption: '我们的第一张合照' },
        { url: '', caption: '求婚纪念' },
        { url: '', caption: '日常点滴' },
        { url: '', caption: '旅行回忆' },
        { url: '', caption: '甜蜜时刻' },
        { url: '', caption: '一起做饭' },
      ],
      layout: 'grid',
    },
    blessing: {
      text: '感谢您见证我们的幸福时刻！',
      author: '王子 & 公主',
    },
    guestbook: {
      enabled: true,
      entries: [
        {
          id: '1',
          name: '小明',
          message: '恭喜恭喜！祝你们百年好合，永远幸福！',
          createdAt: '2026-01-01T10:00:00Z',
        },
        {
          id: '2',
          name: '小红',
          message: '新娘子好漂亮！新婚快乐，早生贵子！',
          createdAt: '2026-01-02T14:30:00Z',
        },
      ],
    },
    rsvp: {
      enabled: true,
      deadline: '2026-01-10',
      contact: '微信: wedding2026',
    },
  };

  const template = romanticYouTemplate as unknown as WeddingTemplate;

  return (
    <div>
      {/* 调试面板 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: '12px 20px',
        background: 'rgba(0,0,0,0.8)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '14px',
      }}>
        <div>
          <span style={{ opacity: 0.6 }}>模板: </span>
          <strong>{template.meta.name}</strong>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              padding: '8px 16px',
              background: '#0ea5e9',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            回到顶部
          </button>
          <button
            onClick={() => {
              const data = JSON.stringify(sampleData, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'wedding-data.json';
              a.click();
            }}
            style={{
              padding: '8px 16px',
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            导出数据
          </button>
        </div>
      </div>

      {/* 渲染婚礼请帖 */}
      <WeddingRenderer
        template={template}
        data={sampleData}
      />

      {/* 技术说明 */}
      <div style={{
        padding: '60px 20px',
        background: '#1e293b',
        color: '#94a3b8',
        textAlign: 'center',
      }}>
        <h3 style={{ color: '#fff', marginBottom: '16px' }}>
          WeddingRenderer 模板系统
        </h3>
        <p style={{ maxWidth: '600px', margin: '0 auto', lineHeight: 1.8 }}>
          这是一个基于数据驱动的婚礼请帖渲染引擎，支持通过 JSON Schema 
          定义模板，通过统一的 WeddingData 数据结构注入内容，实现真正的
          模板与内容分离。
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '24px',
          flexWrap: 'wrap',
        }}>
          <span style={{
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            fontSize: '12px',
          }}>
            React + TypeScript
          </span>
          <span style={{
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            fontSize: '12px',
          }}>
            数据驱动渲染
          </span>
          <span style={{
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            fontSize: '12px',
          }}>
            占位符解析
          </span>
          <span style={{
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            fontSize: '12px',
          }}>
            响应式设计
          </span>
        </div>
      </div>
    </div>
  );
}
