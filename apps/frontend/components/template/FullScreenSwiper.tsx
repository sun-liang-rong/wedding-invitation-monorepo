'use client'
import { WeddingProps } from "@/types";
import MusicPlayer from "../MusicPlayer";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { ChevronDown, Heart, Camera, MapPin, Music, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Great_Vibes, Montserrat, Noto_Serif_SC, Playfair_Display } from "next/font/google";
import { ContentManager } from "@/lib/enhancement/content/ContentManager";

const fontTitle = Playfair_Display({ subsets: ['latin'] });
const fontBody = Noto_Serif_SC({ subsets: ['latin'], weight: ['400', '700'] });
const fontModern = Montserrat({ subsets: ['latin'] });
const fontScript = Great_Vibes({ subsets: ['latin'], weight: ['400'] });

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const FloatingParticle: React.FC<{ particle: Particle }> = ({ particle }) => (
  <motion.div
    className={`fixed rounded-full pointer-events-none ${particle.color}`}
    style={{
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: particle.size,
      height: particle.size,
    }}
    animate={{
      y: [0, -100 - Math.random() * 100],
      x: [0, Math.random() * 30 - 15],
      opacity: [0, 0.8, 0],
      scale: [0.5, 1, 0.5],
    }}
    transition={{
      duration: particle.duration,
      delay: particle.delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

const SlideIndicator: React.FC<{ active: boolean; index: number }> = ({ active, index }) => (
  <motion.div
    className={`h-1 rounded-full ${active ? 'bg-rose-400' : 'bg-white/30'}`}
    animate={{ width: active ? 40 : 12 }}
    transition={{ duration: 0.3 }}
  />
);

const Lightbox: React.FC<{ src: string; onClose: () => void }> = ({ src, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
    onClick={onClose}
  >
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-white hover:text-rose-400 transition-colors"
    >
      <X size={32} />
    </button>
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative w-[90vw] h-[80vh]"
    >
      <Image src={src} alt="Lightbox" fill className="object-contain" onClick={(e) => e.stopPropagation()} />
    </motion.div>
  </motion.div>
);

const CoverSlide: React.FC<WeddingProps & { content: any }> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false });
  const { scrollYProgress: coverScrollProgress } = useScroll({ target: containerRef });

  const particles: Particle[] = useMemo(() => [
    ...Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * 3,
      color: 'bg-rose-400/60',
    })),
    ...Array.from({ length: 8 }, (_, i) => ({
      id: i + 15,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 2,
      color: 'bg-white/40',
    })),
  ], []);

  return (
    <motion.section
      ref={containerRef}
      className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden"
      style={{ perspective: "2000px" }}
      onViewportEnter={() => props.onContentView?.('coverStory')}
    >
      {particles.map((particle) => (
        <FloatingParticle key={particle.id} particle={particle} />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          rotateX: useTransform(coverScrollProgress, [0, 1], [5, -5]),
        }}
      >
        <Image src={props.photos[0]} alt="cover" fill className="object-cover" />
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      <motion.div
        className="relative z-10 text-white text-center"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50, scale: isInView ? 1 : 0.9 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <motion.div
          className="mb-6"
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Heart className="w-12 h-12 mx-auto text-rose-500 fill-rose-500" />
        </motion.div>

        <motion.h1
          className={`${fontModern.className} text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter leading-tight`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Save<br />The<br />Date
        </motion.h1>

        {props.content?.coverStory && (
          <motion.p
            className={`${fontBody.className} text-base md:text-lg text-rose-200/90 max-w-md mx-auto mb-4 px-4`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {props.content.coverStory}
          </motion.p>
        )}

        <motion.p
          className={`${fontBody.className} text-xl md:text-2xl text-rose-300 font-medium`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {props.weddingDate}
        </motion.p>

        <motion.div
          className="mt-12 flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <ChevronDown className="w-6 h-6 text-white/70" />
            <span className="text-xs text-white/50 uppercase tracking-widest">Scroll</span>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-0.5 h-12 bg-gradient-to-b from-rose-400 to-transparent" />
      </motion.div>
    </motion.section>
  );
};

const InfoSlide: React.FC<WeddingProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false });

  return (
    <motion.section
      ref={containerRef}
      className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: isInView ? 1 : 1.1 }}
        transition={{ duration: 1.5 }}
      >
        <Image src={props.photos[1]} alt="bg" fill className="object-cover" />
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-800/70 to-stone-900/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      <motion.div
        className="relative z-10 p-8 md:p-12 border border-rose-400/30 backdrop-blur-xl bg-stone-900/50 max-w-md mx-4 rounded-3xl"
        initial={{ opacity: 0, x: -100, rotate: -5 }}
        animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -100, rotate: isInView ? 0 : -5 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          className="absolute -top-4 -left-4 text-rose-400"
          animate={{ rotate: [0, 10, 0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Heart className="w-8 h-8 fill-rose-400" />
        </motion.div>

        <motion.h2
          className={`${fontScript.className} text-4xl md:text-5xl mb-8 text-center text-white`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ delay: 0.4 }}
        >
          {props.groomName}
          <span className="text-rose-400 mx-2">&</span>
          {props.brideName}
        </motion.h2>

        <div className="space-y-6">
          <motion.div
            className="flex items-center gap-4 text-stone-200"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -30 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <p className="text-xs text-rose-400 uppercase tracking-widest">Date</p>
              <p className={`${fontBody.className} text-lg`}>{props.weddingDate}</p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-4 text-stone-200"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -30 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <p className="text-xs text-rose-400 uppercase tracking-widest">Venue</p>
              <p className={`${fontBody.className} text-lg`}>{props.hotelName}</p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-4 text-stone-200"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -30 }}
            transition={{ delay: 0.7 }}
          >
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <p className="text-xs text-rose-400 uppercase tracking-widest">Address</p>
              <p className={`${fontBody.className} text-lg`}>{props.hotelAddress}</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-8 pt-6 border-t border-rose-400/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-center text-stone-400 text-sm">
            We sincerely invite you to celebrate our special day
          </p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

const GallerySlide: React.FC<WeddingProps> = (props) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false });

  const photos = props.photos.slice(2, 6);

  return (
    <>
      <motion.section
        ref={containerRef}
        className="h-screen w-full snap-start relative grid grid-cols-2 grid-rows-2 overflow-hidden"
      >
        {photos.map((src, i) => (
          <motion.div
            key={i}
            className="relative w-full h-full border border-black/20"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 1.2 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            onClick={() => setLightboxIndex(i)}
            whileHover={{ scale: 0.98 }}
          >
            <Image src={src} alt={`Gallery ${i + 1}`} fill className="object-cover" />
            <motion.div
              className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors duration-300 flex items-center justify-center"
              whileHover={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            >
              <motion.div
                className="opacity-0 hover:opacity-100"
                whileHover={{ scale: 1.1 }}
              >
                <ZoomIn className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          </motion.div>
        ))}

        <motion.div
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-white/95 backdrop-blur-sm px-8 py-4 text-center rounded-2xl shadow-2xl">
            <p className={`${fontModern.className} text-xl font-bold uppercase tracking-[0.3em] text-stone-800`}>
              Gallery
            </p>
            <p className={`${fontScript.className} text-rose-500 text-lg mt-1`}>
              Our Beautiful Moments
            </p>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ delay: 1 }}
        >
          {photos.map((_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full ${i === lightboxIndex ? 'bg-rose-500' : 'bg-white/50'}`}
              whileHover={{ scale: 1.5 }}
            />
          ))}
        </motion.div>
      </motion.section>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox src={photos[lightboxIndex]} onClose={() => setLightboxIndex(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

const StorySlide: React.FC<WeddingProps & { content: any }> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false });
  const defaultContent = useMemo(() => ContentManager.getDefaultContent('story', 'modern'), []);
  const mergedContent = useMemo(() => ContentManager.mergeContent(defaultContent, props.content), [props.content, defaultContent]);

  const storyTexts = useMemo(() => {
    const paragraphs = ContentManager.generateParagraphs(mergedContent);
    return paragraphs.length > 0 ? paragraphs : [
      "茫茫人海中，我们相遇相识相爱。每一天都是上天的馈赠，每一次相视都是幸福的见证。",
      "从今往后，我们将携手走过人生的每一个春夏秋冬，共同书写属于我们的美好篇章。"
    ];
  }, [mergedContent]);

  return (
    <motion.section
      ref={containerRef}
      className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden"
      onViewportEnter={() => props.onContentView?.('storyText')}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: isInView ? 1 : 1.1 }}
        transition={{ duration: 1.5 }}
      >
        <Image src={props.photos[6] || props.photos[0]} alt="story" fill className="object-cover" />
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-rose-900/80 via-rose-800/60 to-rose-900/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      <motion.div
        className="relative z-10 max-w-2xl mx-4 text-center text-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <motion.div
          className="mb-8"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <Heart className="w-16 h-16 mx-auto text-rose-400/30 fill-rose-400/30" />
        </motion.div>

        <motion.h3
          className={`${fontBody.className} text-4xl md:text-5xl mb-6 text-rose-200`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ delay: 0.5 }}
        >
          我们的故事
        </motion.h3>

        <motion.div
          className={`${fontBody.className} text-lg md:text-xl leading-relaxed text-rose-100/90 space-y-4`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ delay: 0.7 }}
        >
          {Array.isArray(storyTexts) ? (
            storyTexts.map((text, i) => (
              <p key={i}>{text}</p>
            ))
          ) : (
            <p>{storyTexts}</p>
          )}
        </motion.div>

        <motion.div
          className="mt-12 flex justify-center gap-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.1 }}
          >
            <p className={`${fontScript.className} text-3xl text-rose-300`}>1,337</p>
            <p className="text-xs text-rose-400/70 uppercase tracking-widest">Days</p>
          </motion.div>
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.1 }}
          >
            <p className={`${fontScript.className} text-3xl text-rose-300`}>∞</p>
            <p className="text-xs text-rose-400/70 uppercase tracking-widest">Memories</p>
          </motion.div>
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.1 }}
          >
            <p className={`${fontScript.className} text-3xl text-rose-300`}>1</p>
            <p className="text-xs text-rose-400/70 uppercase tracking-widest">Forever</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

const LocationSlide: React.FC<WeddingProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false });

  return (
    <motion.section
      ref={containerRef}
      className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: isInView ? 1 : 1.1 }}
        transition={{ duration: 1.5 }}
      >
        <Image src={props.photos[7] || props.photos[1]} alt="location" fill className="object-cover" />
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-800/70 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      <motion.div
        className="relative z-10 max-w-lg mx-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8"
          whileHover={{ boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}
        >
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
            transition={{ delay: 0.4 }}
          >
            <MapPin className="w-6 h-6 text-rose-400" />
            <h3 className={`${fontModern.className} text-xl font-bold text-white uppercase tracking-wider`}>
              Wedding Location
            </h3>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="pb-4 border-b border-white/10">
              <p className="text-xs text-rose-400 uppercase tracking-widest mb-1">Venue</p>
              <p className={`${fontBody.className} text-xl text-white`}>{props.hotelName}</p>
            </div>

            <div className="pb-4 border-b border-white/10">
              <p className="text-xs text-rose-400 uppercase tracking-widest mb-1">Address</p>
              <p className={`${fontBody.className} text-white/80`}>{props.hotelAddress}</p>
            </div>

            <div>
              <p className="text-xs text-rose-400 uppercase tracking-widest mb-1">Time</p>
              <p className={`${fontBody.className} text-white/80`}>{props.weddingDate} • 18:00</p>
            </div>
          </motion.div>

          <motion.div
            className="mt-8 flex gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              className="flex-1 bg-rose-500 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02, backgroundColor: "#f43f5e" }}
              whileTap={{ scale: 0.98 }}
            >
              <MapPin className="w-4 h-4" />
              导航前往
            </motion.button>
            <motion.button
              className="px-4 py-3 border border-white/30 rounded-xl text-white flex items-center justify-center"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              <Camera className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

const CountdownTimer: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useState(() => {
    const target = new Date(targetDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <div className="flex justify-center gap-4 mt-8">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.minutes, label: 'Mins' },
        { value: timeLeft.seconds, label: 'Secs' },
      ].map((item, index) => (
        <motion.div
          key={item.label}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className={`${fontModern.className} text-2xl md:text-3xl font-bold text-rose-300`}>
            {String(item.value).padStart(2, '0')}
          </div>
          <div className="text-xs text-rose-500/70 uppercase tracking-widest">{item.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

const RsvpSlide: React.FC<WeddingProps & { content: any }> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false });
  const defaultContent = useMemo(() => ContentManager.getDefaultContent('card', 'modern'), []);
  const mergedContent = useMemo(() => ContentManager.mergeContent(defaultContent, props.content), [props.content, defaultContent]);

  return (
    <motion.section
      ref={containerRef}
      className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden"
      onViewportEnter={() => props.onContentView?.('guestThankYou')}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: isInView ? 1 : 1.1 }}
        transition={{ duration: 1.5 }}
      >
        <Image src={props.photos[0]} alt="rsvp" fill className="object-cover" />
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-rose-900/80 via-rose-800/70 to-rose-900/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      <motion.div
        className="relative z-10 max-w-md mx-4 text-center text-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h3
          className={`${fontScript.className} text-5xl md:text-6xl mb-4 text-rose-200`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
          transition={{ delay: 0.4 }}
        >
          请回复
        </motion.h3>

        <motion.p
          className={`${fontBody.className} text-lg text-rose-100/80 mb-8`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ delay: 0.5 }}
        >
          若您能出席我们的婚礼，请于此处回复
        </motion.p>

        <CountdownTimer targetDate={props.weddingDate} />

        <motion.div
          className="mt-12 flex flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className="bg-rose-500 text-white py-4 px-8 rounded-2xl font-medium text-lg flex items-center justify-center gap-3"
            whileHover={{ scale: 1.05, backgroundColor: "#f43f5e" }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className="w-5 h-5 fill-current" />
            我将出席
          </motion.button>
          <motion.button
            className="bg-transparent border-2 border-white/30 text-white py-4 px-8 rounded-2xl font-medium text-lg"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            很遗憾，无法出席
          </motion.button>
        </motion.div>

        {mergedContent.guestThankYou && (
          <motion.p
            className="mt-12 text-rose-300/80 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 1 }}
          >
            {mergedContent.guestThankYou}
          </motion.p>
        )}
      </motion.div>
    </motion.section>
  );
};

const FullScreenSwiper: React.FC<WeddingProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [currentSlide, setCurrentSlide] = useState(0);
  const defaultContent = useMemo(() => ContentManager.getDefaultContent('narrative', 'modern'), []);
  const mergedContent = useMemo(() => ContentManager.mergeContent(defaultContent, props.content), [props.content, defaultContent]);

  const slideCount = 6;

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div ref={containerRef} className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black">
      <MusicPlayer url={props.musicUrl} />

      <motion.div
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        {Array.from({ length: slideCount }).map((_, i) => (
          <SlideIndicator key={i} active={i === currentSlide} index={i} />
        ))}
      </motion.div>

      <motion.div
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 text-white/30 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="writing-vertical text-sm tracking-widest">
          {currentSlide + 1} / {slideCount}
        </div>
      </motion.div>

      <style jsx global>{`
        .writing-vertical {
          writing-mode: vertical-rl;
        }
      `}</style>

      <CoverSlide {...props} content={mergedContent} />
      <InfoSlide {...props} />
      <GallerySlide {...props} />
      <StorySlide {...props} content={mergedContent} />
      <LocationSlide {...props} />
      <RsvpSlide {...props} content={mergedContent} />
    </div>
  );
};

export default FullScreenSwiper;