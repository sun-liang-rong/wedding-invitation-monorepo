'use client';

import { WeddingProps } from "@/types";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import MusicPlayer from "../MusicPlayer";
import Image from "next/image";
import { MapPin, Heart, ChevronDown, Camera, Calendar, Navigation } from "lucide-react";
import { Great_Vibes, Montserrat, Noto_Serif_SC, Playfair_Display, Ma_Shan_Zheng } from "next/font/google";
import { useEffect, useRef, useState, useCallback } from "react";

const fontTitle = Playfair_Display({ subsets: ['latin'] });
const fontBody = Noto_Serif_SC({ subsets: ['latin'], weight: ['400', '700'] });
const fontModern = Montserrat({ subsets: ['latin'] });
const fontScript = Great_Vibes({ subsets: ['latin'], weight: ['400'] });
const fontCalligraphy = Ma_Shan_Zheng({ subsets: ['latin'], weight: ['400'] });

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  duration: number;
  delay: number;
  type: 'heart' | 'circle' | 'line';
}

const generateParticles = (count: number): FloatingParticle[] => {
  const types: ('heart' | 'circle' | 'line')[] = ['heart', 'circle', 'line'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 10,
    rotation: Math.random() * 360,
    duration: Math.random() * 20 + 20,
    delay: Math.random() * 5,
    type: types[Math.floor(Math.random() * types.length)],
  }));
};

const ParallaxImage: React.FC<{ src: string; alt: string; className?: string; speed?: number }> = ({
  src,
  alt,
  className = '',
  speed = 1,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  return (
    <motion.div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute inset-0">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </motion.div>
  );
};

const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const ClassicParallax: React.FC<WeddingProps> = (props) => {
  // 默认内容配置
  const defaultContent = {
    invitationText: [
      "执子之手，与子偕老",
      "琴瑟和鸣，鸾凤相依",
      "在这个美好的日子里",
      "我们诚挚邀请您见证我们的幸福时刻"
    ],
    guestThankYou: "感谢您一路以来的陪伴与支持，期待您的光临。"
  };
  
  // 合并用户内容和默认内容
  const finalContent = {
    ...defaultContent,
    ...props.content,
    invitationText: props.content?.invitationText || defaultContent.invitationText,
  };
  
  const { scrollYProgress } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  useEffect(() => {
    setParticles(generateParticles(25));
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / scrollHeight;
      setScrollProgress(Math.min(progress, 1));
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  const particleVariants = {
    animate: (p: FloatingParticle) => ({
      y: [p.y, p.y - 20, p.y],
      x: [p.x, p.x + (Math.random() - 0.5) * 10, p.x],
      rotate: [p.rotation, p.rotation + 30, p.rotation],
      transition: {
        duration: p.duration,
        delay: p.delay,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    }),
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const renderParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute opacity-25"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          custom={particle}
          variants={particleVariants}
          animate="animate"
        >
          {particle.type === 'heart' && (
            <Heart size={particle.size} className="text-rose-300" fill="currentColor" />
          )}
          {particle.type === 'circle' && (
            <div
              className="rounded-full bg-rose-200"
              style={{ width: particle.size, height: particle.size }}
            />
          )}
          {particle.type === 'line' && (
            <div
              className="h-px bg-rose-300"
              style={{ width: particle.size * 2, transform: `rotate(${particle.rotation}deg)` }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-gradient-to-b from-rose-50 via-stone-50 to-rose-100 ${fontBody.className} text-stone-800 pb-20`}
    >
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-rose-500 to-rose-300 z-50 origin-left"
        style={{ scaleX: scrollProgress }}
      />

      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {props.photos.length > 5 && (
          <motion.button
            onClick={() => setShowGallery(true)}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-rose-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
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
                className={`text-4xl text-white mb-8 ${fontCalligraphy.className}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                婚礼相册
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl w-full">
                {props.photos.map((src, index) => (
                  <motion.div
                    key={index}
                    className={`relative overflow-hidden rounded-xl shadow-xl ${
                      index % 4 === 0 ? 'col-span-2' : 'col-span-1'
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Image
                      src={src}
                      alt={`Photo ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MusicPlayer url={props.musicUrl} />

      <AnimatedSection className="relative h-screen overflow-hidden flex items-center justify-center">
        {renderParticles()}

        <motion.div style={{ scale, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <Image
            src={props.photos[0]}
            alt="Cover"
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        </motion.div>

        <motion.div
          style={{ y: textY }}
          className="relative z-10 text-white text-center space-y-8 p-4"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={itemVariants}
              className="tracking-[0.5em] text-sm uppercase"
            >
              Wedding Invitation
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className={`${fontScript.className} text-6xl md:text-8xl lg:text-9xl mt-4`}
            >
              {props.groomName}
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="flex justify-center my-4"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="text-rose-400 w-8 h-8 md:w-10 md:h-10" fill="currentColor" />
              </motion.div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className={`${fontScript.className} text-6xl md:text-8xl lg:text-9xl`}
            >
              {props.brideName}
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="mt-8 text-lg md:text-xl tracking-widest border-y border-white/40 py-3 px-8 inline-block backdrop-blur-sm bg-white/10 rounded-lg"
            >
              {props.weddingDate}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="flex flex-col items-center text-white/80">
            <span className="text-[10px] uppercase tracking-[0.3em] mb-2">滑动查看</span>
            <ChevronDown size={24} />
          </div>
        </motion.div>
      </AnimatedSection>

      <AnimatedSection className="max-w-4xl mx-auto px-6 py-24 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <h2 className={`text-4xl md:text-5xl font-bold text-stone-600 ${fontCalligraphy.className}`}>
              婚礼邀请
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-rose-200 mx-auto mt-4 rounded-full" />
          </motion.div>

          {/* 增强：使用配置的邀请文案，支持多段落 */}
          <div className="space-y-4 mt-8">
            {finalContent.invitationText.map((text, index) => (
              <motion.p 
                key={index}
                variants={itemVariants} 
                className="leading-loose text-lg text-stone-500"
              >
                {text}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </AnimatedSection>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {props.photos.slice(1, 5).map((src, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`relative aspect-[3/4] shadow-xl rounded-xl overflow-hidden ${
                  i % 2 === 0 ? 'md:translate-y-8' : ''
                }`}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Image
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatedSection className="max-w-2xl mx-auto px-6 py-20">
        <motion.div
          className="bg-white p-10 shadow-xl shadow-rose-100 border border-rose-50 rounded-2xl"
          whileHover={{ boxShadow: '0 25px 50px rgba(244, 114, 182, 0.15)' }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center">
              <Calendar size={28} className="text-white" />
            </div>
            <div className="w-px h-10 bg-rose-200" />
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center">
              <Navigation size={28} className="text-white" />
            </div>
          </div>

          <h3 className={`text-2xl font-bold text-stone-700 text-center mb-6 ${fontTitle.className}`}>
            婚礼详情
          </h3>

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-stone-500 mb-1">日期</p>
              <p className="text-xl font-medium text-stone-800">{props.weddingDate}</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-rose-400">
              <Heart size={16} fill="currentColor" />
            </div>

            <div className="text-center">
              <p className="text-sm text-stone-500 mb-1">地点</p>
              <p className="text-xl font-medium text-stone-800">{props.hotelName}</p>
              <p className="text-stone-500 mt-1">{props.hotelAddress}</p>
            </div>
          </div>
        </motion.div>
      </AnimatedSection>

      <section className="py-20 bg-gradient-to-b from-rose-100 to-stone-800 text-stone-300 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-2xl mx-auto px-6"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-6"
          >
            <Heart className="text-rose-400 w-10 h-10 mx-auto" fill="currentColor" />
          </motion.div>

          <h3 className={`text-4xl ${fontScript.className} text-white mb-4`}>
            Thank You
          </h3>
          
          {/* 增强：使用配置的感谢语 */}
          <p className="text-lg tracking-wide leading-relaxed px-4">
            {finalContent.guestThankYou}
          </p>

          <motion.p
            className="mt-12 text-sm text-stone-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            © {new Date().getFullYear()} {props.groomName} & {props.brideName}
          </motion.p>
        </motion.div>
      </section>
    </div>
  );
};

export default ClassicParallax;