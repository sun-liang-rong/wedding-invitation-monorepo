"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo, Variants, useSpring, useTransform } from "framer-motion";
import {
  Music,
  MapPin,
  Calendar,
  Heart,
  ChevronUp,
  ChevronDown,
  Share2,
  Download,
} from "lucide-react";
import { Playfair_Display, Noto_Serif_SC, Ma_Shan_Zheng } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const maShanZheng = Ma_Shan_Zheng({
  subsets: ["latin"],
  weight: ["400"],
});

interface WeddingCardProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime?: string;
  hotelName: string;
  hotelAddress: string;
  musicUrl: string;
  photos: string[];
  
  // 内容增强（可选）
  content?: {
    coverStory?: string;
    invitationText?: string[];
    weddingExpectation?: string;
    thankYouMessage?: string;
  };
  
  // 动画配置（可选）
  animation?: {
    disabled?: boolean;
    timing?: {
      stagger?: number;
      duration?: number;
    };
  };
  
  // 埋点回调（可选）
  onContentView?: (sectionId: string) => void;
  onAnimationComplete?: (animationId: string) => void;
}

const WeddingCard: React.FC<WeddingCardProps> = ({
  groomName,
  brideName,
  weddingDate,
  weddingTime = "12:08 PM",
  hotelName,
  hotelAddress,
  musicUrl,
  photos,
  content,
  animation,
  onContentView,
  onAnimationComplete,
}) => {
  // 默认内容配置
  const defaultContent = {
    coverStory: "在时光的长河中，我们相遇、相知、相爱。今天，我们将携手走进婚姻的殿堂，开启人生新的篇章。",
    invitationText: [
      "始于初见，止于终老",
      "在这温暖的日子里",
      "期待与您共度美好时光",
      "您的到来，是我们最大的幸福"
    ],
    weddingExpectation: "这一天，我们将在最爱的人面前，许下一生的誓言。",
    thankYouMessage: "感谢您一路以来的陪伴与支持，期待您的光临。"
  };
  
  // 合并用户内容和默认内容
  const finalContent = {
    ...defaultContent,
    ...content,
    invitationText: content?.invitationText || defaultContent.invitationText,
  };
  
  // 动画配置
  const animationConfig = {
    disabled: animation?.disabled || false,
    timing: {
      stagger: animation?.timing?.stagger || 200,
      duration: animation?.timing?.duration || 800,
    },
  };
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = 5;

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
    setCurrentIndex((prev) => {
      const nextIndex = (prev + 1) % totalSlides;
      // 埋点：记录页面切换
      onContentView?.(`slide-${nextIndex}`);
      return nextIndex;
    });
  }, [onContentView]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => {
      const nextIndex = (prev - 1 + totalSlides) % totalSlides;
      onContentView?.(`slide-${nextIndex}`);
      return nextIndex;
    });
  }, [onContentView]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlay) {
      interval = setInterval(() => {
        handleNext();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, currentIndex, handleNext]);

  const onDragStart = useCallback(() => {
    setIsAutoPlay(false);
    setIsDragging(true);
  }, []);

  const onDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    setDragProgress(0);
    
    const threshold = 80;
    if (info.offset.y < -threshold) {
      handleNext();
    } else if (info.offset.y > threshold) {
      handlePrev();
    }
  }, [handleNext, handlePrev]);

  const handleDrag = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const progress = Math.max(-1, Math.min(1, info.offset.y / 300));
    setDragProgress(progress);
  }, []);

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      y: dir > 0 ? "120%" : "-120%",
      opacity: 0,
      scale: 0.85,
      rotateX: dir > 0 ? -15 : 15,
      filter: "blur(10px)",
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        y: { type: "spring", stiffness: 200, damping: 25 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
        rotateX: { duration: 0.5 },
        filter: { duration: 0.3 },
      },
    },
    exit: (dir: number) => ({
      y: dir < 0 ? "120%" : "-120%",
      opacity: 0,
      scale: 0.85,
      rotateX: dir < 0 ? -15 : 15,
      filter: "blur(10px)",
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 1, 1],
      },
    }),
  };

  const containerVariants: Variants = {
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
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    },
  };

  const floatVariants: Variants = {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const pulseVariants: Variants = {
    pulse: {
      scale: [1, 1.08, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const galleryItemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        type: "spring",
        stiffness: 60,
      },
    }),
    hover: {
      scale: 1.05,
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const renderCoverSlide = () => (
    <div className="relative w-full h-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
      >
        <Image
          src={photos[0]}
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-stone-900/90" />
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
        }}
      />

      <motion.div
        className="absolute top-24 left-0 right-0 flex justify-center"
        variants={floatVariants}
        animate="float"
      >
        <motion.div
          className="w-20 h-20 border border-white/30 rounded-full flex items-center justify-center"
          variants={pulseVariants}
          animate="pulse"
        >
          <Heart className="w-8 h-8 text-rose-400 fill-rose-400" />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 p-8 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={itemVariants}
            className="text-xs tracking-[0.5em] uppercase text-rose-200 mb-6 text-center"
          >
            Wedding Invitation
          </motion.p>
          
          {/* 增强：添加封面故事 */}
          <motion.p
            variants={itemVariants}
            className={`${notoSerif.className} text-stone-100 text-sm leading-loose mb-8 px-8 text-center max-w-md mx-auto`}
          >
            {finalContent.coverStory}
          </motion.p>
          
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1
              className={`text-7xl ${playfair.className} leading-none text-white font-thin`}
            >
              {groomName}
              <motion.span
                className="inline-block mx-4 text-rose-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                &
              </motion.span>
              {brideName}
            </h1>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4"
          >
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-rose-400" />
            <span className={`text-lg tracking-[0.3em] ${notoSerif.className} text-stone-200`}>
              {weddingDate}
            </span>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-rose-400" />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-12 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-white/50"
            >
              <span className="text-xs tracking-widest">滑动探索</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute top-6 left-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className={`${maShanZheng.className} text-2xl text-white/80`}>
          囍
        </span>
      </motion.div>
    </div>
  );

  const renderInvitationSlide = () => (
    <div className="relative w-full h-full bg-[#faf8f5] flex flex-col items-center justify-center p-10 overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c4 4 4 10 0 14s-10 4-14 0-4-10 0-14 10-4 14 0z' fill='%23fcdfa6'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
        }}
        animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-sm"
      >
        <motion.div
          variants={itemVariants}
          className="relative mb-10"
        >
          <motion.div
            initial={{ rotate: -8, scale: 0.9 }}
            animate={{ rotate: -3, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative bg-white p-4 shadow-2xl rotate-[-3deg]"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
              {photos[1] && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >
                  <Image
                    src={photos[1]}
                    alt="Couple"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
            </div>
            <motion.div
              className={`absolute -bottom-8 -right-8 ${maShanZheng.className} text-4xl text-rose-400`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              喜
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center space-y-6">
          <div className="space-y-2">
            <motion.div
              className="h-[1px] w-20 bg-rose-300 mx-auto"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            />
          </div>

          <h2 className={`text-3xl ${playfair.className} text-stone-800 font-normal`}>
            诚邀您见证
          </h2>

          {/* 增强：使用配置的邀请文案，支持多段落 */}
          <div className={`${notoSerif.className} text-stone-600 leading-loose text-sm space-y-2`}>
            {finalContent.invitationText.map((text, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.8 + index * (animationConfig.timing.stagger / 1000),
                  duration: animationConfig.timing.duration / 1000 
                }}
              >
                {text}
              </motion.p>
            ))}
          </div>

          <motion.div
            className="pt-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Heart className="w-6 h-6 text-rose-400 mx-auto fill-rose-400" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="text-xs text-stone-400 tracking-widest">
          02 / {totalSlides}
        </span>
      </motion.div>
    </div>
  );

  const renderDetailSlide = () => (
    <div className="relative w-full h-full bg-stone-900 text-stone-100 flex flex-col overflow-hidden">
      <motion.div
        className="h-[45%] relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {photos[2] && (
          <motion.div
            className="w-full h-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={photos[2]}
              alt="Wedding Scene"
              fill
              className="object-cover opacity-80"
            />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/50 to-stone-900" />

        <motion.div
          className="absolute bottom-4 left-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className={`text-8xl ${playfair.className} opacity-20 font-thin`}>
            {weddingDate.split(' ')[0]}
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col justify-center px-8 py-6 relative"
      >
        <motion.div variants={itemVariants} className="space-y-8">
          {/* 增强：添加婚礼期待文案 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`${notoSerif.className} text-stone-300 text-sm leading-relaxed text-center px-4`}
          >
            {finalContent.weddingExpectation}
          </motion.p>
          
          <div className="flex items-start gap-5 group">
            <motion.div
              className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(244, 63, 94, 0.2)" }}
            >
              <Calendar className="w-6 h-6 text-rose-400" />
            </motion.div>
            <div className="flex-1">
              <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">
                日期 Date
              </p>
              <p className={`text-3xl ${playfair.className}`}>
                {weddingDate}
              </p>
              <p className="text-stone-400 mt-1">{weddingTime}</p>
            </div>
          </div>

          <div className="flex items-start gap-5 group">
            <motion.div
              className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(244, 63, 94, 0.2)" }}
            >
              <MapPin className="w-6 h-6 text-rose-400" />
            </motion.div>
            <div className="flex-1">
              <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">
                地点 Location
              </p>
              <p className={`text-2xl ${playfair.className}`}>
                {hotelName}
              </p>
              <p className="text-stone-400 mt-1 text-sm leading-relaxed">
                {hotelAddress}
              </p>
            </div>
          </div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-rose-500 to-rose-400 text-white text-sm font-medium uppercase tracking-widest rounded-sm shadow-lg shadow-rose-500/20"
          >
            查看地图
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-xs text-stone-500 tracking-widest">
          03 / {totalSlides}
        </span>
      </motion.div>
    </div>
  );

  const renderGallerySlide = () => (
    <div className="relative w-full h-full bg-stone-50 p-6 pt-16 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <p className="text-xs text-rose-400 tracking-[0.3em] uppercase mb-2">
            Our Moments
          </p>
          <h2 className={`text-4xl ${playfair.className} text-stone-800`}>
            美好瞬间
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 auto-rows-[140px]">
          {photos.slice(3, 7).map((photo, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={galleryItemVariants}
              whileHover="hover"
              className={`relative rounded-xl overflow-hidden shadow-lg cursor-pointer ${
                i === 0 ? "row-span-2" : ""
              }`}
            >
              <motion.div className="w-full h-full relative">
                <Image
                  src={photo}
                  alt={`Gallery ${i}`}
                  fill
                  className="object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300"
                  whileHover={{ opacity: 1 }}
                />
              </motion.div>
              <motion.div
                className="absolute bottom-3 left-3 text-white opacity-0 transition-opacity duration-300"
                whileHover={{ opacity: 1 }}
              >
                <span className="text-xs tracking-widest">Photo {i + 1}</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-0 right-0 flex justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-white shadow-lg text-stone-600"
        >
          <Share2 className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-white shadow-lg text-stone-600"
        >
          <Download className="w-5 h-5" />
        </motion.button>
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-xs text-stone-400 tracking-widest">
          04 / {totalSlides}
        </span>
      </motion.div>
    </div>
  );

  const renderEndSlide = () => (
    <div className="relative w-full h-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10 }}
      >
        <Image
          src={photos[0]}
          alt="End"
          fill
          className="object-cover blur-[2px] brightness-40"
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 flex flex-col items-center justify-center text-white p-8"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Heart className="w-20 h-20 text-rose-500 fill-rose-500 drop-shadow-lg" />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className={`text-5xl ${playfair.className} mb-4 font-light`}>
            Thank You
          </h2>
          {/* 增强：使用配置的感谢语 */}
          <p className={`text-lg tracking-wide ${notoSerif.className} text-stone-300 px-8 leading-relaxed`}>
            {finalContent.thankYouMessage}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="relative group cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative w-32 h-32 bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-rose-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-2 border-rose-200 rounded-lg flex items-center justify-center">
                <span className={`${maShanZheng.className} text-2xl text-rose-400`}>
                  扫码
                </span>
              </div>
            </div>
          </div>
          <motion.div
            className="absolute -bottom-10 left-0 right-0 text-center text-sm text-white/70 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            添加微信
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-10 left-0 right-0 flex justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className={`${maShanZheng.className} text-3xl text-rose-300/50`}>
          百年好合
        </span>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-xs text-stone-500 tracking-widest">
          05 / {totalSlides}
        </span>
      </motion.div>
    </div>
  );

  const renderContent = (index: number) => {
    switch (index) {
      case 0:
        return renderCoverSlide();
      case 1:
        return renderInvitationSlide();
      case 2:
        return renderDetailSlide();
      case 3:
        return renderGallerySlide();
      case 4:
        return renderEndSlide();
      default:
        return null;
    }
  };

  const dragY = useSpring(0, { stiffness: 300, damping: 30 });
  const dragOpacity = useTransform(dragY, [-200, 0, 200], [0.5, 1, 0.5]);
  const dragScale = useTransform(dragY, [-200, 0, 200], [0.95, 1, 0.95]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-stone-900 overflow-hidden touch-none"
    >
      <audio ref={audioRef} src={musicUrl} loop />

      <motion.div
        className="absolute top-0 left-0 right-0 z-50 flex gap-1.5 p-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <div
            key={idx}
            className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-rose-400 to-rose-300 rounded-full"
              initial={{ width: "0%" }}
              animate={{
                width:
                  idx === currentIndex
                    ? "100%"
                    : idx < currentIndex
                      ? "100%"
                      : "0%",
              }}
              transition={{
                duration: idx === currentIndex ? 5 : 0.3,
                ease: "linear",
              }}
            />
          </div>
        ))}
      </motion.div>

      <motion.button
        onClick={toggleMusic}
        className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-md shadow-lg overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <Music
            size={18}
            className={`text-white ${isPlaying ? "fill-white" : ""}`}
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 border-2 border-rose-400 rounded-full opacity-0"
          animate={
            isPlaying
              ? {
                  scale: [1, 1.5],
                  opacity: [0.5, 0],
                }
              : {}
          }
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.button>

      {currentIndex < totalSlides - 1 && (
        <motion.div
          className="absolute bottom-8 left-0 right-0 z-40 flex justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isDragging ? 0 : 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <motion.div
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronUp className="w-5 h-5 text-white/70" />
            </motion.div>
            <span className="text-xs text-white/50 tracking-widest">滑动</span>
          </motion.div>
        </motion.div>
      )}

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.15}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDrag={handleDrag}
          style={{
            y: isDragging ? dragY : 0,
            opacity: isDragging ? dragOpacity : 1,
            scale: isDragging ? dragScale : 1,
          }}
          className="absolute inset-0 w-full h-full bg-white shadow-2xl origin-top perspective-1000"
        >
          {renderContent(currentIndex)}

          {isDragging && (
            <motion.div
              className="absolute inset-0 bg-black/10 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: dragProgress !== 0 ? 0.3 : 0 }}
            >
              {dragProgress > 0 && (
                <div className="absolute inset-0 flex items-end justify-center pb-20">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg"
                  >
                    <ChevronDown className="w-6 h-6 text-stone-600" />
                  </motion.div>
                </div>
              )}
              {dragProgress < 0 && (
                <div className="absolute inset-0 flex items-start justify-center pt-20">
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg"
                  >
                    <ChevronUp className="w-6 h-6 text-stone-600" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WeddingCard;
