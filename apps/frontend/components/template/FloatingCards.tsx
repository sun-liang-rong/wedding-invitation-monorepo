'use client'
import { WeddingProps } from "@/types";
import MusicPlayer from "../MusicPlayer";
import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { Great_Vibes, Montserrat, Noto_Serif_SC, Playfair_Display } from "next/font/google";
import { ContentManager } from "@/lib/enhancement/content/ContentManager";
import { useMemo } from "react";

const fontTitle = Playfair_Display({ subsets: ['latin'] });
const fontBody = Noto_Serif_SC({ subsets: ['latin'], weight: ['400', '700'] });
const fontModern = Montserrat({ subsets: ['latin'] });
const fontScript = Great_Vibes({ subsets: ['latin'], weight: ['400'] });

const FloatingCards: React.FC<WeddingProps> = (props) => {
  const defaultContent = useMemo(() => ContentManager.getDefaultContent('card', 'casual'), []);
  const mergedContent = useMemo(() => ContentManager.mergeContent(defaultContent, props.content), [props.content, defaultContent]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6 flex flex-col gap-6 items-center pt-20">
      <MusicPlayer url={props.musicUrl} />
      {/* Title Card */}
      <motion.div 
         initial={{ y: 20, opacity: 0 }} 
         animate={{ y: 0, opacity: 1 }}
         className="w-full max-w-sm bg-white/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl text-center border border-white/50"
      >
         <h1 className={`${fontScript.className} text-5xl text-purple-800`}>Invitation</h1>
      </motion.div>

      {/* Photo Card */}
      <motion.div 
         initial={{ y: 20, opacity: 0 }} 
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.2 }}
         className="w-full max-w-sm bg-white/60 p-2 rounded-3xl shadow-xl rotate-1"
      >
         <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
            <Image src={props.photos[0]} alt="Couple" fill className="object-cover" />
         </div>
      </motion.div>

      {/* Info Card */}
      <motion.div 
         initial={{ y: 20, opacity: 0 }} 
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.4 }}
         className="w-full max-w-sm bg-white/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl text-stone-700 space-y-4 border border-white/50"
      >
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-700"><Calendar size={18}/></div>
            <div>
               <p className="text-xs uppercase opacity-50">When</p>
               <p className="font-bold">{props.weddingDate}</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700"><MapPin size={18}/></div>
            <div>
               <p className="text-xs uppercase opacity-50">Where</p>
               <p className="font-bold">{props.hotelName}</p>
            </div>
         </div>
      </motion.div>

      {/* Invitation Text Card */}
      {mergedContent.coverStory && (
        <motion.div 
           initial={{ y: 20, opacity: 0 }} 
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.6 }}
           className="w-full max-w-sm bg-white/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl text-stone-700 space-y-3 border border-white/50"
           onViewportEnter={() => props.onContentView?.('coverStory')}
        >
           <p className={`${fontBody.className} text-sm leading-relaxed`}>{mergedContent.coverStory}</p>
        </motion.div>
      )}

      {/* Thank You Card */}
      {mergedContent.guestThankYou && (
        <motion.div 
           initial={{ y: 20, opacity: 0 }} 
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.8 }}
           className="w-full max-w-sm bg-gradient-to-br from-purple-100/60 to-pink-100/60 backdrop-blur-xl p-8 rounded-3xl shadow-xl text-center border border-white/50"
           onViewportEnter={() => props.onContentView?.('guestThankYou')}
        >
           <p className={`${fontScript.className} text-2xl text-purple-700 mb-2`}>Thank You</p>
           <p className={`${fontBody.className} text-sm text-stone-600`}>{mergedContent.guestThankYou}</p>
        </motion.div>
      )}
    </div>
  );
};
export default FloatingCards;