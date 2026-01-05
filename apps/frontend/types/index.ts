export interface WeddingProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  hotelName: string;
  hotelAddress: string;
  musicUrl?: string;     // 背景音乐
  photos: string[];      // 照片数组 (建议传入至少5张)
  
  // 内容增强（可选）
  content?: {
    coverStory?: string;
    invitationText?: string[];
    loveStory?: {
      meeting?: string[];
      dating?: string[];
      proposal?: string[];
    };
    weddingExpectation?: string;
    guestThankYou?: string;
  };
  
  // 动画配置（可选）
  animation?: {
    disabled?: boolean;
    timing?: {
      stagger?: number;
      duration?: number;
    };
  };
  
  // 埋点回调（可选）
  onContentView?: (sectionId: string) => void;
  onAnimationComplete?: (animationId: string) => void;
  onScrollProgress?: (progress: number) => void;
}