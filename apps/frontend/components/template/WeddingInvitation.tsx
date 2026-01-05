'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { Variants, motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Heart, Music, PauseCircle, PlayCircle, ChevronDown, Send, MessageCircle, Camera, MapPin as MapPinIcon } from 'lucide-react';
import { Noto_Serif_SC, Great_Vibes, Playfair_Display, Ma_Shan_Zheng } from 'next/font/google';

const notoSerif = Noto_Serif_SC({ subsets: ['latin'], weight: ['400', '700'] });
const greatVibes = Great_Vibes({ subsets: ['latin'], weight: ['400'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });
const maShanZheng = Ma_Shan_Zheng({ subsets: ['latin'], weight: ['400'] });

interface WeddingInvitationProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  hotelAddress: string;
  hotelName: string;
  mainPhoto: string;
  secondaryPhoto?: string;
  galleryPhotos?: string[];
  
  // 内容增强（可选）
  content?: {
    coverStory?: string;
    invitationText?: string[];
    guestThankYou?: string;
  };
  
  // 埋点回调（可选）
  onContentView?: (sectionId: string) => void;
  onScrollProgress?: (progress: number) => void;
}

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  duration: number;
  delay: number;
  type: 'heart' | 'flower' | 'star';
}

const generateFloatingElements = (count: number): FloatingElement[] => {
  const types: ('heart' | 'flower' | 'star')[] = ['heart', 'flower', 'star'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    scale: Math.random() * 0.5 + 0.5,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
    type: types[Math.floor(Math.random() * types.length)],
  }));
};

const Section: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const PhotoCard: React.FC<{ src: string; alt: string; index: number }> = ({ src, alt, index }) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl shadow-xl ${
        index % 3 === 0 ? 'col-span-2' : 'col-span-1'
      } ${index % 2 === 0 ? 'md:translate-y-8' : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

const WeddingInvitation: React.FC<WeddingInvitationProps> = ({
  groomName,
  brideName,
  weddingDate,
  hotelAddress,
  hotelName,
  mainPhoto,
  secondaryPhoto,
  galleryPhotos = [],
  content,
  onContentView,
  onScrollProgress,
}) => {
  // 默认内容配置
  const defaultContent = {
    coverStory: "在时光的长河中，我们相遇、相知、相爱。今天，我们将携手走进婚姻的殿堂。",
    invitationText: [
      "执子之手，与子偕老",
      "琴瑟和鸣，鸾凤相依",
      "在这美好的日子里",
      "我们诚挚邀请您见证我们的幸福时刻",
      "分享我们的喜悦与感动"
    ],
    guestThankYou: "感谢您一路以来的陪伴与支持，期待您的光临。"
  };
  
  // 合并用户内容和默认内容
  const finalContent = {
    ...defaultContent,
    ...content,
    invitationText: content?.invitationText || defaultContent.invitationText,
  };
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const scrollRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const yText = useTransform(scrollYProgress, [0, 0.5], ['0%', '50%']);
  const opacityBg = useTransform(scrollYProgress, [0, 0.3], [1, 0.5]);

  useEffect(() => {
    setFloatingElements(generateFloatingElements(20));
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / scrollHeight;
      setScrollProgress(Math.min(progress, 1));
      
      // 埋点：记录滚动进度
      onScrollProgress?.(progress);
      
      // 根据滚动位置触发内容查看埋点
      if (progress > 0.25 && progress < 0.35) {
        onContentView?.('invitation-section');
      } else if (progress > 0.5 && progress < 0.6) {
        onContentView?.('photo-section');
      } else if (progress > 0.75) {
        onContentView?.('thank-you-section');
      }
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, [onContentView, onScrollProgress]);

  useEffect(() => {
    const scrollStep = () => {
      if (window.innerHeight + window.scrollY < document.body.offsetHeight - 100) {
        window.scrollBy({ top: 1, behavior: 'auto' });
        scrollRef.current = requestAnimationFrame(scrollStep);
      } else {
        setIsAutoScrolling(false);
      }
    };

    if (isAutoScrolling) {
      scrollRef.current = requestAnimationFrame(scrollStep);
    }

    return () => {
      if (scrollRef.current) cancelAnimationFrame(scrollRef.current);
    };
  }, [isAutoScrolling]);

  const stopAutoScroll = useCallback(() => {
    setIsAutoScrolling(false);
    if (scrollRef.current) cancelAnimationFrame(scrollRef.current);
  }, []);

  const toggleAutoScroll = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAutoScrolling((prev) => !prev);
  }, []);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const floatingVariants = {
    animate: (i: FloatingElement) => ({
      y: [0, -30, 0],
      x: [0, Math.random() * 20 - 10, 0],
      rotate: [i.rotation, i.rotation + 15, i.rotation],
      transition: {
        duration: i.duration,
        delay: i.delay,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }),
  };

  const renderFloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {floatingElements.map((element, i) => (
        <motion.div
          key={element.id}
          className="absolute opacity-20"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          custom={element}
          variants={floatingVariants}
          animate="animate"
        >
          {element.type === 'heart' && (
            <Heart size={16 + element.scale * 16} className="text-rose-300" fill="currentColor" />
          )}
          {element.type === 'flower' && (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-200 to-rose-400 opacity-50" />
          )}
          {element.type === 'star' && (
            <div className="w-4 h-4 bg-white rounded-full" style={{ transform: `rotate(${element.rotation}deg)` }} />
          )}
        </motion.div>
      ))}
    </div>
  );

  const renderScrollIndicator = () => (
    <motion.div
      className="fixed left-0 top-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-rose-500 to-rose-300 z-50 origin-left"
      style={{ scaleX: scrollProgress }}
    />
  );

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-gradient-to-b from-rose-50 via-stone-50 to-rose-100 text-stone-800 overflow-hidden ${notoSerif.className}`}
      onTouchStart={stopAutoScroll}
      onWheel={stopAutoScroll}
      onClick={stopAutoScroll}
    >
      {renderScrollIndicator()}

      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <motion.button
          onClick={toggleAutoScroll}
          className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-rose-500 hover:bg-white transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {isAutoScrolling ? <PauseCircle size={24} /> : <PlayCircle size={24} />}
        </motion.button>

        {galleryPhotos.length > 0 && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setShowGallery(true);
            }}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-rose-500 hover:bg-white transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Camera size={24} />
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 overflow-y-auto"
            onClick={() => setShowGallery(false)}
          >
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
              <motion.button
                className="absolute top-4 right-4 p-3 text-white/80 hover:text-white"
                onClick={() => setShowGallery(false)}
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-2xl">×</span>
              </motion.button>

              <motion.h2
                className={`text-4xl text-white mb-8 ${maShanZheng.className}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                甜蜜回忆
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl w-full">
                {galleryPhotos.map((photo, index) => (
                  <PhotoCard key={index} src={photo} alt={`Photo ${index + 1}`} index={index} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Section className="relative h-screen flex items-center justify-center overflow-hidden">
        {renderFloatingElements()}

        <motion.div style={{ y: yBg, opacity: opacityBg }} className="absolute inset-0 z-0">
          <Image
            src={mainPhoto}
            alt="Wedding Couple"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        </motion.div>

        <motion.div
          style={{ y: yText }}
          className="relative z-10 text-center text-white px-4"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center gap-6"
          >
            <motion.p
              variants={itemVariants}
              className="tracking-[0.6em] text-sm uppercase mb-4"
            >
              Wedding Invitation
            </motion.p>

            <motion.div
              variants={itemVariants}
              className={`text-5xl md:text-7xl lg:text-8xl ${greatVibes.className} flex flex-col md:flex-row items-center gap-4 md:gap-8`}
            >
              <span className="drop-shadow-lg">{groomName}</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="text-rose-400 w-10 h-10 md:w-12 md:h-12 drop-shadow-lg" fill="currentColor" />
              </motion.div>
              <span className="drop-shadow-lg">{brideName}</span>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-8 text-lg md:text-xl font-light tracking-widest border-t border-b border-white/40 py-3 px-8 backdrop-blur-sm bg-white/10 rounded-lg"
            >
              {weddingDate}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="flex flex-col items-center text-white/80">
            <span className="text-[10px] uppercase tracking-[0.3em] mb-2">滑动探索</span>
            <ChevronDown size={24} />
          </div>
        </motion.div>
      </Section>

      <Section className="py-24 px-6 md:px-20 bg-gradient-to-b from-rose-50 to-white relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center space-y-10"
        >
          <motion.div variants={itemVariants}>
            <h2 className={`text-4xl md:text-5xl font-bold text-stone-700 ${maShanZheng.className}`}>
              婚礼邀请
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-rose-200 mx-auto mt-4 rounded-full" />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-lg leading-loose text-stone-600 space-y-2"
          >
            {/* 增强：使用配置的邀请文案，支持多段落 */}
            {finalContent.invitationText.map((text, index) => (
              <motion.span
                key={index}
                className="block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                {text}
                {index < finalContent.invitationText.length - 1 && <br />}
              </motion.span>
            ))}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-2 gap-6 mt-12"
          >
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-lg shadow-rose-100 border border-rose-50 flex items-center gap-5"
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(244, 114, 182, 0.15)' }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-200">
                <Calendar size={28} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-stone-500 mb-1">日期</p>
                <p className={`text-xl font-bold text-stone-800 ${playfair.className}`}>{weddingDate}</p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-2xl shadow-lg shadow-rose-100 border border-rose-50 flex items-center gap-5"
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(244, 114, 182, 0.15)' }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-200">
                <MapPinIcon size={28} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-stone-500 mb-1">地点</p>
                <p className={`text-xl font-bold text-stone-800 ${playfair.className}`}>{hotelName}</p>
                <p className="text-sm text-stone-500 mt-1">{hotelAddress}</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </Section>

      {secondaryPhoto && (
        <Section className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden">
          <motion.div
            initial={{ scale: 1.2 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full relative"
          >
            <Image
              src={secondaryPhoto}
              alt="Sweet Moment"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20">
              <p className={`text-2xl text-white ${greatVibes.className}`}>Sweet Moments</p>
            </div>
          </motion.div>
        </Section>
      )}

      <Section className="py-20 bg-gradient-to-b from-white to-rose-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible">
            <motion.div variants={itemVariants} className="mb-12">
              <h3 className={`text-4xl md:text-5xl ${maShanZheng.className} text-stone-700`}>
                温馨提示
              </h3>
              <p className="text-stone-500 mt-4">期待您的到来，请准时赴约</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl p-8 md:p-10 shadow-xl shadow-rose-100 border border-rose-50"
            >
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">📅</span>
                  </div>
                  <p className="font-medium text-stone-700">准时赴约</p>
                  <p className="text-sm text-stone-500 mt-1">请准时参加婚礼仪式</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">👔</span>
                  </div>
                  <p className="font-medium text-stone-700">着装建议</p>
                  <p className="text-sm text-stone-500 mt-1">请着正装或礼服参加</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">🎁</span>
                  </div>
                  <p className="font-medium text-stone-700">祝福方式</p>
                  <p className="text-sm text-stone-500 mt-1">您的祝福是我们最好的礼物</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Section>

      <section className="py-24 bg-gradient-to-b from-rose-100 to-stone-800 text-stone-300 relative overflow-hidden">
        {renderFloatingElements()}

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-2xl mx-auto text-center px-6 relative z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-8"
          >
            <Heart size={48} className="text-rose-400 mx-auto" fill="currentColor" />
          </motion.div>

          <h3 className={`text-4xl md:text-5xl text-white mb-6 ${greatVibes.className}`}>
            Thank You
          </h3>
          {/* 增强：使用配置的感谢语 */}
          <p className={`text-xl tracking-wide mb-12 ${notoSerif.className} leading-relaxed px-4`}>
            {finalContent.guestThankYou}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="bg-gradient-to-r from-rose-500 to-rose-400 text-white py-4 px-10 rounded-full shadow-xl shadow-rose-500/30 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(244, 114, 182, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Send size={18} />
              <span className={`${playfair.className}`}>确认出席</span>
            </motion.button>

            <motion.button
              className="bg-white/10 backdrop-blur-md text-white border border-white/30 py-4 px-10 rounded-full flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle size={18} />
              <span className={`${playfair.className}`}>发送祝福</span>
            </motion.button>
          </div>

          <motion.p
            className="mt-12 text-sm text-stone-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            © {new Date().getFullYear()} {groomName} & {brideName}
          </motion.p>
        </motion.div>
      </section>
    </div>
  );
};

export default WeddingInvitation;