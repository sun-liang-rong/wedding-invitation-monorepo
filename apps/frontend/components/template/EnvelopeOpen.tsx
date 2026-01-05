'use client'

import { WeddingProps } from "@/types";
import MusicPlayer from "../MusicPlayer";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import Image from "next/image";
import { Great_Vibes, Montserrat, Noto_Serif_SC, Playfair_Display } from "next/font/google";
const fontTitle = Playfair_Display({ subsets: ['latin'] });
const fontBody = Noto_Serif_SC({ subsets: ['latin'], weight: ['400', '700'] });
const fontModern = Montserrat({ subsets: ['latin'] });
const fontScript = Great_Vibes({ subsets: ['latin'], weight: ['400'] });

const EnvelopeOpen: React.FC<WeddingProps> = (props) => {
  // 默认内容配置
  const defaultContent = {
    coverStory: "打开这封信，开启我们的故事。",
    invitationText: [
      "我们诚挚邀请您",
      "见证我们的幸福时刻",
      "分享这份喜悦"
    ],
    guestThankYou: "感谢您一路以来的陪伴，期待您的光临。"
  };
  
  // 合并用户内容和默认内容
  const finalContent = {
    ...defaultContent,
    ...props.content,
    invitationText: props.content?.invitationText || defaultContent.invitationText,
  };
  
  const [isOpen, setIsOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsFlipped(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const particleCount = 20;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center overflow-hidden relative">
      <MusicPlayer url={props.musicUrl} />
      
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-rose-300 rounded-full opacity-0"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
          }}
          animate={isOpen ? {
            y: [null, Math.random() * -200 - 100],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          } : { opacity: 0 }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeOut"
          }}
        />
      ))}
      
      <motion.div 
        className="relative w-full max-w-md perspective-1000"
        animate={{ 
          height: isOpen ? "100vh" : "300px",
          width: isOpen ? "100vw" : "90%",
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div 
              key="closed"
              initial={{ scale: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 bg-[#f8f5f2] shadow-2xl rounded-lg cursor-pointer flex flex-col items-center justify-center z-20"
              onClick={() => setIsOpen(true)}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="text-rose-400 w-16 h-16 mb-4" fill="currentColor" />
              </motion.div>
              <p className={`${fontTitle.className} text-3xl text-stone-600 mb-2`}>To You</p>
              <motion.p 
                className="text-xs text-stone-400 uppercase tracking-[0.3em]"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Click to Open
              </motion.p>
              
              <motion.div 
                className="absolute bottom-4 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-6 h-10 border-2 border-stone-300 rounded-full flex justify-center pt-2">
                  <motion.div 
                    className="w-1 h-2 bg-stone-400 rounded-full"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              className="absolute inset-0 bg-white shadow-2xl overflow-hidden"
              initial={{ rotateX: 90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div 
                className="w-full h-full overflow-y-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative min-h-screen flex flex-col items-center p-6 pt-16">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative w-full max-w-md aspect-[4/3] mb-8"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-lg overflow-hidden"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.5 }}
                    >
                      <Image src={props.photos[0]} alt="Cover" fill className="object-cover" priority />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </motion.div>
                    <motion.div
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <p className={`${fontScript.className} text-2xl text-rose-500`}>
                        {props.groomName} & {props.brideName}
                      </p>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mb-8"
                  >
                    {/* 增强：添加邀请文案 */}
                    <div className="space-y-3 mb-6">
                      {finalContent.invitationText.map((text, index) => (
                        <motion.p
                          key={index}
                          className={`${fontBody.className} text-stone-600 text-base`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + index * 0.15 }}
                        >
                          {text}
                        </motion.p>
                      ))}
                    </div>
                    
                    <p className={`${fontBody.className} text-stone-600 text-lg`}>
                      {props.weddingDate}
                    </p>
                    <p className="text-stone-400 text-sm mt-1">at {props.hotelName}</p>
                  </motion.div>

                  <motion.div
                    className="w-full grid grid-cols-3 gap-3 mb-8"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.15 } }
                    }}
                  >
                    {props.photos.slice(1, 7).map((src, i) => (
                      <motion.div
                        key={i}
                        variants={{
                          hidden: { opacity: 0, y: 20, scale: 0.9 },
                          visible: { opacity: 1, y: 0, scale: 1 }
                        }}
                        className="relative aspect-square rounded-lg overflow-hidden shadow-md"
                        whileHover={{ scale: 1.05, zIndex: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image src={src} alt={`Memory ${i + 1}`} fill className="object-cover" />
                      </motion.div>
                    ))}
                  </motion.div>

                  {props.photos.length > 7 && (
                    <motion.div
                      className="w-full max-w-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                        <Image src={props.photos[7]} alt="Special moment" fill className="object-cover" />
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    className="mt-auto pt-12 pb-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    <motion.div
                      className="flex justify-center gap-2 mb-4"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Heart className="text-rose-400 w-6 h-6" fill="currentColor" />
                    </motion.div>
                    <p className={`${fontScript.className} text-rose-500 text-xl mb-4`}>Save the Date</p>
                    
                    {/* 增强：添加感谢语 */}
                    <motion.p
                      className={`${fontBody.className} text-stone-500 text-sm px-8 leading-relaxed`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.7 }}
                    >
                      {finalContent.guestThankYou}
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default EnvelopeOpen;