'use client';

import Link from 'next/link';
import { TemplateConfig } from '@/types/template';

interface TemplateCardProps {
  template: TemplateConfig;
  variant?: 'default' | 'compact';
}

export function TemplateCard({ template, variant = 'default' }: TemplateCardProps) {
  const gradientStyle = {
    background: `linear-gradient(135deg, ${template.primaryColor} 0%, ${template.secondaryColor} 100%)`,
  };

  const usageCount = Math.floor(Math.random() * 50000) + 1000;

  if (variant === 'compact') {
    return (
      <Link href={`/pc/preview/${template.id}`}>
        <div className="group cursor-pointer">
          <div
            className="aspect-[4/5] rounded-xl overflow-hidden shadow-lg shadow-black/10 group-hover:shadow-xl group-hover:shadow-black/20 transition-all duration-300 transform group-hover:-translate-y-1"
            style={gradientStyle}
          >
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-white">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-center">{template.name}</h3>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/pc/preview/${template.id}`}>
      <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 transform hover:-translate-y-2">
        <div className="relative aspect-[4/3] overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
            style={gradientStyle}
          >
            <div className="w-full h-full flex flex-col items-center justify-center text-white p-6">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">{template.name}</h3>
              <p className="text-sm text-white/80 text-center hidden group-hover:block transition-all">
                {template.description}
              </p>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center gap-3">
              <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800 shadow-lg">
                👁️ 预览
              </span>
              <span className="px-4 py-2 bg-[#FF8C42] rounded-full text-sm font-medium text-white shadow-lg">
                ✨ 制作同款
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">{template.name}</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {usageCount.toLocaleString()} 人使用
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {template.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
