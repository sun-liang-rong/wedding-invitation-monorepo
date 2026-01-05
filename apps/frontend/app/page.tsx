'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader } from '@/components/ImageUploader';
import { GalleryUploader } from '@/components/GalleryUploader';
import { TemplateSelector } from '@/components/TemplateSelector';
import { TemplateId } from '@/types/template';

interface FormData {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  locationName: string;
  locationAddress: string;
  coverImage: string;
  galleryImages: string[];
  blessingText: string;
  templateId: TemplateId;
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    groomName: '',
    brideName: '',
    weddingDate: '',
    weddingTime: '',
    locationName: '',
    locationAddress: '',
    coverImage: '',
    galleryImages: [],
    blessingText: '',
    templateId: 'classic',
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50 pb-20">
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-rose-100">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-center text-rose-600">
            婚礼请帖制作
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100">
            <TemplateSelector
              value={formData.templateId}
              onChange={(templateId) => setFormData((prev) => ({ ...prev, templateId }))}
            />
          </section>

          <section className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-rose-400 rounded-full"></span>
              新人信息
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  新郎姓名
                </label>
                <input
                  type="text"
                  name="groomName"
                  value={formData.groomName}
                  onChange={handleChange}
                  required
                  placeholder="请输入新郎姓名"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  新娘姓名
                </label>
                <input
                  type="text"
                  name="brideName"
                  value={formData.brideName}
                  onChange={handleChange}
                  required
                  placeholder="请输入新娘姓名"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all bg-gray-50/50"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-rose-400 rounded-full"></span>
              婚礼时间
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  婚礼日期
                </label>
                <input
                  type="date"
                  name="weddingDate"
                  value={formData.weddingDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  婚礼时间
                </label>
                <input
                  type="time"
                  name="weddingTime"
                  value={formData.weddingTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all bg-gray-50/50"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-rose-400 rounded-full"></span>
              婚礼地点
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  地点名称
                </label>
                <input
                  type="text"
                  name="locationName"
                  value={formData.locationName}
                  onChange={handleChange}
                  required
                  placeholder="例如：某某酒店"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  详细地址
                </label>
                <input
                  type="text"
                  name="locationAddress"
                  value={formData.locationAddress}
                  onChange={handleChange}
                  required
                  placeholder="请输入详细地址"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all bg-gray-50/50"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-rose-400 rounded-full"></span>
              封面图片
            </h2>

            <ImageUploader
              value={formData.coverImage}
              onChange={(value) => setFormData((prev) => ({ ...prev, coverImage: value }))}
              placeholder="点击或拖拽上传封面图片"
            />
          </section>

          <section className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-rose-400 rounded-full"></span>
              相册展示
              <span className="text-sm font-normal text-gray-400">
                （最多6张）
              </span>
            </h2>

            <GalleryUploader
              value={formData.galleryImages}
              onChange={(value) => setFormData((prev) => ({ ...prev, galleryImages: value }))}
              maxCount={6}
            />
          </section>

          <section className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-rose-400 rounded-full"></span>
              祝福文案
            </h2>

            <div>
              <textarea
                name="blessingText"
                value={formData.blessingText}
                onChange={handleChange}
                required
                rows={3}
                placeholder="请输入底部祝福文案"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all bg-gray-50/50 resize-none"
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold rounded-2xl shadow-lg shadow-rose-200/50 hover:shadow-xl hover:shadow-rose-300/50 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                生成中...
              </span>
            ) : (
              '生成婚礼请帖'
            )}
          </button>
        </form>

        <footer className="mt-10 text-center text-sm text-gray-400">
          <p>填写信息后自动生成专属请帖链接</p>
        </footer>
      </main>
    </div>
  );
}
