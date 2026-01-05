'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { TemplateId } from '@/types/template';

interface Invitation {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  locationName: string;
  locationAddress: string;
  coverImage: string;
  galleryImages: string[];
  blessingText: string;
  templateId: string;
  createdAt: string;
}

export default function InvitationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await fetch(`/api/invitations/${slug}`);
        const result = await response.json();

        if (result.success) {
          setInvitation(result.data);
        }
      } catch (error) {
        console.error('Error fetching invitation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400 mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-pink-50">
        <div className="text-center px-4">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">请帖不存在</h1>
          <p className="text-gray-500 mb-6">抱歉，您访问的婚礼请帖不存在或已被删除</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-rose-400 text-white rounded-full font-medium hover:bg-rose-500 transition-colors"
          >
            创建新的请帖
          </Link>
        </div>
      </div>
    );
  }

  const validGalleryImages = invitation.galleryImages.filter((url) => url && url.trim() !== '');
  const templateId = (invitation.templateId as TemplateId) || 'classic';

  const renderTemplate = () => {
    switch (templateId) {
      case 'classic':
        return <ClassicTemplate invitation={invitation} formatDate={formatDate} validGalleryImages={validGalleryImages} />;
      case 'romantic':
        return <RomanticTemplate invitation={invitation} formatDate={formatDate} validGalleryImages={validGalleryImages} />;
      case 'elegant':
        return <ElegantTemplate invitation={invitation} formatDate={formatDate} validGalleryImages={validGalleryImages} />;
      case 'modern':
        return <ModernTemplate invitation={invitation} formatDate={formatDate} validGalleryImages={validGalleryImages} />;
      case 'garden':
        return <GardenTemplate invitation={invitation} formatDate={formatDate} validGalleryImages={validGalleryImages} />;
      case 'fairy-tale':
        return <FairyTaleTemplate invitation={invitation} formatDate={formatDate} validGalleryImages={validGalleryImages} />;
      default:
        return <ClassicTemplate invitation={invitation} formatDate={formatDate} validGalleryImages={validGalleryImages} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50 pb-10">
      {renderTemplate()}

      <div className="max-w-md mx-auto px-4 mt-6 flex gap-3">
        <button
          onClick={handleCopyLink}
          className="flex-1 py-3 bg-white border border-rose-200 text-rose-600 font-medium rounded-xl shadow-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {copySuccess ? '已复制' : '复制链接'}
        </button>
        <Link
          href="/"
          className="flex-1 py-3 bg-rose-400 text-white font-medium rounded-xl shadow-sm hover:bg-rose-500 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          创建请帖
        </Link>
      </div>

      <footer className="mt-8 text-center text-sm text-gray-400">
        <p>祝福 {invitation.groomName} & {invitation.brideName} 新婚快乐！</p>
      </footer>
    </div>
  );
}

function ClassicTemplate({ invitation, formatDate, validGalleryImages }: { invitation: Invitation; formatDate: (date: string) => string; validGalleryImages: string[] }) {
  return (
    <>
      <div className="relative">
        <div
          className="h-[60vh] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_API_BASE}${invitation.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-4">
            <h1 className="text-4xl font-bold text-white text-center mb-2 drop-shadow-lg">
              {invitation.groomName} & {invitation.brideName}
            </h1>
            <p className="text-white/90 text-lg drop-shadow">婚礼邀请</p>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <section className="p-6 text-center border-b border-gray-100">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-rose-400">♥</span>
              <span className="text-gray-500 font-medium">诚邀您参加我们的婚礼</span>
              <span className="text-rose-400">♥</span>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">{invitation.groomName}</span>
                <span className="mx-2">与</span>
                <span className="font-semibold text-gray-800">{invitation.brideName}</span>
              </p>
            </div>
          </section>

          <section className="p-6 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">婚礼时间</h3>
                <p className="text-gray-600">{formatDate(invitation.weddingDate)}</p>
                <p className="text-gray-600">{invitation.weddingTime}</p>
              </div>
            </div>
          </section>

          <section className="p-6 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">婚礼地点</h3>
                <p className="text-gray-600 font-medium">{invitation.locationName}</p>
                <p className="text-gray-500 text-sm">{invitation.locationAddress}</p>
              </div>
            </div>
          </section>

          {validGalleryImages.length > 0 && (
            <section className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">婚礼相册</h3>
              <div className="grid grid-cols-2 gap-3">
                {validGalleryImages.slice(0, 6).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl overflow-hidden bg-gray-100"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE}${image}`}
                      alt={`婚礼相册 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="p-6 text-center">
            <p className="text-gray-500 italic">{invitation.blessingText}</p>
          </section>
        </div>
      </main>
    </>
  );
}

function RomanticTemplate({ invitation, formatDate, validGalleryImages }: { invitation: Invitation; formatDate: (date: string) => string; validGalleryImages: string[] }) {
  return (
    <>
      <div className="relative">
        <div
          className="h-[60vh] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_API_BASE}${invitation.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-pink-500/40 via-transparent to-purple-500/30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-4">
            <div className="text-center">
              <p className="text-white/90 text-lg mb-3 font-light tracking-wider">SAVE THE DATE</p>
              <h1 className="text-4xl font-light text-white text-center mb-2 drop-shadow-lg">
                <span className="font-semibold">{invitation.groomName}</span>
                <span className="mx-3">♥</span>
                <span className="font-semibold">{invitation.brideName}</span>
              </h1>
              <p className="text-white/80 text-sm mt-2">我们诚挚邀请您见证我们的幸福时刻</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden">
          <section className="p-6 text-center border-b border-pink-100">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-pink-400 text-2xl">💕</span>
            </div>
            <p className="text-gray-600 italic mb-3">亲爱的家人与朋友</p>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">{invitation.groomName}</span>
                <span className="mx-2 text-pink-400">与</span>
                <span className="font-medium">{invitation.brideName}</span>
              </p>
              <p className="text-pink-500 text-sm">即将开启人生新的篇章</p>
            </div>
          </section>

          <section className="p-6 border-b border-pink-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1 text-pink-600">婚礼时间</h3>
                <p className="text-gray-600">{formatDate(invitation.weddingDate)}</p>
                <p className="text-gray-600">{invitation.weddingTime}</p>
              </div>
            </div>
          </section>

          <section className="p-6 border-b border-pink-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1 text-pink-600">婚礼地点</h3>
                <p className="text-gray-600 font-medium">{invitation.locationName}</p>
                <p className="text-gray-500 text-sm">{invitation.locationAddress}</p>
              </div>
            </div>
          </section>

          {validGalleryImages.length > 0 && (
            <section className="p-6 border-b border-pink-100">
              <h3 className="font-medium text-gray-800 mb-4 text-pink-600 text-center">我们的回忆</h3>
              <div className="grid grid-cols-2 gap-3">
                {validGalleryImages.slice(0, 6).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-md"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE}${image}`}
                      alt={`婚礼相册 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="p-6 text-center bg-gradient-to-b from-transparent to-pink-50">
            <p className="text-pink-500 italic">{invitation.blessingText}</p>
          </section>
        </div>
      </main>
    </>
  );
}

function ElegantTemplate({ invitation, formatDate, validGalleryImages }: { invitation: Invitation; formatDate: (date: string) => string; validGalleryImages: string[] }) {
  return (
    <>
      <div className="relative bg-gray-900">
        <div
          className="h-[60vh] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_API_BASE}${invitation.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <div className="text-center">
              <p className="text-amber-400 text-sm tracking-[0.3em] mb-4 font-light">WEDDING INVITATION</p>
              <h1 className="text-4xl font-light text-white text-center mb-4">
                <span className="font-serif">{invitation.groomName}</span>
                <span className="text-amber-400 mx-4">•</span>
                <span className="font-serif">{invitation.brideName}</span>
              </h1>
              <div className="w-24 h-px bg-amber-400 mx-auto mt-6"></div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          <section className="p-6 text-center border-b border-gray-700">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span className="text-gray-400 font-light tracking-wider">诚邀您参加我们的婚礼</span>
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            </div>
            <div className="space-y-3">
              <p className="text-gray-300 font-light">
                <span className="text-white font-medium">{invitation.groomName}</span>
                <span className="mx-3 text-amber-400">&</span>
                <span className="text-white font-medium">{invitation.brideName}</span>
              </p>
            </div>
          </section>

          <section className="p-6 border-b border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-amber-400 mb-1">CEREMONY</h3>
                <p className="text-gray-300">{formatDate(invitation.weddingDate)}</p>
                <p className="text-gray-400">{invitation.weddingTime}</p>
              </div>
            </div>
          </section>

          <section className="p-6 border-b border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-amber-400 mb-1">VENUE</h3>
                <p className="text-gray-300 font-medium">{invitation.locationName}</p>
                <p className="text-gray-500 text-sm">{invitation.locationAddress}</p>
              </div>
            </div>
          </section>

          {validGalleryImages.length > 0 && (
            <section className="p-6 border-b border-gray-700">
              <h3 className="font-medium text-amber-400 mb-4 text-center tracking-wider">GALLERY</h3>
              <div className="grid grid-cols-2 gap-3">
                {validGalleryImages.slice(0, 6).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden bg-gray-700"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE}${image}`}
                      alt={`婚礼相册 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="p-6 text-center">
            <p className="text-gray-400 italic">{invitation.blessingText}</p>
          </section>
        </div>
      </main>
    </>
  );
}

function ModernTemplate({ invitation, formatDate, validGalleryImages }: { invitation: Invitation; formatDate: (date: string) => string; validGalleryImages: string[] }) {
  return (
    <>
      <div className="relative">
        <div
          className="h-[70vh] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_API_BASE}${invitation.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 via-transparent to-white"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-start pt-20 px-4">
            <h1 className="text-5xl font-bold text-gray-800 text-center mb-2">
              {invitation.groomName}
            </h1>
            <h1 className="text-5xl font-bold text-gray-800 text-center mb-4">
              &
            </h1>
            <h1 className="text-5xl font-bold text-gray-800 text-center">
              {invitation.brideName}
            </h1>
            <p className="text-gray-500 text-lg mt-4 tracking-widest">WEDDING</p>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <section className="p-6 text-center border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <p className="text-gray-600 mb-2">诚邀您参加</p>
            <p className="text-2xl font-light text-gray-800">我们的婚礼庆典</p>
          </section>

          <section className="p-6 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">日期</h3>
                <p className="text-gray-600">{formatDate(invitation.weddingDate)}</p>
                <p className="text-gray-600">{invitation.weddingTime}</p>
              </div>
            </div>
          </section>

          <section className="p-6 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">地点</h3>
                <p className="text-gray-600 font-medium">{invitation.locationName}</p>
                <p className="text-gray-500 text-sm">{invitation.locationAddress}</p>
              </div>
            </div>
          </section>

          {validGalleryImages.length > 0 && (
            <section className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">相册</h3>
              <div className="grid grid-cols-2 gap-3">
                {validGalleryImages.slice(0, 6).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl overflow-hidden bg-gray-100"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE}${image}`}
                      alt={`婚礼相册 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="p-6 text-center">
            <p className="text-gray-500">{invitation.blessingText}</p>
          </section>
        </div>
      </main>
    </>
  );
}

function GardenTemplate({ invitation, formatDate, validGalleryImages }: { invitation: Invitation; formatDate: (date: string) => string; validGalleryImages: string[] }) {
  return (
    <>
      <div className="relative">
        <div
          className="h-[60vh] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_API_BASE}${invitation.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/30 via-transparent to-green-700/30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-4">
            <div className="text-center text-white">
              <div className="text-4xl mb-2">🌿</div>
              <h1 className="text-4xl font-light text-white text-center mb-2 drop-shadow-lg">
                {invitation.groomName} <span className="font-semibold">♥</span> {invitation.brideName}
              </h1>
              <p className="text-white/90 text-lg">在自然中见证我们的爱情</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border-2 border-green-100">
          <section className="p-6 text-center border-b border-green-100 bg-gradient-to-b from-green-50 to-transparent">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-green-500 text-xl">🌸</span>
              <span className="text-green-600 font-medium">诚邀您见证我们的幸福时刻</span>
              <span className="text-green-500 text-xl">🌸</span>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium text-green-700">{invitation.groomName}</span>
                <span className="mx-2 text-green-400">与</span>
                <span className="font-medium text-green-700">{invitation.brideName}</span>
              </p>
            </div>
          </section>

          <section className="p-6 border-b border-green-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-700 mb-1">婚礼时间</h3>
                <p className="text-gray-600">{formatDate(invitation.weddingDate)}</p>
                <p className="text-gray-600">{invitation.weddingTime}</p>
              </div>
            </div>
          </section>

          <section className="p-6 border-b border-green-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-700 mb-1">婚礼地点</h3>
                <p className="text-gray-600 font-medium">{invitation.locationName}</p>
                <p className="text-gray-500 text-sm">{invitation.locationAddress}</p>
              </div>
            </div>
          </section>

          {validGalleryImages.length > 0 && (
            <section className="p-6 border-b border-green-100">
              <h3 className="font-semibold text-green-700 mb-4">婚礼相册</h3>
              <div className="grid grid-cols-2 gap-3">
                {validGalleryImages.slice(0, 6).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-md"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE}${image}`}
                      alt={`婚礼相册 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="p-6 text-center bg-gradient-to-b from-transparent to-green-50">
            <p className="text-green-600 italic">{invitation.blessingText}</p>
          </section>
        </div>
      </main>
    </>
  );
}

function FairyTaleTemplate({ invitation, formatDate, validGalleryImages }: { invitation: Invitation; formatDate: (date: string) => string; validGalleryImages: string[] }) {
  return (
    <>
      <div className="relative">
        <div
          className="h-[60vh] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_API_BASE}${invitation.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-purple-500/20 to-purple-900/40"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-4">
            <div className="text-center">
              <div className="flex justify-center gap-2 mb-3 text-2xl">
                <span>✨</span>
                <span className="text-purple-200">💒</span>
                <span>✨</span>
              </div>
              <h1 className="text-4xl font-light text-white text-center mb-2 drop-shadow-lg">
                {invitation.groomName} <span className="font-semibold text-purple-200">♥</span> {invitation.brideName}
              </h1>
              <p className="text-purple-100 text-lg">从此happily ever after</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-100">
          <section className="p-6 text-center border-b border-purple-100 bg-gradient-to-b from-purple-50 to-transparent">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-purple-400">🦄</span>
              <span className="text-purple-600 font-medium">童话般的浪漫爱情故事</span>
              <span className="text-purple-400">🦄</span>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium text-purple-700">{invitation.groomName}</span>
                <span className="mx-2 text-purple-300">与</span>
                <span className="font-medium text-purple-700">{invitation.brideName}</span>
              </p>
              <p className="text-purple-500 text-sm">邀请您见证我们的幸福时刻</p>
            </div>
          </section>

          <section className="p-6 border-b border-purple-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-purple-700 mb-1">魔法时刻</h3>
                <p className="text-gray-600">{formatDate(invitation.weddingDate)}</p>
                <p className="text-gray-600">{invitation.weddingTime}</p>
              </div>
            </div>
          </section>

          <section className="p-6 border-b border-purple-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-purple-700 mb-1">梦幻场地</h3>
                <p className="text-gray-600 font-medium">{invitation.locationName}</p>
                <p className="text-gray-500 text-sm">{invitation.locationAddress}</p>
              </div>
            </div>
          </section>

          {validGalleryImages.length > 0 && (
            <section className="p-6 border-b border-purple-100">
              <h3 className="font-semibold text-purple-700 mb-4">王子与公主的回忆</h3>
              <div className="grid grid-cols-2 gap-3">
                {validGalleryImages.slice(0, 6).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-lg"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE}${image}`}
                      alt={`婚礼相册 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="p-6 text-center bg-gradient-to-b from-transparent to-purple-50">
            <p className="text-purple-500 italic">{invitation.blessingText}</p>
          </section>
        </div>
      </main>
    </>
  );
}
