'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TEMPLATES } from '@/types/template';
import { TemplateCard } from '@/components/TemplateCard';

const CATEGORIES = [
  { id: 'all', name: '全部', icon: '🎨' },
  { id: 'romantic', name: '浪漫', icon: '💕' },
  { id: 'elegant', name: '高雅', icon: '✨' },
  { id: 'nature', name: '自然', icon: '🌿' },
  { id: 'modern', name: '现代', icon: '💎' },
  { id: 'theme', name: '主题', icon: '🌟' },
];

const COLORS = [
  { id: 'all', name: '全部', color: '' },
  { id: 'red', name: '红色', color: '#f43f5e' },
  { id: 'pink', name: '粉色', color: '#ec4899' },
  { id: 'gold', name: '金色', color: '#f59e0b' },
  { id: 'green', name: '绿色', color: '#10b981' },
  { id: 'blue', name: '蓝色', color: '#0ea5e9' },
  { id: 'purple', name: '紫色', color: '#8b5cf6' },
];

export default function PcHomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeColor, setActiveColor] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesCategory =
      activeCategory === 'all' ||
      template.features.some((f) =>
        f.toLowerCase().includes(activeCategory.toLowerCase())
      );

    const matchesColor =
      activeColor === 'all' ||
      template.primaryColor.includes(activeColor) ||
      template.secondaryColor.includes(activeColor);

    const matchesSearch =
      searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesColor && matchesSearch;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === 'popular') {
      return 0;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/pc" className="flex items-center gap-3">
              <span className="text-3xl">💑</span>
              <div>
                <h1 className="text-xl font-bold text-gray-800">婚礼请帖</h1>
                <p className="text-xs text-gray-500">Wedding Invitation</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-6">
              <nav className="flex gap-6">
                <Link href="/pc" className="text-[#FF8C42] font-medium">模板中心</Link>
                <Link href="/pc/create" className="text-gray-600 hover:text-[#FF8C42] transition-colors">制作请帖</Link>
                <a href="#help" className="text-gray-600 hover:text-[#FF8C42] transition-colors">帮助中心</a>
              </nav>
              
              <Link
                href="/pc/create"
                className="px-6 py-2.5 bg-[#FF8C42] text-white font-medium rounded-full hover:bg-[#E67328] transition-colors shadow-lg shadow-[#FF8C42]/30"
              >
                立即制作
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="mb-12">
          <div className="bg-gradient-to-r from-[#FF8C42] to-[#FFB77A] rounded-3xl p-8 md:p-12 text-white">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                精选婚礼请帖模板
              </h2>
              <p className="text-lg text-white/90 mb-6">
                免费的电子婚礼请帖模板，为您的婚礼增添一份特别的浪漫
              </p>
              
              <div className="relative max-w-xl">
                <input
                  type="text"
                  placeholder="搜索模板名称..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3.5 pl-12 rounded-full text-gray-800 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 mr-2">场景：</span>
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-[#FF8C42] text-white shadow-lg shadow-[#FF8C42]/30'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">颜色：</span>
                <div className="flex gap-1">
                  {COLORS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setActiveColor(color.id)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        activeColor === color.id ? 'border-gray-800 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.color || '#e5e7eb' }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 focus:outline-none focus:border-[#FF8C42]"
              >
                <option value="popular">最受欢迎</option>
                <option value="newest">最新发布</option>
                <option value="usage">使用最多</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              共 {sortedTemplates.length} 款模板
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
          
          {sortedTemplates.length === 0 && (
            <div className="text-center py-16">
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                没有找到相关模板
              </h3>
              <p className="text-gray-400">试试其他搜索条件吧</p>
            </div>
          )}
        </section>

        <section className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-8 md:p-12 text-center mb-12">
          <span className="text-5xl mb-4 block">💝</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            还没有找到心仪的模板？
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            使用我们的自定义工具，打造独一无二的婚礼请帖，让您的婚礼更加难忘
          </p>
          <Link
            href="/pc/create"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF8C42] text-white font-semibold rounded-full hover:bg-[#E67328] transition-colors shadow-lg shadow-[#FF8C42]/30"
          >
            <span>开始制作</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💑</span>
                <span className="text-lg font-semibold">婚礼请帖</span>
              </div>
              <p className="text-gray-400 text-sm max-w-xs">
                为您提供精美的婚礼请帖模板，让爱的邀请更加特别
              </p>
            </div>
            
            <div className="flex gap-12">
              <div>
                <h4 className="font-medium mb-4">模板分类</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">浪漫系列</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">简约系列</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">户外系列</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">主题系列</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">使用帮助</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">如何制作</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">常见问题</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">联系客服</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2026 婚礼请帖 · 用心制作</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
