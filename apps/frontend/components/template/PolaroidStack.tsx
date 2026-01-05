'use client'
import { WeddingProps } from "@/types";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import Image from "next/image";
import MusicPlayer from "../MusicPlayer";
import { useRef, useMemo } from "react";
import { Great_Vibes, Montserrat, Noto_Serif_SC, Playfair_Display } from "next/font/google";
import { ContentManager } from "@/lib/enhancement/content/ContentManager";

const fontTitle = Playfair_Display({ subsets: ['latin'] });
const fontBody = Noto_Serif_SC({ subsets: ['latin'], weight: ['400', '700'] });
const fontModern = Montserrat({ subsets: ['latin'] });
const fontScript = Great_Vibes({ subsets: ['latin'], weight: ['400'] });

interface PolaroidProps {
  src: string;
  index: number;
  total: number;
  caption: string;
}

const PolaroidStack: React.FC<WeddingProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const defaultContent = useMemo(() => ContentManager.getDefaultContent('gallery', 'casual'), []);
  const mergedContent = useMemo(() => ContentManager.mergeContent(defaultContent, props.content), [props.content, defaultContent]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const stackRotation = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const stackScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1]);

  const photos = useMemo(() => {
    const defaultCaptions = ["Us", "Love", "Together", "Forever", "Always", "Joy", "Happiness", "Memories"];
    return props.photos.map((src, i) => ({
      src,
      index: i,
      caption: defaultCaptions[i] || `Photo ${i + 1}`,
    }));
  }, [props.photos]);

  const floatingParticles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 3,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 4,
      type: Math.random() > 0.6 ? 'star' : 'circle',
    }));
  }, []);

  const PolaroidCard: React.FC<PolaroidProps> = ({ src, index, total, caption }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: false, margin: "-150px" });

    const randomRotate = useMemo(() => (Math.random() - 0.5) * 12, []);
    const delay = index * 0.2;

    const rotateY = useTransform(scrollYProgress, [0, 1], [0, index * 5]);
    const zIndex = total - index;

    return (
      <motion.div
        ref={cardRef}
        initial={{ rotate: randomRotate, scale: 0.8, opacity: 0, y: 100 }}
        animate={{
          rotate: isInView ? randomRotate * 0.3 : randomRotate,
          scale: isInView ? 1 : 0.9,
          opacity: isInView ? 1 : 0.7,
          y: isInView ? 0 : 20,
        }}
        viewport={{ once: false, margin: "-150px" }}
        transition={{
          duration: 0.8,
          delay: delay,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{
          rotateY,
          zIndex,
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
        className="bg-white p-4 pb-12 shadow-xl transform-gpu relative"
        whileHover={{
          scale: 1.05,
          rotate: randomRotate * 0.2,
          zIndex: 100,
          boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
        }}
      >
        <motion.div
          className="relative aspect-square bg-stone-100 overflow-hidden rounded-sm"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={src}
            alt={`Polaroid ${index + 1}`}
            fill
            className="object-cover"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-stone-200/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
          />
        </motion.div>

        <motion.div
          className={`${fontScript.className} absolute bottom-4 right-4 text-2xl text-stone-600`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: delay + 0.3 }}
        >
          {caption}
        </motion.div>

        {index > 0 && (
          <motion.div
            className="absolute -top-2 -left-2 text-stone-300 text-2xl"
            animate={{
              rotate: [0, 10, 0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ✿
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-[#f5f5f0] overflow-hidden ${fontBody.className} py-10 px-4 relative`}
    >
      <motion.div
        className="fixed left-0 top-0 h-1 bg-gradient-to-r from-stone-400 to-stone-600 z-50 origin-left"
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
          {particle.type === 'star' ? (
            <motion.div
              className="text-stone-300"
              style={{ fontSize: particle.size }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ✦
            </motion.div>
          ) : (
            <motion.div
              className="rounded-full bg-stone-300"
              style={{
                width: particle.size,
                height: particle.size,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 15 - 7, 0],
                opacity: [0.15, 0.5, 0.15],
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

      <div className="fixed inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%">
          <pattern id="polaroid-pattern" patternUnits="userSpaceOnUse" width="40" height="40">
            <circle cx="20" cy="20" r="1" fill="#78716c" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#polaroid-pattern)" />
        </svg>
      </div>

      <motion.div
        ref={titleRef}
        className="max-w-md mx-auto space-y-12 relative z-10"
        style={{
          rotate: stackRotation,
          scale: stackScale,
        }}
      >
        <motion.div
          className="text-center space-y-2 pt-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-stone-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Wedding Invitation
          </motion.h1>
          <motion.p
            className="text-stone-500 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            我们要结婚啦
          </motion.p>
          <motion.div
            className="flex justify-center gap-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {[0, 1, 2].map((dot) => (
              <motion.div
                key={dot}
                className="w-2 h-2 rounded-full bg-stone-400"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  delay: dot * 0.2,
                  repeat: Infinity,
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        <div className="space-y-8 relative">
          {photos.map((photo, index) => (
            <PolaroidCard
              key={photo.index}
              src={photo.src}
              index={photo.index}
              total={photos.length}
              caption={photo.caption}
            />
          ))}
        </div>

        <motion.div
          className="bg-white/90 backdrop-blur-sm p-8 shadow-xl rounded-2xl text-center space-y-6 border border-stone-200"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
          onViewportEnter={() => props.onContentView?.('invitationText')}
        >
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {mergedContent.coverStory && (
              <motion.div
                className="mb-4 space-y-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <p className={`${fontBody.className} text-sm text-stone-600`}>{mergedContent.coverStory}</p>
              </motion.div>
            )}

            <motion.p
              className="text-2xl md:text-3xl font-bold text-stone-800"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {props.weddingDate}
            </motion.p>
            <motion.div
              className="w-16 h-0.5 bg-gradient-to-r from-transparent via-stone-400 to-transparent mx-auto"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
            <motion.p
              className="text-stone-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {props.hotelAddress}
            </motion.p>
          </motion.div>

          <motion.button
            className="w-full bg-stone-800 text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.02, backgroundColor: "#292524" }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            查看地图
          </motion.button>

          {mergedContent.guestThankYou && (
            <motion.p
              className="text-stone-500 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              onViewportEnter={() => props.onContentView?.('guestThankYou')}
            >
              {mergedContent.guestThankYou}
            </motion.p>
          )}

          <motion.div
            className="flex justify-center gap-2 text-stone-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.15,
                  repeat: Infinity,
                }}
              >
                ♥
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {['Save', 'Share'].map((label, index) => (
          <motion.button
            key={label}
            className="px-5 py-2 bg-white border border-stone-300 rounded-full text-stone-600 text-sm hover:bg-stone-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + index * 0.1 }}
          >
            {label}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default PolaroidStack;
