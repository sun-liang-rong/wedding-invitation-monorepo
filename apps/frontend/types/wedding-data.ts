/**
 * WeddingData Schema - 婚礼请帖统一数据结构
 * 所有模板都使用这个统一的数据结构
 */

export interface PersonInfo {
  name: string;
  avatar?: string;
  bio?: string;
  intro?: string;
}

export interface EventInfo {
  date: string;
  time: string;
  venue: string;
  address: string;
  mapUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface GalleryImage {
  url: string;
  thumbUrl?: string;
  caption?: string;
}

export interface GuestBookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  avatar?: string;
}

export interface WeddingData {
  meta: {
    id: string;
    templateId: string;
    createdAt: string;
    updatedAt: string;
  };
  couple: {
    groom: PersonInfo;
    bride: PersonInfo;
  };
  event: {
    primary: EventInfo;
    secondary?: EventInfo;
  };
  cover: {
    image: string;
    video?: string;
  };
  gallery: {
    images: GalleryImage[];
    layout: 'grid' | 'carousel' | 'masonry';
  };
  blessing: {
    text: string;
    author?: string;
  };
  guestbook: {
    enabled: boolean;
    entries: GuestBookEntry[];
  };
  rsvp: {
    enabled: boolean;
    deadline?: string;
    contact?: string;
  };
}

/**
 * 创建默认的 WeddingData
 */
export function createDefaultWeddingData(): WeddingData {
  return {
    meta: {
      id: '',
      templateId: 'romantic',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    couple: {
      groom: {
        name: '新郎',
        bio: '温柔体贴，才华横溢',
      },
      bride: {
        name: '新娘',
        bio: '美丽大方，善良可爱',
      },
    },
    event: {
      primary: {
        date: '2026年1月18日',
        time: '11:30',
        venue: '幸福酒店',
        address: '北京市朝阳区幸福路88号',
      },
    },
    cover: {
      image: '',
    },
    gallery: {
      images: [],
      layout: 'grid',
    },
    blessing: {
      text: '感谢您见证我们的幸福时刻！',
    },
    guestbook: {
      enabled: true,
      entries: [],
    },
    rsvp: {
      enabled: true,
    },
  };
}
