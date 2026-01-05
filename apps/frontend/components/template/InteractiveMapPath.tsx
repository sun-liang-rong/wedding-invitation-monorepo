'use client'
import { WeddingProps } from "@/types";
import MusicPlayer from "../MusicPlayer";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useMemo } from "react";
import { Great_Vibes, Montserrat, Noto_Serif_SC, Playfair_Display } from "next/font/google";
import { ContentManager } from "@/lib/enhancement/content/ContentManager";

const fontTitle = Playfair_Display({ subsets: ['latin'] });
const fontBody = Noto_Serif_SC({ subsets: ['latin'], weight: ['400', '700'] });
const fontModern = Montserrat({ subsets: ['latin'] });
const fontScript = Great_Vibes({ subsets: ['latin'], weight: ['400'] });

interface TimelineEvent {
  id: number;
  time: string;
  title: string;
  description: string;
  photo?: string;
}

const InteractiveMapPath: React.FC<WeddingProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const defaultContent = useMemo(() => ContentManager.getDefaultContent('story', 'romantic'), []);
  const mergedContent = useMemo(() => ContentManager.mergeContent(defaultContent, props.content), [props.content, defaultContent]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  const timelineEvents: TimelineEvent[] = useMemo(() => {
    const paragraphs = ContentManager.generateParagraphs(mergedContent);
    return [
      {
        id: 1,
        time: props.weddingDate,
        title: "Wedding Ceremony",
        description: paragraphs[0] || "10:00 AM",
        photo: props.photos[0],
      },
      {
        id: 2,
        time: "12:30 PM",
        title: "The Reception",
        description: paragraphs[1] || props.hotelName,
        photo: props.photos[1],
      },
      {
        id: 3,
        time: "Evening",
        title: "Thank You",
        description: mergedContent.guestThankYou || "期待您的到来",
      },
    ];
  }, [props.weddingDate, props.hotelName, props.photos, mergedContent]);

  const floatingParticles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      type: Math.random() > 0.5 ? 'heart' : 'circle',
    }));
  }, []);

  const decorativeElements = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 20,
      rotation: Math.random() * 360,
    }));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: i * 0.3,
        ease: [0.4, 0, 0.2, 1] as any,
      },
    }),
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [0.5, 0, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity as any,
        ease: "easeInOut" as any,
      },
    },
  };

  const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = '',
  }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-gradient-to-br from-rose-50 via-rose-100 to-pink-50 py-20 px-6 ${fontBody.className} relative overflow-hidden`}
    >
      <motion.div
        className="fixed left-0 top-0 h-1 bg-gradient-to-r from-rose-400 to-pink-400 z-50 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {floatingParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
        >
          {particle.type === 'heart' ? (
            <motion.svg
              width={particle.size}
              height={particle.size}
              viewBox="0 0 24 24"
              className="text-rose-300 fill-current"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </motion.svg>
          ) : (
            <motion.div
              className="rounded-full bg-rose-200"
              style={{
                width: particle.size,
                height: particle.size,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.div>
      ))}

      <div className="fixed inset-0 pointer-events-none opacity-30">
        <svg width="100%" height="100%">
          <pattern id="rose-pattern" patternUnits="userSpaceOnUse" width="60" height="60">
            <circle cx="30" cy="30" r="2" fill="#f43f5e" opacity="0.3" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#rose-pattern)" />
        </svg>
      </div>

      <AnimatedSection className="relative z-10">
        <motion.h1
          className="text-center text-4xl md:text-5xl text-rose-900 font-bold mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Journey
        </motion.h1>
        <motion.p
          className="text-center text-rose-600/70 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          A timeline of our special day
        </motion.p>
      </AnimatedSection>

      <div ref={timelineRef} className="max-w-md mx-auto relative z-10">
        <motion.div
          className="absolute left-8 top-0 bottom-0 w-0.5 bg-rose-200"
          style={{ opacity: lineOpacity }}
        />

        <motion.div
          className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-400 via-pink-400 to-rose-300"
          style={{ scaleY: pathLength, transformOrigin: "top" }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative border-l-2 border-dashed border-rose-300 pl-8 space-y-24 pb-24"
        >
          {timelineEvents.map((event, index) => (
            <motion.div
              key={event.id}
              custom={index}
              variants={itemVariants}
              className="relative"
            >
              <motion.div
                className="absolute -left-[41px] top-6 w-6 h-6 rounded-full border-4 border-rose-50 z-10"
                style={{
                  background: index === 0
                    ? 'linear-gradient(135deg, #f43f5e, #fb7185)'
                    : index === 1
                    ? 'linear-gradient(135deg, #f472b6, #f9a8d4)'
                    : 'linear-gradient(135deg, #fda4af, #fecdd3)',
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-rose-400"
                  variants={pulseVariants}
                  animate="animate"
                />
              </motion.div>

              <motion.div
                className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-white/50"
                whileHover={{
                  scale: 1.02,
                  rotate: index % 2 === 0 ? 1 : -1,
                  boxShadow: "0 20px 40px rgba(244, 63, 94, 0.15)",
                }}
                transition={{ duration: 0.3 }}
                onViewportEnter={() => props.onContentView?.('storyText')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <motion.span
                    className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                    style={{
                      background: index === 0
                        ? 'linear-gradient(135deg, #f43f5e, #fb7185)'
                        : index === 1
                        ? 'linear-gradient(135deg, #f472b6, #f9a8d4)'
                        : 'linear-gradient(135deg, #fda4af, #fecdd3)',
                    }}
                  >
                    {event.time}
                  </motion.span>
                </div>

                {event.photo && (
                  <motion.div
                    className="relative aspect-[3/2] rounded-xl overflow-hidden mb-4 border border-rose-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={event.photo}
                      alt={event.title}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-rose-500/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
                    />
                  </motion.div>
                )}

                <motion.h3
                  className="font-bold text-lg text-rose-800 mb-1"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {event.title}
                </motion.h3>
                <motion.p
                  className="text-stone-500"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {event.description}
                </motion.p>

                {index < timelineEvents.length - 1 && (
                  <motion.div
                    className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center"
                    style={{ right: '-3rem' }}
                    whileHover={{ scale: 1.1, backgroundColor: "#fecdd3" }}
                  >
                    <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {decorativeElements.map((elem) => (
        <motion.div
          key={`deco-${elem.id}`}
          className="fixed pointer-events-none opacity-10 border-2 border-rose-300 rounded-full"
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
            duration: 30,
            repeat: Infinity as any,
            ease: "linear" as any,
          }}
        />
      ))}

      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            className="w-2 h-2 rounded-full bg-rose-400"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              delay: dot * 0.2,
              repeat: Infinity,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default InteractiveMapPath;
