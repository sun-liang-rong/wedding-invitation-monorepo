// 默认文案内容库
// Default Content Library for Wedding Invitations

import { ContentConfig, ContentStyle } from '../types';

export const DEFAULT_COVER_STORY = {
  romantic: "在时光的长河中，我们相遇、相知、相爱。今天，我们将携手走进婚姻的殿堂，开启人生新的篇章。",
  modern: "两个人，一个家。从今天起，我们的故事有了新的开始。",
  traditional: "良辰吉日，喜结连理。愿与君共度余生，白首不相离。",
  casual: "我们要结婚啦！这是我们人生中最重要的时刻，希望你能来见证。"
};

export const DEFAULT_LOVE_STORY = {
  meeting: [
    "那是一个平凡的午后，阳光透过咖啡馆的玻璃窗洒在你的脸上。",
    "我端着咖啡走过，不小心撞到了你的肩膀。",
    "你抬起头，我们的目光在空中交汇，那一刻，时间仿佛静止了。"
  ],
  dating: [
    "从那以后，我们开始了无数次的约会。",
    "一起看过的电影，走过的街道，吃过的餐厅，都成为了我们共同的回忆。",
    "每一次相处，都让我更加确定，你就是我要找的那个人。"
  ],
  proposal: [
    "在那个星空璀璨的夜晚，我单膝跪地，向你许下了一生的承诺。",
    "你含着泪水点头的那一刻，是我人生中最幸福的时刻。",
    "从此，我们不再是两个人，而是一个完整的家。"
  ]
};

export const DEFAULT_INVITATION_TEXT = {
  romantic: [
    "始于初见，止于终老",
    "在这温暖的日子里",
    "期待与您共度美好时光",
    "您的到来，是我们最大的幸福"
  ],
  modern: [
    "我们即将开启人生新篇章",
    "诚邀您见证这一刻",
    "分享我们的喜悦",
    "期待您的光临"
  ],
  traditional: [
    "执子之手，与子偕老",
    "琴瑟和鸣，鸾凤相依",
    "恭请莅临，共襄盛举",
    "不胜荣幸"
  ],
  casual: [
    "我们要结婚啦",
    "这个特别的日子",
    "希望你能来参加",
    "一起见证我们的幸福"
  ]
};

export const DEFAULT_WEDDING_EXPECTATION = {
  formal: "诚挚邀请您莅临我们的婚礼现场，见证我们人生中最重要的时刻。您的到来，将是我们最大的荣幸。",
  warm: "在这个特别的日子里，我们希望与最亲爱的家人和朋友分享这份喜悦。期待您的光临，让我们的幸福更加圆满。",
  casual: "我们要结婚啦！希望你能来参加我们的婚礼，一起见证这个美好的时刻。有你在，我们的婚礼才完整。",
  poetic: "良辰美景，佳偶天成。愿与诸君共赏此刻，同证百年之好。"
};

export const DEFAULT_GUEST_THANK_YOU = {
  sincere: "感谢您一路以来的陪伴与支持。在我们人生的重要时刻，能有您的见证，是我们莫大的幸福。",
  heartfelt: "千言万语汇成一句话：谢谢你！谢谢你见证我们的爱情，谢谢你分享我们的喜悦。",
  simple: "感谢有你，让我们的婚礼更加温暖。期待与你共度这美好的一天。",
  traditional: "承蒙厚爱，不胜感激。愿与诸君共享此喜，同庆佳期。"
};

// 根据风格生成完整内容配置
export const generateContentByStyle = (style: ContentStyle): ContentConfig => {
  const styleMap = {
    romantic: {
      coverStory: DEFAULT_COVER_STORY.romantic,
      loveStory: DEFAULT_LOVE_STORY,
      weddingExpectation: DEFAULT_WEDDING_EXPECTATION.warm,
      guestThankYou: DEFAULT_GUEST_THANK_YOU.heartfelt,
    },
    modern: {
      coverStory: DEFAULT_COVER_STORY.modern,
      loveStory: {
        meeting: [
          "我们在一个朋友聚会上相识。",
          "你的笑容和谈吐让我印象深刻。",
          "那天之后，我们开始了频繁的联系。"
        ],
        dating: [
          "我们一起探索这座城市的每个角落。",
          "从咖啡馆到电影院，从公园到海边。",
          "每一次约会都让我们更加了解彼此。"
        ],
        proposal: [
          "在我们相识一周年的那天，我准备了一个惊喜。",
          "当你看到那枚戒指时，眼中闪烁着泪光。",
          "你说'我愿意'的那一刻，我知道我们的未来已经开始。"
        ]
      },
      weddingExpectation: DEFAULT_WEDDING_EXPECTATION.casual,
      guestThankYou: DEFAULT_GUEST_THANK_YOU.simple,
    },
    traditional: {
      coverStory: DEFAULT_COVER_STORY.traditional,
      loveStory: {
        meeting: [
          "月老牵线，天作之合。",
          "初见之时，便觉此生有缘。",
          "一见倾心，再见倾情。"
        ],
        dating: [
          "朝朝暮暮，相伴相随。",
          "春花秋月，共赏美景。",
          "琴瑟和鸣，情深意长。"
        ],
        proposal: [
          "良辰吉日，以诚相许。",
          "愿得一人心，白首不相离。",
          "执子之手，与子偕老。"
        ]
      },
      weddingExpectation: DEFAULT_WEDDING_EXPECTATION.poetic,
      guestThankYou: DEFAULT_GUEST_THANK_YOU.traditional,
    },
    casual: {
      coverStory: DEFAULT_COVER_STORY.casual,
      loveStory: {
        meeting: [
          "我们是在朋友介绍下认识的。",
          "第一次见面就聊得特别投机。",
          "感觉像是认识了很久的老朋友。"
        ],
        dating: [
          "我们喜欢一起做很多事情。",
          "看电影、吃美食、旅行、运动。",
          "每天都有新的快乐和惊喜。"
        ],
        proposal: [
          "在一个普通的周末，我突然决定求婚。",
          "虽然没有精心准备，但我的心意是真诚的。",
          "你笑着说'好啊'，我们就这样决定结婚了。"
        ]
      },
      weddingExpectation: DEFAULT_WEDDING_EXPECTATION.casual,
      guestThankYou: DEFAULT_GUEST_THANK_YOU.simple,
    }
  };

  return {
    ...styleMap[style],
    style,
  };
};

// 导出默认内容
export const DEFAULT_CONTENT: Record<ContentStyle, ContentConfig> = {
  romantic: generateContentByStyle('romantic'),
  modern: generateContentByStyle('modern'),
  traditional: generateContentByStyle('traditional'),
  casual: generateContentByStyle('casual'),
};
