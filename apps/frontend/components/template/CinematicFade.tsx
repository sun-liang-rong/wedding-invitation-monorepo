'use client';

import { WeddingProps } from "@/types";
import MusicPlayer from "../MusicPlayer";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, ChevronLeft, ChevronRight, Film, Volume2, VolumeX } from "lucide-react";

interface CinematicSlide {
  id: number;
  type: 'title' | 'date' | 'location' | 'photo';
  rotation?: number;
  scale?: number;
}

const CinematicFade: React.FC<WeddingProps> = (props) => {
  // 默认内容配置（电影感风格）
  const defaultContent = {
    coverStory: "在光影交错中，我们的故事缓缓展开。",
    storyText: [
      "每一帧都是我们的回忆",
      "每一刻都值得珍藏",
      "这是属于我们的电影"
    ],
    guestThankYou: "感谢您成为我们故事的见证者。"
  };
  
  // 合并用户内容和默认内容
  const finalContent = {
    ...defaultContent,
    ...props.content,
    storyText: props.content?.storyText || defaultContent.storyText,
  };
  
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number | null>(null);

  const slideCount = props.photos.length;

  const slides: CinematicSlide[] = props.photos.map((_, i) => ({
    id: i,
    type: i === 0 ? 'title' : i === 1 ? 'date' : i === 2 ? 'location' : 'photo',
    rotation: Math.random() * 2 - 1,
    scale: 1 + Math.random() * 0.1,
  }));

  const advanceSlide = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slideCount);
    setProgress(0);
  }, [slideCount]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + slideCount) % slideCount);
    setProgress(0);
  }, [slideCount]);

  const goToNext = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slideCount);
    setProgress(0);
  }, [slideCount]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2.5;
        if (newProgress >= 100) {
          advanceSlide();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, advanceSlide]);

  const containerVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 1.1,
      rotate: dir * 2,
      filter: 'blur(10px)',
    }),
    center: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 0.9,
      rotate: -dir * 2,
      filter: 'blur(10px)',
      transition: {
        duration: 1,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      filter: 'blur(10px)',
      transition: { duration: 0.5 },
    },
  };

  const progressVariants = {
    initial: { width: "0%" },
    animate: { width: "100%" },
  };

  const renderFilmGrain = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-20">
      <svg width="100%" height="100%">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );

  const renderVignette = () => (
    <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
  );

  const renderFilmStrip = () => (
    <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none z-10 opacity-20">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/50 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/50 to-transparent" />
    </div>
  );

  const renderControls = () => (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30">
      <motion.button
        onClick={goToPrev}
        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white border border-white/20"
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft size={20} />
      </motion.button>

      <motion.button
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white border border-white/20"
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </motion.button>

      <motion.button
        onClick={goToNext}
        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white border border-white/20"
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRight size={20} />
      </motion.button>

      <motion.button
        onClick={() => setIsMuted(!isMuted)}
        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 ml-4"
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
        whileTap={{ scale: 0.95 }}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </motion.button>
    </div>
  );

  const renderSlideIndicator = () => (
    <div className="absolute top-8 right-8 flex items-center gap-2 z-30">
      <Film size={16} className="text-white/60 mr-2" />
      {slides.map((_, i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 rounded-full cursor-pointer ${
            i === index ? 'bg-white' : 'bg-white/30'
          }`}
          onClick={() => {
            setDirection(i > index ? 1 : -1);
            setIndex(i);
            setProgress(0);
          }}
          whileHover={{ scale: 1.5 }}
          animate={{
            scale: i === index ? 1.2 : 1,
          }}
        />
      ))}
    </div>
  );

  return (
    <div ref={containerRef} className="h-screen w-full relative bg-black overflow-hidden">
      <MusicPlayer url={props.musicUrl} />

      {renderFilmGrain()}
      {renderVignette()}
      {renderFilmStrip()}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          custom={direction}
          variants={containerVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <Image
            src={props.photos[index]}
            alt={`Slide ${index + 1}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-32 left-10 right-10 z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${index}`}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {index === 0 && (
              <div className="text-center">
                <motion.div
                  className="inline-flex items-center gap-3 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/60" />
                  <span className="text-xs uppercase tracking-[0.4em] text-white/60">Wedding Invitation</span>
                  <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/60" />
                </motion.div>
                
                {/* 增强：添加封面故事 */}
                <motion.p
                  className="text-white/70 text-sm leading-relaxed mb-6 px-8 max-w-lg mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {finalContent.coverStory}
                </motion.p>
                
                <h1 className="text-5xl md:text-7xl font-serif text-white drop-shadow-lg">
                  {props.groomName}
                </h1>
                <div className="flex items-center justify-center gap-4 my-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-3xl text-rose-400">♥</span>
                  </motion.div>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif text-white drop-shadow-lg">
                  {props.brideName}
                </h1>
              </div>
            )}

            {index === 1 && (
              <div className="text-center">
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-6xl">📅</span>
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
                  Save The Date
                </h2>
                <p className="text-2xl md:text-3xl font-light tracking-widest text-white/90">
                  {props.weddingDate}
                </p>
              </div>
            )}

            {index === 2 && (
              <div className="text-center">
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-6xl">📍</span>
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-serif text-white mb-4">
                  婚礼地点
                </h2>
                <p className="text-xl md:text-2xl font-light tracking-wide text-white/90 italic">
                  "{props.hotelName}"
                </p>
                <p className="text-lg text-white/70 mt-2">
                  {props.hotelAddress}
                </p>
              </div>
            )}

            {index > 2 && (
              <div className="text-center">
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-6xl">💕</span>
                </motion.div>
                
                {/* 增强：使用配置的故事文案 */}
                <div className="space-y-3">
                  {finalContent.storyText.map((text, textIndex) => (
                    <motion.p
                      key={textIndex}
                      className="text-xl md:text-2xl font-light italic text-white/90"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + textIndex * 0.2 }}
                    >
                      "{text}"
                    </motion.p>
                  ))}
                </div>
                
                {/* 最后一张添加感谢语 */}
                {index === slideCount - 1 && (
                  <motion.p
                    className="text-base text-white/70 mt-6 px-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {finalContent.guestThankYou}
                  </motion.p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="w-full h-1 bg-white/20 mt-8 rounded-full overflow-hidden">
          <motion.div
            key={`progress-${index}`}
            initial={{ width: "0%" }}
            animate={{ width: isPlaying ? "100%" : "0%" }}
            transition={{
              duration: isPlaying ? 4 : 0,
              ease: "linear",
            }}
            className="h-full bg-gradient-to-r from-rose-400 via-rose-500 to-rose-300"
          />
        </div>
      </div>

      {renderControls()}
      {renderSlideIndicator()}

      <div className="absolute bottom-8 left-10 text-white/40 text-sm z-30">
        {index + 1} / {slideCount}
      </div>
    </div>
  );
};

export default CinematicFade;