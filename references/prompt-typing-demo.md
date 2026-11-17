# 提示词输入演示

点名“提示词输入演示”“对话框打字效果”“输入框逐字输入”或 `prompt-typing-demo` 时读取本文件，使用 [逐帧文本实现](../assets/effects/prompt-typing.mjs)。适用于在生成教程中清楚告诉观众要输入的完整提示词。用户提供的提示词是待展示的文字，按原文显示。

## 参考与默认呈现

参考是深色背景上的圆角卡片，顶部有应用图标与短说明，内部是浅色大输入区。文字从左上逐步输入，自然换行，细竖光标跟随末尾，完整输入后显示可发送状态并保留阅读时间。卡片进入可用0.18秒淡入/小幅上移，当前项目已有真实界面时跟随其样式。

输入演示可使用真实录屏，或绘制用于说明的输入卡片。绘制卡片时在制作记录登记示意身份。只有真实执行有证据时，才把其后结果表述为本次操作的实际产物。此次输入动画本身只展示文字。

提示词原文、大小写、标点、空格、换行、网址、参数、反斜线均保留。以Unicode字素簇逐步显示，中文字符、组合重音、emoji家庭/肤色序列不在中间拆开。最终文本必须与输入原文一致。复制提示词供观众使用时交付完整TXT或可复制正文。

以完整提示词为配置数据，预先分字，再由 `time=frame/fps`计算当前可见部分。避免setTimeout、CSS typing、墙钟和随机键入造成跳帧、拖动与导出不一致。直贴模式可设 `typingSeconds=0`。参考中英文短命令约2–3秒输入完，可用该时长起步；长提示词按实际可读性分段或延长，不把数百字强塞进2秒。

输入框先按完整文本估算布局，保持尺寸稳定。用 `white-space: pre-wrap` 与 `overflow-wrap: anywhere`，长网址/中英文混排都能换行。内容过长时分步骤卡片、自动增高或滚动，但完整内容仍需展示并在结尾提供可复制原文。需要读完时通常留2–4秒，随文本长度延长。

## 接入

在组件之外或 `useMemo` 中为固定提示词创建采样函数，配置变化后重建。渲染中采样它，文本与光标置于同一流式容器，光标紧跟当前末尾。

```jsx
import {createPromptTyping} from './effects/prompt-typing.mjs';

const prompt = '请根据上传的资料制作一份10页演示文稿。\n先给出大纲，再生成内容。';
const samplePrompt = createPromptTyping({
  text: prompt,
  start: 0.4,
  typingSeconds: 3,
  holdSeconds: 3,
  cursorBlinkSeconds: 0.8,
});

// Inside the frame-driven composition:
const state = samplePrompt(frame / fps);
// Use the real loaded body font and enough width/height for this prompt.
// <div style={{whiteSpace: 'pre-wrap', overflowWrap: 'anywhere'}}>
//   {state?.text}
//   {state && <span style={{opacity: state.cursorVisible ? 1 : 0}}>│</span>}
// </div>
// state.sendEnabled drives the illustrated button's enabled appearance.
```

`start`是文字开始输入的时间。总可见时间为 `typingSeconds + holdSeconds`，时间区间外返回 `null`。`cursorBlinkSeconds`是一轮闪烁周期，输入中保持光标可见，结束后按周期闪烁。`sendEnabled`只负责样式。按用户要求可在结束后隐藏光标，或另外添加明确的点击发送动作。

按本期需求覆盖应用名称、图标、输入卡片尺寸、明暗主题、边框/背景色、字体/字号、提示词、输入时长、停留时长及光标颜色。应用图标取实际提供或已授权资源，单纯展示提示词时可使用通用卡片。键盘音效按本期声音要求选择。

登记 `prompt_typing` feature，记录原文来源、输入窗口、阅读窗口、真实/示意身份与可复制提示词产物。

## 调用与验收

调用示例“调用CutStation，在讲到生成步骤时加入‘提示词输入演示’，使用深色卡片、浅色输入框，把下面这段提示词逐字输入，3秒打完，完成后停留4秒供观众阅读，带跟随光标。”随后提供完整提示词。也可说“这段用粘贴式出现，不逐字打字”“卡片改成浅色主题”“按原文保留换行，不加键盘声”。

检查空文本、中文、英文、换行、emoji和长网址，最终显示与原文一致。比较相同秒数在30/60fps与乱序取帧中的输出。看初始空框、输入中、换行后、完整提示词和结束帧，检查光标在末尾，文字无裁切，卡片没有因逐字输入持续改变尺寸。实际预览核对速度与阅读停留。
