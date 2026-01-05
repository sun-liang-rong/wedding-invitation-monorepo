# 婚礼请帖模板 JSON 生成

## 输出内容
生成 3 套婚礼请帖模板 JSON：
1. **浪漫长图风** - 经典竖向长图布局，适合移动端
2. **极简海报风** - 简约大气，适合现代审美
3. **清新森系风** - 绿色自然系，清新风格

## 模板结构
```json
{
  "meta": { "id", "name", "description", "thumbnail", "category" },
  "theme": { "colors", "fonts", "borderRadius", "shadows" },
  "sections": [ { "type", "props", "style" } ]
}
```

## Section 类型
- cover - 封面
- couple - 新人信息
- weddingInfo - 婚礼详情
- gallery - 相册
- blessing - 祝福语
- guestbook - 留言板
- footer - 页脚