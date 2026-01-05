import WeddingInvitation from "@/components/template/WeddingInvitation";
import WeddingStory from "@/components/template/WeddingStory";
import WeddingH5 from "@/components/template/WeddingH5";
import WeddingCard from "@/components/template/WeddingCard";
import ClassicParallax from "@/components/template/ClassicParallax";
import FullScreenSwiper from "@/components/template/FullScreenSwiper";
import PolaroidStack from "@/components/template/PolaroidStack";
import LuxuryGold from "@/components/template/LuxuryGold";
import CinematicFade from "@/components/template/CinematicFade";
import InteractiveMapPath from "@/components/template/InteractiveMapPath";
import ChineseTraditional from "@/components/template/ChineseTraditional";
import FloatingCards from "@/components/template/FloatingCards";
import EnvelopeOpen from "@/components/template/EnvelopeOpen";
function PreviewPage() {
  const propsData = {
    groomName: "张三",
    brideName: "李四",
    weddingDate: "2023-08-15",
    hotelAddress: "北京市海淀区",
    hotelName: "北京酒店",
    mainPhoto: "https://picsum.photos/200/300", // 封面大图 URL
    secondaryPhoto: "https://picsum.photos/300/600", // 第二张照片 URL (可选)
    weddingTime: "14:00", // 婚礼时间
  };
  // 模拟一组画廊照片
  const gallery = [
    "https://picsum.photos/375/1000",
    "https://picsum.photos/375/1000",
    "https://picsum.photos/375/1000",
    "https://picsum.photos/375/1000",
    "https://picsum.photos/375/1000",
  ];
  return (
    <div>
      {/* <WeddingInvitation {...propsData} /> */}
      {/* <WeddingStory {...propsData} /> */}
      {/* <WeddingH5 {...propsData} /> */}
      {/* <WeddingH5
        groomName="张伟"
        brideName="林晓"
        weddingDate="2025.05.20"
        hotelName="W酒店 · 宴会厅"
        hotelAddress="上海市虹口区旅顺路66号"
        // 建议使用 CDN 或者 public 文件夹下的音乐文件
        musicUrl="/wedding-song.mp3"
        // 封面大图
        coverPhoto="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1920"
        // 传入多张图片
        galleryPhotos={gallery}
      /> */}
      <FloatingCards    
        groomName="David"
        brideName="Sarah"
        weddingDate="2025.10.05"
        hotelName="The Ritz-Carlton"
        hotelAddress="123 Coastal Highway, California"
        musicUrl="/love-story.mp3"
        photos={gallery}
      />
    </div>
  );
}

export default PreviewPage;
