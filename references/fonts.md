# 内嵌字体与选择

字体随本skill保存在 `assets/fonts/`，不依赖系统曾安装什么。首次使用复制到本期工程的可服务资源目录；打包工程时连同对应OFL许可证复制，不把个人机器绝对路径或外部软链接当永久依赖。文件版本、来源、大小与SHA-256见该目录的 `manifest.json`。

| 字体 | 默认用途 | 文件 |
| --- | --- | --- |
| **得意黑 Smiley Sans** | 首选钩子、大标题、关键词、适合的短字幕；窄斜字形有设计感 | `SmileySans-Oblique.ttf`，网页可选 `SmileySans-Oblique.ttf.woff2` |
| Noto Sans SC | 中文正文、密集信息、需要长时间阅读的字幕和操作说明 | `NotoSansSC-Variable.ttf`，可变字重100–900 |
| Space Grotesk | 英文标题、数字、少量科技感标签；不覆盖中文 | `SpaceGrotesk-Variable.ttf`，可变字重300–700 |
| **站酷庆科黄油体 ZCOOL QingKe HuangYou** | “双端互通”参考同款窄长圆角标题、荧光笔下划线标题、短关键词 | `ZCOOLQingKeHuangYou-Regular.ttf`，常规字重400 |

## “双端互通”同款字体

按参考里的“双端互通”和“人不在电脑边”逐字形比对，匹配字体为**站酷庆科黄油体**。圆角端点、窄长字面、“双”的交叉结构、“端”的分离笔画和“通”的圆点与内孔均匹配。此结论来自画面字形比对，参考录屏没有字体元数据。

点名“双端互通同款字体”“黄油体”或“站酷庆科黄油体”时，使用本包里的真实字体文件。它可单独用于其他标题文字，也可与 [荧光笔下划线标题](marker-underline-title.md) 组合。用常规400字重、正常字形，不额外合成粗体或倾斜。默认按自然字宽排版，根据本期最长标题检查字号、间距与换行。它是可选标题字体，选择时仍按本期控制实际字体家族数量。

本文件新增字体于2026-11-11从Google Fonts官方仓库取得，版本为1.000，许可证为SIL OFL 1.1。字体与原始许可均已内嵌，文件哈希见manifest。引用工程时把真实文件与许可证一起复制，等待字体载入后再测量标题。调用示例“章节标题使用‘双端互通’同款的站酷庆科黄油体，标题文字改成‘自动生成’，不加下划线”。

得意黑原字形已倾斜，不额外叠CSS italic/skew。标题优先它，密集正文可选Noto Sans SC；不强求所有字都用展示字体。一片最多三种家族，同级统一，字幕不随每条变化。第三款是可选角色，不要求每片用满三款。

## 实际加载，防止字体回落

网页/Remotion路线将字体复制到 `public/fonts/` 后建立本地 `@font-face`；路径按当前框架资源基准调整。不要仅设置 `font-family: 得意黑` 便声称用到它。

```css
@font-face {
  font-family: "Smiley Sans Local";
  src: url("/fonts/SmileySans-Oblique.ttf.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "Noto Sans SC Local";
  src: url("/fonts/NotoSansSC-Variable.ttf") format("truetype");
  font-weight: 100 900;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "ZCOOL QingKe HuangYou Local";
  src: url("/fonts/ZCOOLQingKeHuangYou-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "Space Grotesk Local";
  src: url("/fonts/SpaceGrotesk-Variable.ttf") format("truetype");
  font-weight: 300 700;
  font-style: normal;
  font-display: block;
}
```

实际渲染前等待所用引擎的字体加载机制完成。验证资源响应成功、`document.fonts.load()`能载入指定字形，并检查最长中文/英文混排、问叹号、数字、标题放大中间帧、字幕边界和手机小图；`document.fonts.check()`本身不证明每个字符都有正确字形。HyperFrames使用本地相对资源或受支持的打包路径，再实查预览，不能假定自动字体服务包含得意黑。

剪映原生字幕若需相同字体，先核对当前UI是否可见并实际选中；需要系统安装时才在本机安装该真实文件，不把“包内有字体”当成剪映已识别。剪映配音不依赖字体安装完成。

## 来源与许可

字体与各自的原始许可证一同内嵌，官方来源如下。获取日期、版本和文件哈希见manifest。

- [得意黑官方发布 v2.0.1](https://github.com/atelier-anchor/smiley-sans/releases/tag/v2.0.1)，`SmileySans-OFL.txt`
- [Google Fonts Noto Sans SC](https://github.com/google/fonts/tree/e7db6ca603fd4862010383ff17ffd6cc4ffac1c0/ofl/notosanssc)，`NotoSansSC-OFL.txt`
- [Google Fonts Space Grotesk](https://github.com/google/fonts/tree/e7db6ca603fd4862010383ff17ffd6cc4ffac1c0/ofl/spacegrotesk)，`SpaceGrotesk-OFL.txt`
- [Google Fonts ZCOOL QingKe HuangYou](https://github.com/google/fonts/tree/main/ofl/zcoolqingkehuangyou)，`ZCOOLQingKeHuangYou-OFL.txt`，新增获取日期2026-11-11

以上字体按SIL Open Font License 1.1随包再分发，保留版权及许可。增加其他字体时也保存官方来源、版本、实际文件和许可；不把来源不明的“免费字体”直接内嵌，不把系统商业字体复制入此包。
