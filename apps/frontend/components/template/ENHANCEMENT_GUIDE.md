# 婚礼请帖组件增强指南

## 概述

所有婚礼请帖组件已经过增强，支持以下三个维度的定制：

1. **内容增强** - 丰富的情感化文案
2. **图片结构** - 更多照片和更好的布局
3. **动画交互** - 流畅的动画和智能交互模式

## 向后兼容

所有增强功能都是**可选的**，现有代码无需修改即可继续工作：

```tsx
// 旧的使用方式（仍然有效）
<WeddingCard
  groomName="张三"
  brideName="李四"
  weddingDate="2026年6月20日"
  hotelName="XX酒店"
  hotelAddress="XX市XX区XX路XX号"
  musicUrl="/music.mp3"
  photos={photos}
/>
```

## 内容增强

### 1. WeddingCard 组件

适合：卡片滑动型请帖

```tsx
<WeddingCard
  groomName="张三"
  brideName="李四"
  weddingDate="2026年6月20日"
  hotelName="XX酒店"
  hotelAddress="XX市XX区XX路XX号"
  musicUrl="/music.mp3"
  photos={photos}
  
  // 内容增强
  content={{
    // 封面故事（1-2句话）
    coverStory: "在时光的长河中，我们相遇、相知、相爱。今天，我们将携手走进婚姻的殿堂。",
    
    // 邀请文案（2-4段）
    invitationText: [
      "始于初见，止于终老",
      "在这温暖的日子里",
      "期待与您共度美好时光",
      "您的到来，是我们最大的幸福"
    ],
    
    // 婚礼期待（1-2句话）
    weddingExpectation: "这一天，我们将在最爱的人面前，许下一生的誓言。",
    
    // 感谢语（1-2句话）
    thankYouMessage: "感谢您一路以来的陪伴与支持，期待您的光临。"
  }}
  
  // 埋点回调
  onContentView={(sectionId) => {
    console.log('用户查看了:', sectionId);
  }}
/>
```

### 2. WeddingStory 组件

适合：叙事型请帖，需要讲述完整的爱情故事

```tsx
<WeddingStory
  groomName="张三"
  brideName="李四"
  weddingDate="2026年6月20日"
  weddingTime="12:08 PM"
  hotelName="XX酒店"
  hotelAddress="XX市XX区XX路XX号"
  mainPhoto="/cover.jpg"
  secondaryPhoto="/hotel.jpg"
  
  // 内容增强
  content={{
    // 封面故事
    coverStory: "在时光的长河中，我们相遇、相知、相爱。",
    
    // 爱情故事（分为三个阶段，每个阶段2-3段）
    loveStory: {
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
        "你含着泪水点头的那一刻，是我人生中最幸福的时刻。"
      ]
    },
    
    // 婚礼期待
    weddingExpectation: "现在，我们即将步入婚姻的殿堂。在这个特别的日子里，我们希望与最亲爱的家人和朋友分享这份喜悦。",
    
    // 感谢语
    guestThankYou: "感谢您一路以来的陪伴与支持。在我们人生的重要时刻，能有您的见证，是我们莫大的幸福。"
  }}
  
  // 埋点回调
  onContentView={(sectionId) => {
    console.log('用户查看了:', sectionId);
  }}
  onScrollProgress={(progress) => {
    console.log('滚动进度:', progress);
  }}
/>
```

### 3. ClassicParallax 组件

适合：相册型请帖，视觉效果为主

```tsx
<ClassicParallax
  groomName="张三"
  brideName="李四"
  weddingDate="2026年6月20日"
  hotelName="XX酒店"
  hotelAddress="XX市XX区XX路XX号"
  musicUrl="/music.mp3"
  photos={photos} // 建议6-8张照片
  
  // 内容增强
  content={{
    // 邀请文案（诗意风格，2-4段）
    invitationText: [
      "执子之手，与子偕老",
      "琴瑟和鸣，鸾凤相依",
      "在这个美好的日子里",
      "我们诚挚邀请您见证我们的幸福时刻"
    ],
    
    // 感谢语
    guestThankYou: "感谢您一路以来的陪伴与支持，期待您的光临。"
  }}
/>
```

## 动画配置

所有组件都支持动画配置（可选）：

```tsx
<WeddingCard
  {...baseProps}
  
  // 动画配置
  animation={{
    // 禁用动画（用于测试或低性能设备）
    disabled: false,
    
    // 时序配置
    timing: {
      stagger: 200,  // 交错延迟（毫秒）
      duration: 800, // 动画时长（毫秒）
    }
  }}
  
  // 动画完成回调
  onAnimationComplete={(animationId) => {
    console.log('动画完成:', animationId);
  }}
/>
```

## 文案风格建议

### 浪漫风格（Romantic）
- 温柔、诗意、充满情感
- 适合：WeddingCard、WeddingStory
- 示例："在时光的长河中，我们相遇、相知、相爱"

### 现代风格（Modern）
- 简洁、直接、温暖
- 适合：所有组件
- 示例："两个人，一个家。从今天起，我们的故事有了新的开始"

### 传统风格（Traditional）
- 典雅、庄重、文言
- 适合：ClassicParallax、ChineseTraditional
- 示例："良辰吉日，喜结连理。愿与君共度余生，白首不相离"

### 轻松风格（Casual）
- 亲切、自然、口语化
- 适合：年轻人群体
- 示例："我们要结婚啦！希望你能来见证这个美好的时刻"

## 图片建议

### WeddingCard（5张）
1. 封面图（主视觉）
2. 邀请页图片（情侣照）
3. 详情页图片（婚礼场景）
4-5. 相册图片

### WeddingStory（2-4张）
1. 主图（封面）
2. 副图（酒店或场景）
3-4. 可选的故事配图

### ClassicParallax（6-8张）
1. 封面图
2-8. 相册图片（建议多样化：特写、全景、场景）

## 埋点和分析

所有组件都支持埋点回调，用于追踪用户行为：

```tsx
<WeddingCard
  {...baseProps}
  
  // 内容查看埋点
  onContentView={(sectionId) => {
    // 发送到分析平台
    analytics.track('content_view', {
      section: sectionId,
      timestamp: Date.now()
    });
  }}
  
  // 动画完成埋点
  onAnimationComplete={(animationId) => {
    analytics.track('animation_complete', {
      animation: animationId
    });
  }}
  
  // 滚动进度埋点（仅 WeddingStory）
  onScrollProgress={(progress) => {
    if (progress > 0.5 && !hasTrackedHalfway) {
      analytics.track('scroll_halfway');
      setHasTrackedHalfway(true);
    }
  }}
/>
```

## 最佳实践

### 1. 内容长度
- 封面故事：1-2句话（50-100字）
- 邀请文案：2-4段，每段10-20字
- 爱情故事：每个阶段2-3段，每段20-40字
- 感谢语：1-2句话（30-60字）

### 2. 情感递进
- 开始：温暖、期待
- 中间：回忆、叙事
- 结尾：感谢、祝福

### 3. 避免的问题
- ❌ 文案过长，影响阅读体验
- ❌ 技术化语言，缺乏情感
- ❌ 单句文案，没有节奏感
- ❌ 过于正式或过于随意

### 4. 推荐做法
- ✅ 使用短句，易于阅读
- ✅ 情感真挚，避免套话
- ✅ 分段呈现，有节奏感
- ✅ 根据受众选择合适风格

## 性能优化

组件已内置性能优化：

1. **图片懒加载** - 非首屏图片延迟加载
2. **动画优化** - 使用 GPU 加速的 transform 和 opacity
3. **响应式图片** - 根据设备加载合适尺寸
4. **降级策略** - 低性能设备自动禁用非关键动画

## 浏览器兼容性

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+
- 移动端浏览器（iOS Safari 14+, Chrome Mobile）

## 问题反馈

如有问题或建议，请联系开发团队。
