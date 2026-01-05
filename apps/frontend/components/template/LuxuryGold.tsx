'use client'
import { WeddingProps } from "@/types";
import MusicPlayer from "../MusicPlayer";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useMemo } from "react";
import { Great_Vibes, Montserrat, Noto_Serif_SC, Playfair_Display } from "next/font/google";

const fontTitle = Playfair_Display({ subsets: ['latin'] });
const fontBody = Noto_Serif_SC({ subsets: ['latin'], weight: ['400', '700'] });
const fontModern = Montserrat({ subsets: ['latin'] });
const fontScript = Great_Vibes({ subsets: ['latin'], weight: ['400'] });

interface GoldenParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const LuxuryGold: React.FC<WeddingProps> = (props) => {
  // 默认内容配置（奢华风格）
  const defaultContent = {
    coverStory: "在璀璨的时光中，我们相遇。今天，我们将在最尊贵的时刻，许下永恒的誓言。",
    invitationText: [
      "诚挚邀请您莅临",
      "见证我们的荣耀时刻",
      "分享这份尊贵的喜悦"
    ],
    guestThankYou: "感谢您的光临，您的到来使这一刻更加璀璨。"
  };
  
  // 合并用户内容和默认内容
  const finalContent = {
    ...defaultContent,
    ...props.content,
    invitationText: props.content?.invitationText || defaultContent.invitationText,
  };
  
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const { scrollYProgress: headerScroll } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const headerOpacity = useTransform(headerScroll, [0, 0.5], [1, 0]);
  const headerScale = useTransform(headerScroll, [0, 0.5], [1, 0.9]);
  const headerY = useTransform(headerScroll, [0, 0.5], [0, -50]);

  const goldenParticles: GoldenParticle[] = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
  }, []);

  const floatingElements = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      size: Math.random() * 60 + 40,
      duration: Math.random() * 20 + 15,
    }));
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 100, rotateX: -15, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const shineVariants = {
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const glowVariants = {
    initial: { boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" },
    hover: {
      boxShadow: "0 0 40px rgba(212, 175, 55, 0.6), 0 0 60px rgba(212, 175, 55, 0.4)",
      transition: { duration: 0.3 },
    },
  };

  const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
      <motion.div
        ref={ref}
        variants={cardVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-gradient-to-br from-black via-stone-900 to-[#1a1a1a] text-[#d4af37] ${fontTitle.className} selection:bg-[#d4af37] selection:text-black overflow-x-hidden`}
    >
      <MusicPlayer url={props.musicUrl} />

      <motion.div
        className="fixed left-0 top-0 h-1 bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] z-50 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      <div className="fixed inset-0 pointer-events-none opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="gold-pattern" patternUnits="userSpaceOnUse" width="100" height="100">
              <circle cx="50" cy="50" r="1" fill="#d4af37" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gold-pattern)" />
        </svg>
      </div>

      {goldenParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed w-1 h-1 bg-[#d4af37] rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <header
        ref={headerRef}
        style={{ opacity: headerOpacity, y: headerY, scale: headerScale }}
        className="h-screen flex flex-col items-center justify-center text-center p-6 relative"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative mb-8"
        >
          <motion.div
            className="w-64 h-64 border border-[#d4af37]/30 rounded-full flex items-center justify-center relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-[2px] border-[#d4af37] rounded-full opacity-30 animate-pulse"></div>
            <div className="w-56 h-56 rounded-full overflow-hidden relative border-2 border-[#d4af37]/50">
              <Image src={props.photos[0]} alt="Avatar" fill className="object-cover" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* 增强：添加封面故事 */}
          <motion.p
            className="text-[#d4af37]/80 text-sm leading-relaxed mb-6 px-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {finalContent.coverStory}
          </motion.p>
          
          <h1 className="text-5xl md:text-7xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] drop-shadow-lg">
            {props.groomName} & {props.brideName}
          </h1>
          <motion.p
            className="tracking-[0.5em] text-sm text-[#d4af37]/80 mt-4 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Royal Invitation
          </motion.p>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-[#d4af37]/50 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1 h-2 bg-[#d4af37] rounded-full"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </header>

      <AnimatedSection className="py-20 px-8 text-center bg-stone-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#d4af37]/5 to-transparent pointer-events-none"></div>

        <div className="max-w-lg mx-auto relative">
          <motion.div
            variants={glowVariants}
            initial="initial"
            whileHover="hover"
            className="border border-[#d4af37] p-8 bg-stone-800/80 backdrop-blur-sm relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent"
              style={{ backgroundSize: "200% 100%" }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
              className="absolute -top-3 left-1/2 -translate-x-1/2 bg-stone-900 px-4 text-[#d4af37] text-lg"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              Details
            </motion.div>

            <motion.div
              className="space-y-6 relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* 增强：添加邀请文案 */}
              <motion.div
                className="space-y-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {finalContent.invitationText.map((text, index) => (
                  <motion.p
                    key={index}
                    className="text-[#d4af37]/80 text-base"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.15 }}
                  >
                    {text}
                  </motion.p>
                ))}
              </motion.div>
              
              <div>
                <motion.p
                  className="text-3xl md:text-4xl font-light"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {props.weddingDate}
                </motion.p>
                <motion.div
                  className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </div>

              <motion.p
                className="text-[#d4af37]/70 mb-8 text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {props.hotelName}
              </motion.p>

              <motion.div
                className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#d4af37]/30"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={props.photos[1] || props.photos[0]}
                  alt="Detail"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <motion.div
                  className="absolute inset-0 border-2 border-[#d4af37] rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
                  style={{ margin: "-4px" }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 px-8 text-center relative">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
            }}
          >
            {props.photos.slice(2, 6).map((photo, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, rotate: index % 2 === 0 ? -5 : 5 },
                  visible: { opacity: 1, scale: 1, rotate: 0 },
                }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="relative aspect-square overflow-hidden rounded-xl border border-[#d4af37]/30"
              >
                <Image
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#d4af37]/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 px-8 text-center relative" ref={footerRef}>
        <motion.div
          className="max-w-md mx-auto border-t border-[#d4af37]/30 pt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p
            className="text-[#d4af37]/60 text-sm mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Looking forward to celebrating with you
          </motion.p>
          
          {/* 增强：添加感谢语 */}
          <motion.p
            className="text-[#d4af37]/70 text-base mb-8 leading-relaxed px-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {finalContent.guestThankYou}
          </motion.p>

          <motion.div
            className="flex justify-center gap-4"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {['Save', 'Share', 'Map'].map((label, index) => (
              <motion.button
                key={label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(212, 175, 55, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border border-[#d4af37] text-[#d4af37] rounded-full text-sm uppercase tracking-wider hover:border-[#d4af37]/80 transition-all"
              >
                {label}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </AnimatedSection>

      {floatingElements.map((elem) => (
        <motion.div
          key={`float-${elem.id}`}
          className="fixed pointer-events-none opacity-5 border border-[#d4af37] rounded-full"
          style={{
            left: `${elem.x}%`,
            top: `${elem.y}%`,
            width: elem.size,
            height: elem.size,
          }}
          animate={{
            rotate: [elem.rotation, elem.rotation + 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: elem.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            className="w-2 h-2 rounded-full bg-[#d4af37]"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              delay: dot * 0.3,
              repeat: Infinity,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default LuxuryGold;
