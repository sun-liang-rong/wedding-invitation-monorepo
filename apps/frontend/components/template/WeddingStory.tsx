'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, Variants, useInView } from 'framer-motion';
import { MapPin, Calendar, Clock, Heart, ChevronDown, Share2, Gift } from 'lucide-react';
import { Playfair_Display, Montserrat, Ma_Shan_Zheng } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '700', '900'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });
const maShanZheng = Ma_Shan_Zheng({ subsets: ['latin'], weight: ['400'] });

interface WeddingStoryProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  hotelAddress: string;
  hotelName: string;
  mainPhoto: string;
  secondaryPhoto?: string;
  
  // 内容增强（可选）
  content?: {
    coverStory?: string;
    loveStory?: {
      meeting?: string[];
      dating?: string[];
      proposal?: string[];
    };
    weddingExpectation?: string;
    guestThankYou?: string;
  };
  
  // 埋点回调（可选）
  onContentView?: (sectionId: string) => void;
  onScrollProgress?: (progress: number) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 60, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 60, damping: 18 }
  }
};

const imageRevealVariants: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 1.2, ease: [0.65, 0, 0.35, 1] }
  }
};

const floatVariants: Variants = {
  float: {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const decorativeCircleVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 30,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const HeartParticle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute text-rose-400/30"
    style={{ left: `${Math.random() * 100}%` }}
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: -100, opacity: 1 }}
    transition={{
      duration: 8 + Math.random() * 4,
      repeat: Infinity,
      delay: delay,
      ease: "linear",
    }}
  >
    <Heart className="w-3 h-3 fill-rose-400/30" />
  </motion.div>
);

const FloatingParticle = ({ index }: { index: number }) => {
  const size = Math.random() * 6 + 2;
  const left = Math.random() * 100;
  const duration = Math.random() * 10 + 10;
  
  return (
    <motion.div
      className="absolute rounded-full bg-white/20"
      style={{
        width: size,
        height: size,
        left: `${left}%`,
      }}
      animate={{
        y: [0, -200, 0],
        x: [0, Math.random() * 50 - 25, 0],
        opacity: [0, 0.6, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.5,
      }}
    />
  );
};

const CoverSection: React.FC<{ 
  mainPhoto: string; 
  groomName: string; 
  brideName: string; 
  weddingDate: string;
  coverStory: string;
}> = ({
  mainPhoto,
  groomName,
  brideName,
  weddingDate,
  coverStory,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <section ref={ref} className="h-screen w-full snap-start relative overflow-hidden flex items-center justify-center">
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          scale: isInView ? 1 : 1.1,
        }}
        transition={{ duration: 1.5 }}
      >
        <Image src={mainPhoto} alt="Cover" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-stone-900/80" />
      </motion.div>

      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c4 4 4 10 0 14s-10 4-14 0-4-10 0-14 10-4 14 0z' fill='%23ffffff'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
        }}
        animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="relative z-10 text-center px-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div
            className="w-24 h-24 mx-auto border border-white/30 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Heart className="w-10 h-10 text-rose-400 fill-rose-400" />
          </motion.div>
        </motion.div>

        <motion.p variants={itemVariants} className="uppercase tracking-[0.5em] text-sm mb-8 text-rose-200">
          Wedding Invitation
        </motion.p>
        
        {/* 增强：添加封面故事 */}
        <motion.p 
          variants={itemVariants}
          className={`${montserrat.className} text-stone-100 text-sm leading-loose mb-8 px-8 max-w-2xl mx-auto`}
        >
          {coverStory}
        </motion.p>

        <motion.div variants={itemVariants} className={`mb-8 ${playfair.className}`}>
          <h1 className="text-6xl md:text-8xl font-thin text-white leading-none">
            {groomName}
            <motion.span
              className="inline-block mx-4 text-rose-400"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
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
          <span className={`${montserrat.className} text-lg tracking-[0.3em] text-stone-200`}>
            {weddingDate}
          </span>
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-rose-400" />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-6 left-6 z-20"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className={`${maShanZheng.className} text-3xl text-white/80`}>
          囍
        </span>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-0 right-0 flex justify-center z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-widest text-white/50">滑动探索</span>
          <ChevronDown className="w-5 h-5 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};

const InvitationSection: React.FC<{ 
  weddingDate: string; 
  weddingTime: string;
  weddingExpectation: string;
}> = ({
  weddingDate,
  weddingTime,
  weddingExpectation,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <section ref={ref} className="h-screen w-full snap-start relative flex flex-col items-center justify-center bg-[#faf8f5] p-8 overflow-hidden">
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 opacity-5"
        variants={decorativeCircleVariants}
        animate="animate"
        style={{
          background: `radial-gradient(circle, rgba(244,63,94,0.3) 0%, transparent 70%)`,
          borderRadius: '50%',
        }}
      />

      <motion.div
        className="absolute bottom-0 left-0 w-64 h-64 opacity-5"
        variants={decorativeCircleVariants}
        animate="animate"
        style={{
          background: `radial-gradient(circle, rgba(244,63,94,0.3) 0%, transparent 70%)`,
          borderRadius: '50%',
        }}
      />

      <motion.div
        className="max-w-lg w-full space-y-10 z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-xs tracking-[0.4em] text-rose-400 uppercase mb-4">
            Save The Date
          </p>
          <h2 className={`text-4xl md:text-5xl ${playfair.className} text-stone-800 font-normal`}>
            诚邀您的见证
          </h2>
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <motion.div
            className="absolute -inset-4 bg-gradient-to-r from-rose-200 to-rose-100 rounded-xl opacity-50 blur-lg"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="relative bg-white p-8 rounded-xl shadow-xl">
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-stone-100">
              <motion.div
                className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(244, 63, 94, 0.1)" }}
              >
                <Calendar className="w-8 h-8 text-rose-500" />
              </motion.div>
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">日期</p>
                <p className={`text-2xl ${playfair.className} text-stone-800`}>{weddingDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <motion.div
                className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(244, 63, 94, 0.1)" }}
              >
                <Clock className="w-8 h-8 text-rose-500" />
              </motion.div>
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">时间</p>
                <p className={`text-2xl ${playfair.className} text-stone-800`}>{weddingTime}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center">
          <p className={`${montserrat.className} text-stone-500 italic leading-loose text-sm px-4`}>
            {weddingExpectation}
          </p>
          <motion.div
            className="mt-6 flex justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Heart className="w-6 h-6 text-rose-400 fill-rose-400" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-xs tracking-widest text-stone-400">02 / 04</span>
      </motion.div>
    </section>
  );
};

// 新增：爱情故事段落组件
const LoveStorySection: React.FC<{ 
  loveStory: {
    meeting?: string[];
    dating?: string[];
    proposal?: string[];
  }
}> = ({ loveStory }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  const storyParts = [
    { title: '初遇', icon: '💫', paragraphs: loveStory.meeting || [] },
    { title: '相恋', icon: '💕', paragraphs: loveStory.dating || [] },
    { title: '承诺', icon: '💍', paragraphs: loveStory.proposal || [] },
  ].filter(part => part.paragraphs.length > 0);

  if (storyParts.length === 0) return null;

  return (
    <section ref={ref} className="min-h-screen w-full snap-start relative flex flex-col items-center justify-center bg-gradient-to-b from-stone-50 to-rose-50 p-8 overflow-hidden">
      <motion.div
        className="max-w-3xl w-full space-y-16 z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] text-rose-400 uppercase mb-4">
            Our Love Story
          </p>
          <h2 className={`text-4xl md:text-5xl ${playfair.className} text-stone-800 font-normal`}>
            我们的故事
          </h2>
        </motion.div>

        {storyParts.map((part, partIndex) => (
          <motion.div
            key={partIndex}
            variants={itemVariants}
            className="relative"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                className="text-4xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: partIndex * 0.5 }}
              >
                {part.icon}
              </motion.div>
              <h3 className={`text-2xl ${playfair.className} text-stone-700`}>
                {part.title}
              </h3>
            </div>

            <div className="space-y-4 pl-16">
              {part.paragraphs.map((paragraph, pIndex) => (
                <motion.p
                  key={pIndex}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: pIndex * 0.2, duration: 0.8 }}
                  viewport={{ once: false }}
                  className={`${montserrat.className} text-stone-600 leading-relaxed text-sm md:text-base`}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {partIndex < storyParts.length - 1 && (
              <motion.div
                className="w-px h-12 bg-gradient-to-b from-rose-300 to-transparent mx-auto mt-8"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: false }}
              />
            )}
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-xs tracking-widest text-stone-400">Our Story</span>
      </motion.div>
    </section>
  );
};

const LocationSection: React.FC<{ secondaryPhoto: string | undefined; hotelName: string; hotelAddress: string }> = ({
  secondaryPhoto,
  hotelName,
  hotelAddress,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <section ref={ref} className="h-screen w-full snap-start relative flex flex-col md:flex-row overflow-hidden">
      <motion.div
        className="h-1/2 md:h-full md:w-1/2 relative overflow-hidden"
        initial={{ x: "-100%", opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: false }}
      >
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          {secondaryPhoto ? (
            <Image src={secondaryPhoto} alt="Hotel" fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-stone-300 flex items-center justify-center">
              <span className="text-stone-500">No Photo</span>
            </div>
          )}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/30 to-transparent" />
        
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c4 4 4 10 0 14s-10 4-14 0-4-10 0-14 10-4 14 0z' fill='%23ffffff'/%3E%3C/svg%3E")`,
          }}
          animate={{ backgroundPosition: ['0px 0px', '60px 60px'] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      <motion.div
        className="h-1/2 md:h-full md:w-1/2 bg-gradient-to-br from-rose-50 to-stone-100 flex items-center justify-center p-8"
        initial={{ x: "100%", opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: false }}
      >
        <motion.div
          className="text-center space-y-8 max-w-sm"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          <motion.div variants={itemVariants}>
            <motion.div
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-6"
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <MapPin className="w-10 h-10 text-rose-500" />
            </motion.div>
            <h3 className={`text-3xl ${playfair.className} text-stone-800`}>
              Wedding Venue
            </h3>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <p className={`text-2xl ${playfair.className} text-stone-700`}>
              {hotelName}
            </p>
            <div className="w-16 h-[1px] bg-rose-300 mx-auto" />
            <p className="text-stone-500 leading-relaxed px-4">
              {hotelAddress}
            </p>
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-4 bg-stone-800 text-white text-sm tracking-widest uppercase rounded-sm shadow-lg hover:bg-stone-700 transition-colors"
          >
            查看地图
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 right-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-xs tracking-widest text-stone-400">03 / 04</span>
      </motion.div>
    </section>
  );
};

const EndSection: React.FC<{ guestThankYou: string }> = ({ guestThankYou }) => {
  return (
    <section className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-rose-950">
        {[...Array(5)].map((_, i) => (
          <FloatingParticle key={i} index={i} />
        ))}
        {[...Array(8)].map((_, i) => (
          <HeartParticle key={i} delay={i * 1.5} />
        ))}
      </div>

      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        className="text-center z-10 px-6 space-y-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        <motion.div variants={itemVariants} className="relative inline-block">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 3, -3, 0],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Heart className="w-16 h-16 text-rose-400 fill-rose-400 mx-auto" />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className={`text-5xl md:text-6xl ${playfair.className} text-white font-light`}>
            Thank You
          </h2>
          <p className={`${montserrat.className} text-lg tracking-wide text-stone-300 mt-4 px-8 leading-relaxed max-w-2xl mx-auto`}>
            {guestThankYou}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm"
          >
            <Share2 className="w-4 h-4" />
            分享请帖
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-rose-500/20 backdrop-blur-sm rounded-full text-rose-200 text-sm border border-rose-500/30"
          >
            <Gift className="w-4 h-4" />
            送祝福
          </motion.button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center gap-4 pt-4"
        >
          <div className="h-[1px] w-12 bg-white/30" />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          </motion.div>
          <div className="h-[1px] w-12 bg-white/30" />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-10 left-0 right-0 flex justify-center"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className={`${maShanZheng.className} text-4xl text-rose-300/30`}>
          百年好合
        </span>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-xs tracking-widest text-stone-500">04 / 04</span>
      </motion.div>
    </section>
  );
};

const WeddingStory: React.FC<WeddingStoryProps> = ({
  groomName,
  brideName,
  weddingDate,
  weddingTime,
  hotelAddress,
  hotelName,
  mainPhoto,
  secondaryPhoto,
  content,
  onContentView,
  onScrollProgress,
}) => {
  // 默认内容配置
  const defaultContent = {
    coverStory: "在时光的长河中，我们相遇、相知、相爱。今天，我们将携手走进婚姻的殿堂。",
    loveStory: {
      meeting: [
        "那是一个平凡的午后，阳光透过咖啡馆的玻璃窗洒在你的脸上。",
        "我端着咖啡走过，不小心撞到了你的肩膀。",
        "你抬起头，我们的目光在空中交汇，那一刻，时间仿佛静止了。"
      ],
      dating: [
        "从那以后，我们开始了无数次的约会。",
        "一起看过的电影，走过的街道，吃过的餐厅，都成为了我们共同的回忆。",
        "每一次相处，都让我更加确定，你就是我要找的那个人。"
      ],
      proposal: [
        "在那个星空璀璨的夜晚，我单膝跪地，向你许下了一生的承诺。",
        "你含着泪水点头的那一刻，是我人生中最幸福的时刻。"
      ]
    },
    weddingExpectation: "现在，我们即将步入婚姻的殿堂。在这个特别的日子里，我们希望与最亲爱的家人和朋友分享这份喜悦。",
    guestThankYou: "感谢您一路以来的陪伴与支持。在我们人生的重要时刻，能有您的见证，是我们莫大的幸福。"
  };
  
  // 合并用户内容和默认内容
  const finalContent = {
    ...defaultContent,
    ...content,
    loveStory: {
      ...defaultContent.loveStory,
      ...content?.loveStory,
    },
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const progress = scrollTop / scrollHeight;
      setScrollProgress(progress);
      
      // 埋点：记录滚动进度
      onScrollProgress?.(progress);
      
      // 根据滚动位置触发内容查看埋点
      if (progress > 0.25 && progress < 0.35) {
        onContentView?.('invitation-section');
      } else if (progress > 0.5 && progress < 0.6) {
        onContentView?.('location-section');
      } else if (progress > 0.75) {
        onContentView?.('end-section');
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [onContentView, onScrollProgress]);

  return (
    <div ref={containerRef} className={`h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-stone-900 ${montserrat.className}`}>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-rose-300 z-50 origin-left"
        style={{ scaleX: scrollProgress }}
      />

      <CoverSection 
        mainPhoto={mainPhoto} 
        groomName={groomName} 
        brideName={brideName} 
        weddingDate={weddingDate}
        coverStory={finalContent.coverStory}
      />
      <InvitationSection 
        weddingDate={weddingDate} 
        weddingTime={weddingTime}
        weddingExpectation={finalContent.weddingExpectation}
      />
      <LoveStorySection loveStory={finalContent.loveStory} />
      <LocationSection 
        secondaryPhoto={secondaryPhoto} 
        hotelName={hotelName} 
        hotelAddress={hotelAddress} 
      />
      <EndSection guestThankYou={finalContent.guestThankYou} />
    </div>
  );
};

export default WeddingStory;
