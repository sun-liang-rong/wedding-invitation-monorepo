import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTemplateById, TEMPLATES } from '@/types/template';

interface PreviewPageProps {
  params: Promise<{ templateId: string }>;
}

export async function generateStaticParams() {
  return TEMPLATES.map((template) => ({
    templateId: template.id,
  }));
}

export async function generateMetadata({ params }: PreviewPageProps) {
  const resolvedParams = await params;
  const template = getTemplateById(resolvedParams.templateId as any);
  
  if (!template) {
    return {
      title: '模板预览',
    };
  }
  
  return {
    title: `${template.name} - 模板预览`,
    description: template.description,
  };
}

export default async function TemplatePreviewPage({ params }: PreviewPageProps) {
  const resolvedParams = await params;
  const template = getTemplateById(resolvedParams.templateId as any);
  
  if (!template) {
    notFound();
  }
  
  const gradientStyle = {
    background: `linear-gradient(135deg, ${template.primaryColor} 0%, ${template.secondaryColor} 100%)`,
  };
  
  const relatedTemplates = TEMPLATES.filter((t) => t.id !== template.id).slice(0, 4);
  
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
                <Link href="/pc/create" className="text-gray-600 hover:text-[#FF8C42] transition-colors">制作请帖</Link>
              </nav>
              
              <Link
                href={`/pc/create?template=${template.id}`}
                className="px-6 py-2.5 bg-[#FF8C42] text-white font-medium rounded-full hover:bg-[#E67328] transition-colors shadow-lg shadow-[#FF8C42]/30"
              >
                ✨ 制作同款
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <Link href="/pc" className="hover:text-[#FF8C42]">首页</Link>
          <span>/</span>
          <Link href="/pc" className="hover:text-[#FF8C42]">模板中心</Link>
          <span>/</span>
          <span className="text-gray-800">{template.name}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-[4/3] relative" style={gradientStyle}>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{template.name}</h2>
                  <p className="text-white/80 text-center max-w-md">{template.description}</p>
                </div>
                
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                  📱 移动端预览
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white text-sm font-medium border-2 border-white">王</div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-medium border-2 border-white">公</div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">王子 & 公主</p>
                      <p className="text-sm text-gray-500">2026年1月18日 11:30</p>
                    </div>
                  </div>
                  
                  <Link
                    href={`/pc/create?template=${template.id}`}
                    className="px-6 py-3 bg-[#FF8C42] text-white font-medium rounded-full hover:bg-[#E67328] transition-colors shadow-lg shadow-[#FF8C42]/30"
                  >
                    ✨ 制作同款
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">模板详情</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">模板名称</p>
                  <p className="font-medium text-gray-800">{template.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">模板说明</p>
                  <p className="text-gray-600 text-sm">{template.description}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">模板特点</p>
                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">主题配色</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full shadow-md"
                      style={{ backgroundColor: template.primaryColor }}
                      title="主色"
                    />
                    <span className="text-gray-400">→</span>
                    <div
                      className="w-10 h-10 rounded-full shadow-md"
                      style={{ backgroundColor: template.secondaryColor }}
                      title="辅色"
                    />
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">使用人数</p>
                  <p className="text-gray-800 font-medium">{(Math.floor(Math.random() * 50000) + 1000).toLocaleString()} 人使用</p>
                </div>
              </div>
              
              <Link
                href={`/pc/create?template=${template.id}`}
                className="w-full py-4 bg-[#FF8C42] text-white font-semibold rounded-full hover:bg-[#E67328] transition-colors shadow-lg shadow-[#FF8C42]/30 flex items-center justify-center gap-2"
              >
                <span>✨</span>
                <span>制作同款</span>
              </Link>
              
              <p className="text-xs text-gray-400 text-center mt-4">
                免费使用 · 随时修改 · 快速生成
              </p>
            </div>
          </div>
        </div>

        {relatedTemplates.length > 0 && (
          <section className="mt-16">
            <h3 className="text-xl font-bold text-gray-800 mb-6">其他推荐模板</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTemplates.map((t) => (
                <Link key={t.id} href={`/pc/preview/${t.id}`}>
                  <div className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div
                      className="aspect-[4/3]"
                      style={{
                        background: `linear-gradient(135deg, ${t.primaryColor} 0%, ${t.secondaryColor} 100%)`,
                      }}
                    >
                      <div className="w-full h-full flex flex-col items-center justify-center text-white p-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                          </svg>
                        </div>
                        <h4 className="font-medium text-center">{t.name}</h4>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-800">{t.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
          <p>© 2026 婚礼请帖 · 用心制作</p>
        </div>
      </footer>
    </div>
  );
}
