'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform, PanInfo } from 'framer-motion';
import { Music, MapPin, Calendar, Heart, ChevronUp, Image as ImageIcon, X, ZoomIn, Play, Pause, Heart as HeartIcon } from 'lucide-react';
import { Noto_Serif_SC, Playfair_Display, Ma_Shan_Zheng } from 'next/font/google';

const notoSerif = Noto_Serif_SC({ subsets: ['latin'], weight: ['400', '700'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });
const maShanZheng = Ma_Shan_Zheng({ subsets: ['latin'], weight: ['400'] });

interface WeddingH5Props {
  groomName: string;
  brideName: string;
  weddingDate: string;
  hotelName: string;
  hotelAddress: string;
  musicUrl: string;
  coverPhoto: string;
  galleryPhotos: string[];
  
  // 内容增强（可选）
  content?: {
    coverStory?: string;
    invitationText?: string[];
    weddingExpectation?: string;
    thankYouMessage?: string;
  };
  
  // 埋点回调（可选）
  onContentView?: (sectionId: string) => void;
  onSlideChange?: (slideIndex: number) => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const particleColors = ['#fb7185', '#fda4af', '#fecdd3', '#fff1f2', '#ffe4e6'];

const generateParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
    color: particleColors[Math.floor(Math.random() * particleColors.length)],
  }));
};

const WeddingH5: React.FC<WeddingH5Props> = ({
  groomName,
  brideName,
  weddingDate,
  hotelName,
  hotelAddress,
  musicUrl,
  coverPhoto,
  galleryPhotos,
  content,
  onContentView,
  onSlideChange,
}) => {
  // 默认内容配置
  const defaultContent = {
    coverStory: "在时光的长河中，我们相遇、相知、相爱。今天，我们将携手走进婚姻的殿堂。",
    invitationText: [
      "执子之手，与子偕老",
      "我们将在这个特别的日子里",
      "携手开启人生的新篇章",
      "诚邀您见证我们的幸福时刻"
    ],
    weddingExpectation: "期待与您共度这美好的一天，分享我们的喜悦与幸福。",
    thankYouMessage: "感谢您一路以来的陪伴与支持，期待您的光临。"
  };
  
  // 合并用户内容和默认内容
  const finalContent = {
    ...defaultContent,
    ...content,
    invitationText: content?.invitationText || defaultContent.invitationText,
  };
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [direction, setDirection] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const touchStartY = useRef<number>(0);

  const totalSlides = 4;

  useEffect(() => {
    setParticles(generateParticles(30));
  }, []);

  useEffect(() => {
    const weddingDateObj = new Date(weddingDate.replace(/\//g, '-'));
    const now = new Date();
    const diff = weddingDateObj.getTime() - now.getTime();

    if (diff > 0) {
      const updateCountdown = () => {
        const remaining = weddingDateObj.getTime() - new Date().getTime();
        setCountdown({
          days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
          hours: Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((remaining % (1000 * 60)) / 1000),
        });
      };

      updateCountdown();
      const timer = setInterval(updateCountdown, 1000);
      return () => clearInterval(timer);
    }
  }, [weddingDate]);

  const toggleMusic = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);
  const handleNext = useCallback(() => {
    setDirection(1);
    const nextIndex = (currentSlide + 1) % totalSlides;
    setCurrentSlide(nextIndex);
    setIsAutoPlay(true);
    // 埋点：记录页面切换
    onSlideChange?.(nextIndex);
    onContentView?.(`slide-${nextIndex}`);
  }, [currentSlide, onSlideChange, onContentView]);
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay, currentSlide]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlay(true);
  }, []);

  const handleSlideClick = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setIsAutoPlay(true);
  }, [currentSlide]);

  const onDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsAutoPlay(false);
    const threshold = 50;
    if (info.offset.y < -threshold) {
      handleNext();
    } else if (info.offset.y > threshold) {
      handlePrev();
    }
  }, [handleNext, handlePrev]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 1.1,
      rotate: dir > 0 ? 5 : -5,
      filter: 'blur(10px)',
    }),
    center: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 0.9,
      rotate: dir < 0 ? 5 : -5,
      filter: 'blur(10px)',
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  };

  const contentVariants = {
    initial: { y: 60, opacity: 0, scale: 0.95 },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  const heartVariants = {
    initial: { scale: 0 },
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const particleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: (i: Particle) => ({
      opacity: [0, 0.6, 0],
      scale: [0, 1, 0],
      y: [0, -100],
      x: [0, Math.random() * 50 - 25],
      transition: {
        duration: i.duration,
        delay: i.delay,
        repeat: Infinity,
        ease: 'linear',
      },
    }),
  };

  const renderCountdown = () => (
    <div className="flex justify-center gap-4 mt-6">
      {[
        { value: countdown.days, label: '天' },
        { value: countdown.hours, label: '时' },
        { value: countdown.minutes, label: '分' },
        { value: countdown.seconds, label: '秒' },
      ].map((item, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center"
          variants={itemVariants}
        >
          <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 min-w-[60px]">
            <span className={`text-2xl font-bold ${playfair.className}`}>
              {String(item.value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-xs mt-1 opacity-80">{item.label}</span>
        </motion.div>
      ))}
    </div>
  );

  const renderLightbox = () => (
    <AnimatePresence>
      {lightboxOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>

          <motion.button
            className="absolute left-4 p-3 text-white/80 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
            }}
          >
            <ChevronUp size={32} className="rotate-[-90deg]" />
          </motion.button>

          <motion.div
            key={lightboxIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="relative w-[90vw] max-w-4xl h-[70vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryPhotos[lightboxIndex]}
              alt={`Gallery ${lightboxIndex + 1}`}
              fill
              className="object-contain"
            />
          </motion.div>

          <motion.button
            className="absolute right-4 p-3 text-white/80 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev + 1) % galleryPhotos.length);
            }}
          >
            <ChevronUp size={32} className="rotate-[90deg]" />
          </motion.button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60">
            {lightboxIndex + 1} / {galleryPhotos.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderFloatingHearts = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${15 + i * 10}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: i * 0.2 }}
        >
          <HeartIcon
            size={16 + (i % 3) * 8}
            className="text-rose-400/30"
            fill="currentColor"
          />
        </motion.div>
      ))}
    </div>
  );

  const renderSlideContent = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center text-white text-center z-10 p-6">
            {renderFloatingHearts()}

            <motion.div
              variants={contentVariants}
              initial="initial"
              animate="animate"
              className="border-2 border-white/30 p-8 md:p-12 backdrop-blur-sm bg-black/20 rounded-2xl"
            >
              <motion.p
                variants={itemVariants}
                className={`tracking-[0.5em] text-sm uppercase mb-6 ${notoSerif.className}`}
              >
                Wedding Invitation
              </motion.p>
              
              {/* 增强：添加封面故事 */}
              <motion.p
                variants={itemVariants}
                className={`${notoSerif.className} text-white/90 text-sm leading-loose mb-6 px-4 max-w-md mx-auto`}
              >
                {finalContent.coverStory}
              </motion.p>

              <motion.h1
                variants={itemVariants}
                className={`text-5xl md:text-7xl mb-8 ${maShanZheng.className} drop-shadow-xl`}
              >
                {groomName} <span className="text-rose-300">&</span> {brideName}
              </motion.h1>

              <motion.div
                variants={itemVariants}
                className="w-16 h-[1px] bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto mb-6"
              />

              <motion.p
                variants={itemVariants}
                className={`text-lg tracking-widest ${notoSerif.className}`}
              >
                {weddingDate}
              </motion.p>

              {countdown.days > 0 && renderCountdown()}
            </motion.div>

            <motion.div
              variants={heartVariants}
              initial="initial"
              animate="animate"
              className="absolute bottom-20"
            >
              <Heart size={24} className="text-rose-300 animate-pulse" fill="currentColor" />
            </motion.div>
          </div>
        );

      case 1:
        return (
          <div className="relative w-full h-full flex flex-col justify-end pb-24 px-8 text-white z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <motion.div
              variants={contentVariants}
              initial="initial"
              animate="animate"
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="relative">
                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-rose-300 rounded-full" />
                <h2 className={`text-4xl font-bold ${maShanZheng.className} pl-6 text-rose-100`}>
                  婚礼邀请
                </h2>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className={`${notoSerif.className} leading-loose text-white/90 text-lg space-y-2`}
              >
                {/* 增强：使用配置的邀请文案 */}
                {finalContent.invitationText.map((text, index) => (
                  <motion.span
                    key={index}
                    className="block"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                  >
                    {text}
                    {index < finalContent.invitationText.length - 1 && <br />}
                  </motion.span>
                ))}
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 gap-6 pt-4"
              >
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-xl p-4">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center">
                    <Calendar size={24} className="text-rose-300" />
                  </div>
                  <div>
                    <p className="text-sm opacity-70">日期</p>
                    <p className={`text-xl ${playfair.className}`}>{weddingDate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-xl p-4">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-rose-300" />
                  </div>
                  <div>
                    <p className="text-sm opacity-70">地点</p>
                    <p className={`text-xl ${playfair.className}`}>{hotelName}</p>
                    <p className="text-sm opacity-70 mt-1">{hotelAddress}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        );

      case 2:
        return (
          <div className="relative w-full h-full z-10 flex flex-col pt-16 px-4 bg-gradient-to-b from-black/60 to-transparent">
            <motion.div
              variants={contentVariants}
              initial="initial"
              animate="animate"
              className="text-center text-white mb-6"
            >
              <motion.h2
                variants={itemVariants}
                className={`text-3xl ${playfair.className} flex items-center justify-center gap-3`}
              >
                <HeartIcon size={28} className="text-rose-400" fill="currentColor" />
                甜蜜瞬间
                <HeartIcon size={28} className="text-rose-400" fill="currentColor" />
              </motion.h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 gap-3 h-[65vh] overflow-y-auto pb-20"
              initial="initial"
              animate="animate"
              variants={{
                animate: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {galleryPhotos.map((photo, idx) => (
                <motion.div
                  key={idx}
                  className={`relative rounded-xl overflow-hidden shadow-xl cursor-pointer group ${
                    idx % 4 === 0 ? 'col-span-2 md:col-span-2 h-56' : 'h-40'
                  } ${idx % 3 === 0 ? 'md:row-span-2 md:h-auto' : ''}`}
                  variants={{
                    initial: { opacity: 0, y: 30, scale: 0.9 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                  }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  onClick={() => openLightbox(idx)}
                >
                  <Image
                    src={photo}
                    alt={`Gallery ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <ZoomIn
                      size={32}
                      className="text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        );

      case 3:
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center text-white z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
            {renderFloatingHearts()}

            <motion.div
              variants={contentVariants}
              initial="initial"
              animate="animate"
              className="text-center px-8"
            >
              <motion.div
                variants={itemVariants}
                className="mb-8 relative"
              >
                <motion.div
                  className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-rose-500/30 to-rose-300/10 backdrop-blur-md flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <motion.div
                    variants={heartVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <HeartIcon size={48} className="text-rose-400" fill="currentColor" />
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className={`text-4xl md:text-5xl mb-6 ${maShanZheng.className}`}
              >
                感谢您的祝福
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className={`text-xl tracking-widest mb-4 ${notoSerif.className}`}
              >
                Thank You
              </motion.p>
              
              {/* 增强：添加感谢语 */}
              <motion.p
                variants={itemVariants}
                className={`${notoSerif.className} text-white/80 text-base leading-relaxed mb-12 px-8 max-w-lg mx-auto`}
              >
                {finalContent.thankYouMessage}
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  className="bg-gradient-to-r from-rose-500 to-rose-400 text-white py-4 px-10 rounded-full shadow-xl shadow-rose-500/30"
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(244, 114, 182, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={`${playfair.className} text-lg`}>参加婚礼</span>
                </motion.button>

                <motion.button
                  className="bg-white/10 backdrop-blur-md text-white border border-white/30 py-4 px-10 rounded-full"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={`${playfair.className} text-lg`}>发送祝福</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-stone-900"
      onTouchStart={(e) => {
        touchStartY.current = e.touches[0].clientY;
      }}
      onTouchEnd={(e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY.current - touchEndY;
        if (Math.abs(diff) > 50) {
          if (diff > 0) handleNext();
          else handlePrev();
        }
      }}
    >
      {renderLightbox()}

      <audio ref={audioRef} src={musicUrl} loop />

      <motion.div
        className="fixed top-6 right-6 z-50"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          className={`w-12 h-12 rounded-full flex items-center justify-center border backdrop-blur-md transition-all ${
            isPlaying
              ? 'bg-white/20 border-white/30 text-white'
              : 'bg-rose-500/80 border-rose-400 text-white'
          }`}
          onClick={toggleMusic}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <Pause size={20} />
          ) : (
            <Play size={20} className="ml-1" />
          )}
        </motion.button>
      </motion.div>

      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
            }}
            variants={particleVariants}
            initial="initial"
            animate="animate"
            custom={particle}
          />
        ))}
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 w-full h-full"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.7}
          onDragEnd={onDragEnd}
        >
          {currentSlide === 0 && (
            <Image src={coverPhoto} alt="Cover" fill className="object-cover" priority />
          )}
          {currentSlide === 1 && galleryPhotos[0] && (
            <Image src={galleryPhotos[0]} alt="Intro" fill className="object-cover" />
          )}
          {currentSlide === 2 && (
            <div className="relative w-full h-full">
              <Image
                src={galleryPhotos[1] || galleryPhotos[0]}
                alt="Bg"
                fill
                className="object-cover blur-sm brightness-50"
              />
            </div>
          )}
          {currentSlide === 3 && (
            <Image src={coverPhoto} alt="End" fill className="object-cover brightness-50" />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

          {renderSlideContent(currentSlide)}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-24 left-0 right-0 z-40 flex justify-center gap-3">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => handleSlideClick(idx)}
            className={`relative h-2 rounded-full transition-all duration-500 ${
              currentSlide === idx ? 'w-10 bg-rose-400' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {currentSlide === idx && (
              <motion.div
                className="absolute inset-0 rounded-full bg-rose-300"
                layoutId="activeIndicator"
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center text-white/60">
          <span className="text-[10px] uppercase tracking-widest mb-1">
            {currentSlide < totalSlides - 1 ? '滑动探索' : '感谢观看'}
          </span>
          <ChevronUp size={20} />
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default WeddingH5;