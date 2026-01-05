# Section 组件实现计划

## 目标
实现4个婚礼请帖 Section 组件：
1. CoverSection - 封面区
2. WeddingInfoSection - 婚礼详情区
3. GallerySection - 相册区
4. BlessingSection - 祝福区

## 约束
- 移动端优先
- 婚礼纪风格（柔和、留白）
- 纯 CSS，不使用 UI 框架
- 每个组件独立文件
- props 由 Renderer 传入

## 输出文件
1. CoverSection.tsx
2. WeddingInfoSection.tsx
3. GallerySection.tsx
4. BlessingSection.tsx

## 组件特点
- 使用 CSS-in-JS（style 对象）
- 支持占位符解析后的 props
- 响应式设计
- 柔和配色、优雅动画