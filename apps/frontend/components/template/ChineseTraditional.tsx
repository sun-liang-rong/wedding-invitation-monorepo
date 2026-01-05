'use client'
import { WeddingProps } from "@/types";
import MusicPlayer from "../MusicPlayer";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Heart } from "lucide-react";
import { Great_Vibes, Montserrat, Noto_Serif_SC, Playfair_Display } from "next/font/google";
const fontTitle = Playfair_Display({ subsets: ['latin'] });
const fontBody = Noto_Serif_SC({ subsets: ['latin'], weight: ['400', '700'] });
const fontModern = Montserrat({ subsets: ['latin'] });
const fontScript = Great_Vibes({ subsets: ['latin'], weight: ['400'] });

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 60, damping: 20 }
  }
};

const floatVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-8, 8, -8],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  }
};

const pulseVariants: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.15, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  }
};

const ChineseTraditional: React.FC<WeddingProps> = (props) => {
  // 默认内容配置（传统风格）
  const defaultContent = {
    coverStory: "良辰吉日，喜结连理。愿与君共度余生，白首不相离。",
    invitationText: [
      "执子之手，与子偕老",
      "琴瑟和鸣，鸾凤相依",
      "恭请莅临，共襄盛举"
    ],
    guestThankYou: "承蒙厚爱，不胜感激。愿与诸君共享此喜，同庆佳期。"
  };
  
  // 合并用户内容和默认内容
  const finalContent = {
    ...defaultContent,
    ...props.content,
    invitationText: props.content?.invitationText || defaultContent.invitationText,
  };
  
  const extraPhotos = props.photos.slice(1);

  return (
    <div className={`min-h-screen bg-[#8a0000] text-[#fcdfa6] ${fontBody.className} overflow-hidden relative`}>
      <MusicPlayer url={props.musicUrl} />
      
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c4 4 4 10 0 14s-10 4-14 0-4-10 0-14 10-4 14 0z' fill='%23fcdfa6' fill-opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
        animate={{ backgroundPosition: ['0px 0px', '60px 60px'] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <motion.div 
        className="absolute top-0 left-0 w-40 h-40 border-t-6 border-l-6 border-[#fcdfa6] rounded-tl-3xl opacity-60 m-4"
        variants={floatVariants}
        initial="initial"
        animate="animate"
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-40 h-40 border-b-6 border-r-6 border-[#fcdfa6] rounded-br-3xl opacity-60 m-4"
        variants={floatVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 1 }}
      />

      <div className="flex flex-col h-full py-16 items-center justify-center space-y-10 relative z-10">
         <motion.div
           variants={containerVariants}
           initial="hidden"
           animate="visible"
           className="flex flex-col items-center"
         >
           <motion.div 
             variants={itemVariants}
             className="w-72 h-72 rounded-full border-4 border-[#fcdfa6] p-1 shadow-2xl bg-[#5c0000] relative"
           >
              <motion.div 
                className="w-full h-full rounded-full overflow-hidden relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                 <Image src={props.photos[0]} alt="Main" fill className="object-cover" priority />
              </motion.div>
              <motion.div 
                className="absolute -top-3 -right-3 bg-[#8a0000] rounded-full p-2 border-2 border-[#fcdfa6]"
                variants={pulseVariants}
                initial="initial"
                animate="animate"
              >
                <Heart className="w-5 h-5 text-[#fcdfa6]" fill="currentColor" />
              </motion.div>
           </motion.div>
         </motion.div>

         <motion.div 
           className="flex gap-6 text-2xl md:text-3xl writing-vertical-rl font-bold tracking-widest h-56"
           variants={containerVariants}
           initial="hidden"
           animate="visible"
         >
            <motion.div variants={itemVariants} className="border-l-2 border-[#fcdfa6]/40 pl-4 flex items-center">
              <span className="writing-vertical-rl">{props.groomName}</span>
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col items-center justify-center">
               <motion.div 
                 className="w-2 h-16 bg-gradient-to-b from-[#fcdfa6] to-[#8a0000] rounded-full"
                 variants={pulseVariants}
                 initial="initial"
                 animate="animate"
               />
            </motion.div>
            <motion.div variants={itemVariants} className="border-r-2 border-[#fcdfa6]/40 pr-4 flex items-center">
              <span className="writing-vertical-rl">{props.brideName}</span>
            </motion.div>
         </motion.div>

         <motion.div 
           className="text-center space-y-3 opacity-95"
           variants={containerVariants}
           initial="hidden"
           animate="visible"
         >
            {/* 增强：添加传统风格邀请文案 */}
            <motion.div variants={itemVariants} className="space-y-2 mb-4">
              {finalContent.invitationText.map((text, index) => (
                <motion.p
                  key={index}
                  className="text-base tracking-wider"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.2 }}
                >
                  {text}
                </motion.p>
              ))}
            </motion.div>
            
            <motion.p variants={itemVariants} className="text-lg">谨定于</motion.p>
            <motion.p variants={itemVariants} className="text-2xl font-bold tracking-wider">{props.weddingDate}</motion.p>
            <motion.p variants={itemVariants} className="text-lg">恭请 阖第光临</motion.p>
            <motion.div variants={itemVariants} className="pt-4">
               <p className="text-base opacity-80 border-t border-[#fcdfa6]/30 pt-3 inline-block px-8">{props.hotelName}</p>
            </motion.div>
            
            {/* 增强：添加感谢语 */}
            <motion.p
              variants={itemVariants}
              className="text-sm opacity-70 pt-6 px-8 leading-relaxed"
            >
              {finalContent.guestThankYou}
            </motion.p>
         </motion.div>

         {extraPhotos.length > 0 && (
           <motion.div 
             className="mt-8 px-6"
             variants={containerVariants}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
           >
              <p className="text-center text-sm mb-4 opacity-60 tracking-widest">| 幸福瞬间 |</p>
              <div className="flex gap-4 justify-center flex-wrap">
                {extraPhotos.slice(0, 4).map((src, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-[#fcdfa6]/30"
                    whileHover={{ scale: 1.1, rotate: 2, zIndex: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image src={src} alt={`Memory ${i + 1}`} fill className="object-cover" />
                  </motion.div>
                ))}
              </div>
           </motion.div>
         )}

         <motion.div 
           className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3"
           variants={containerVariants}
           initial="hidden"
           animate="visible"
         >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[#fcdfa6]"
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
         </motion.div>
      </div>
    </div>
  );
};

export default ChineseTraditional