'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ImageUploader } from '@/components/ImageUploader';
import { GalleryUploader } from '@/components/GalleryUploader';
import { TEMPLATES, getTemplateById, TemplateId } from '@/types/template';

interface FormData {
  templateId: TemplateId;
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  locationName: string;
  locationAddress: string;
  coverImage: string;
  galleryImages: string[];
  blessingText: string;
}

export default function PcCreatePage({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
  const resolvedSearchParams = use(searchParams);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  
  const [formData, setFormData] = useState<FormData>({
    templateId: (resolvedSearchParams.template as TemplateId) || 'classic',
    groomName: '',
    brideName: '',
    weddingDate: '',
    weddingTime: '',
    locationName: '',
    locationAddress: '',
    coverImage: '',
    galleryImages: [],
    blessingText: '感谢您见证我们的幸福时刻！',
  });

  useEffect(() => {
    if (resolvedSearchParams.template) {
      setFormData((prev) => ({ ...prev, templateId: resolvedSearchParams.template as TemplateId }));
    }
  }, [resolvedSearchParams.template]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          galleryImages: formData.galleryImages.filter((url) => url.trim() !== ''),
        }),
      });

      const result = await response.json();

      if (result.success) {
        router.push(result.data.url);
      } else {
        alert(result.message || '创建失败，请重试');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('创建失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  const currentTemplate = getTemplateById(formData.templateId);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '选择日期';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  };

  const steps = [
    { id: 1, name: '新人信息', icon: '💑' },
    { id: 2, name: '婚礼详情', icon: '📅' },
    { id: 3, name: '上传照片', icon: '📷' },
    { id: 4, name: '完成制作', icon: '✅' },
  ];

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
                <Link href="/pc" className="text-gray-600 hover:text-[#FF8C42] transition-colors">模板中心</Link>
                <Link href="/pc/create" className="text-[#FF8C42] font-medium">制作请帖</Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">制作婚礼请帖</h2>
          <p className="text-gray-600">
            正在使用模板：<span className="text-[#FF8C42] font-medium">{currentTemplate?.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => {
                  if (step.id < activeStep || step.id === 1) {
                    setActiveStep(step.id);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeStep === step.id
                    ? 'bg-[#FF8C42] text-white shadow-lg shadow-[#FF8C42]/30'
                    : activeStep > step.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-500'
                } ${step.id < activeStep || step.id === 1 ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                <span>{step.id < activeStep ? '✓' : step.icon}</span>
                <span className="hidden sm:inline">{step.name}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  activeStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {activeStep === 1 && (
                <section className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#FF8C42] rounded-full"></span>
                    新人信息
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        新郎姓名 *
                      </label>
                      <input
                        type="text"
                        name="groomName"
                        value={formData.groomName}
                        onChange={handleChange}
                        required
                        placeholder="请输入新郎姓名"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF8C42] focus:ring-2 focus:ring-[#FF8C42]/20 outline-none transition-all bg-gray-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        新娘姓名 *
                      </label>
                      <input
                        type="text"
                        name="brideName"
                        value={formData.brideName}
                        onChange={handleChange}
                        required
                        placeholder="请输入新娘姓名"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF8C42] focus:ring-2 focus:ring-[#FF8C42]/20 outline-none transition-all bg-gray-50/50"
                      />
                    </div>
                  </div>
                </section>
              )}

              {activeStep === 2 && (
                <section className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#FF8C42] rounded-full"></span>
                    婚礼详情
                  </h3>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          婚礼日期 *
                        </label>
                        <input
                          type="date"
                          name="weddingDate"
                          value={formData.weddingDate}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF8C42] focus:ring-2 focus:ring-[#FF8C42]/20 outline-none transition-all bg-gray-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          婚礼时间 *
                        </label>
                        <input
                          type="time"
                          name="weddingTime"
                          value={formData.weddingTime}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF8C42] focus:ring-2 focus:ring-[#FF8C42]/20 outline-none transition-all bg-gray-50/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        地点名称 *
                      </label>
                      <input
                        type="text"
                        name="locationName"
                        value={formData.locationName}
                        onChange={handleChange}
                        required
                        placeholder="例如：某某酒店"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF8C42] focus:ring-2 focus:ring-[#FF8C42]/20 outline-none transition-all bg-gray-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        详细地址 *
                      </label>
                      <input
                        type="text"
                        name="locationAddress"
                        value={formData.locationAddress}
                        onChange={handleChange}
                        required
                        placeholder="请输入详细地址"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF8C42] focus:ring-2 focus:ring-[#FF8C42]/20 outline-none transition-all bg-gray-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        底部祝福文案
                      </label>
                      <textarea
                        name="blessingText"
                        value={formData.blessingText}
                        onChange={handleChange}
                        rows={3}
                        placeholder="请输入底部祝福文案"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF8C42] focus:ring-2 focus:ring-[#FF8C42]/20 outline-none transition-all bg-gray-50/50 resize-none"
                      />
                    </div>
                  </div>
                </section>
              )}

              {activeStep === 3 && (
                <section className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#FF8C42] rounded-full"></span>
                    上传照片
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        封面图片
                      </label>
                      <ImageUploader
                        value={formData.coverImage}
                        onChange={(value) => setFormData((prev) => ({ ...prev, coverImage: value }))}
                        placeholder="点击或拖拽上传封面图片"
                        aspectRatio="auto"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        相册图片 <span className="text-gray-400 font-normal">（最多{currentTemplate?.photoRequirements.gallery || 6}张）</span>
                      </label>
                      <GalleryUploader
                        value={formData.galleryImages}
                        onChange={(value) => setFormData((prev) => ({ ...prev, galleryImages: value }))}
                        maxCount={currentTemplate?.photoRequirements.gallery || 6}
                      />
                    </div>
                  </div>
                </section>
              )}

              {activeStep === 4 && (
                <section className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#FF8C42] rounded-full"></span>
                    确认信息
                  </h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm text-gray-500">模板</p>
                        <p className="font-medium text-gray-800">{currentTemplate?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">新人</p>
                        <p className="font-medium text-gray-800">{formData.groomName} & {formData.brideName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">时间</p>
                        <p className="font-medium text-gray-800">{formatDate(formData.weddingDate)} {formData.weddingTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">地点</p>
                        <p className="font-medium text-gray-800">{formData.locationName}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">地址</p>
                        <p className="font-medium text-gray-800">{formData.locationAddress}</p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                  disabled={activeStep === 1}
                  className="px-6 py-3 bg-gray-100 text-gray-600 font-medium rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一步
                </button>
                
                {activeStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="px-6 py-3 bg-[#FF8C42] text-white font-medium rounded-full hover:bg-[#E67328] transition-colors shadow-lg shadow-[#FF8C42]/30"
                  >
                    下一步
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-[#FF8C42] to-[#FFB77A] text-white font-semibold rounded-full shadow-lg shadow-[#FF8C42]/30 hover:shadow-xl hover:shadow-[#FF8C42]/40 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        生成中...
                      </span>
                    ) : (
                      '✨ 生成婚礼请帖'
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">实时预览</h3>
                <div
                  className="aspect-[4/5] rounded-xl overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${currentTemplate?.primaryColor || '#f43f5e'} 0%, ${currentTemplate?.secondaryColor || '#fb7185'} 100%)`,
                  }}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-white text-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                      <span className="text-3xl">💑</span>
                    </div>
                    <h4 className="text-lg font-bold mb-1">
                      {formData.groomName || '新郎'} & {formData.brideName || '新娘'}
                    </h4>
                    <p className="text-xs text-white/80 mb-4">
                      {formatDate(formData.weddingDate)} {formData.weddingTime || '时间'}
                    </p>
                    <p className="text-xs text-white/60 line-clamp-2">
                      {formData.locationName || '地点名称'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">模板：</span>{currentTemplate?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
          <p>© 2026 婚礼请帖 · 用心制作</p>
        </div>
      </footer>
    </div>
  );
}
