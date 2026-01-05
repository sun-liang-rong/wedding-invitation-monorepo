'use client';

import { useState } from 'react';
import { TemplateConfig, TEMPLATES, TemplateId } from '@/types/template';

interface TemplateSelectorProps {
  value: TemplateId;
  onChange: (templateId: TemplateId) => void;
}

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<TemplateId | null>(null);

  const getGradientColors = (template: TemplateConfig) => {
    return `linear-gradient(135deg, ${template.primaryColor} 0%, ${template.secondaryColor} 100%)`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-rose-400 rounded-full"></span>
        选择请帖模板
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {TEMPLATES.map((template) => (
          <div
            key={template.id}
            className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform ${
              value === template.id
                ? 'ring-4 ring-rose-400 scale-[1.02] shadow-xl'
                : 'ring-2 ring-transparent hover:ring-rose-200 hover:scale-[1.01] shadow-md'
            }`}
            onClick={() => onChange(template.id)}
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
          >
            <div
              className="aspect-[4/5] relative"
              style={{ background: getGradientColors(template) }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
                <div className="w-16 h-16 mb-3 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-center mb-1">{template.name}</h3>
                <p className="text-xs text-white/80 text-center hidden sm:block">{template.description}</p>
              </div>

              {value === template.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                <div className="flex flex-wrap gap-1">
                  {template.features.slice(0, 2).map((feature, index) => (
                    <span
                      key={index}
                      className="text-[10px] px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-white"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-rose-50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-rose-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-rose-700">已选择模板</p>
            <p className="text-sm text-rose-600 mt-1">
              {TEMPLATES.find(t => t.id === value)?.name} - {TEMPLATES.find(t => t.id === value)?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
