# 绿色动态虚线高亮框

点名“动态虚线高亮框”“自定义颜色虚线框”“绿色动态虚线高亮框”“绿色虚线重点框”“透明绿底虚线框”或 `green-dashed-highlight` 时读取本文件，并复用 [逐帧实现](../assets/effects/green-dashed-highlight.mjs)。它适用于教程里需要指出的按钮组、输入框、菜单项、关键参数和结果区域。按用户指定的对象与时段使用。名称中的绿色是默认配色，边框与填充支持独立改色。

## 参考形态与参数

参考中能观察到细的深绿圆角虚线围住目标，框内有低透明度的浅绿色覆盖，原界面文字与按钮保持可读。入场从左上方的小矩形向右下展开，约0.3秒后到达完整范围，随后稳定停留。默认把“动态”落实为框体展开。参考没有提供足以确认持续虚线流动的证据，需要流动时可指定“虚线缓慢流动”。

下表是重建参数，具体数值以实现中的 `GREEN_DASHED_HIGHLIGHT` 为单一来源。录屏压缩、缩放和底图颜色影响取色，参数支持按本期参考微调。

| 项目 | 1920宽画布的起始值 |
| --- | --- |
| 边框 | 深绿 `#2F443A`，2px，圆头虚线 |
| 虚线 | 8px实段、6px间隔 |
| 圆角 | 8px，短边较小时自动收小 |
| 填充 | `#58BF88`，不透明度0.12 |
| 入场 | 0.32秒，左上锚点，宽高同时展开，三次缓出 |
| 停留 | 框体稳定，时长覆盖本次指认、操作与结果阅读 |
| 退出 | 0.12秒淡出，切镜也可指定0秒 |
| 虚线流动 | 默认 `dashSpeed=0`，需要时可用12–20px/秒 |

画幅比例变化时保持框与目标的空间关系。以目标区域外缘为基准留约6–10px呼吸空间，再按实际画面检查。填充覆盖框内区域，画布其余部分透明。边框、填充和原UI同屏核对，避免填充遮住小字。默认采用这一轻量标注，不额外添加放大、光晕、全屏变暗或音效。用户指定这些效果时按当前要求组合。

## 自定义颜色与透明度

用户可指定颜色名或HEX色值。将边框颜色映射到 `style.stroke`，内部填充映射到 `style.fill`。填充不透明度映射到 `style.fillOpacity`，边框不透明度映射到 `style.strokeOpacity`，两者范围均为0–1。入退场的 `opacity` 单独控制整组淡入淡出。

“填充不透明度15%”使用0.15；“能透出85%的底图”也使用0.15。提示词优先明确写“不透明度”，避免不同软件对“透明度”标签的不同解释。单纯换色沿用已选定的展开/停留/虚线流动参数。

| 配色示例 | 边框 | 填充 | 填充不透明度 |
| --- | --- | --- | --- |
| 蓝色 | `#245DA8` | `#76AEF2` | 0.12 |
| 紫色 | `#6750A4` | `#B9A3E3` | 0.15 |
| 橙色 | `#A95C19` | `#F5B56E` | 0.14 |

代码覆盖示例 `style: {stroke: '#6750A4', strokeOpacity: 1, fill: '#B9A3E3', fillOpacity: 0.15, dashSpeed: 16}`。每个项目在实际底图上检查小字与颜色对比。以上是可选配色示例。

调用示例“调用CutStation，重点区域沿用动态虚线高亮框的展开动画，改为蓝色边框和半透明浅蓝底，填充不透明度12%，边框不透明度100%。”精确配色可说“边框#6750A4，填充#B9A3E3，填充不透明度15%，虚线缓慢流动”。

## 逐帧接入

将模块复制到本期工程，例如 `src/effects/green-dashed-highlight.mjs`。函数返回React可直接使用的SVG `rect` 属性，时段外返回 `null`。输入 `time/start/end` 都以秒为单位，`box` 使用目标所在图层的坐标。

Remotion可按以下方式接入，保持所在Sequence的局部帧与这里的起止时间使用同一个时钟。

```jsx
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {getGreenDashedHighlight} from './effects/green-dashed-highlight.mjs';

export function FocusOverlay() {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const rect = getGreenDashedHighlight({
    time: frame / fps,
    start: 1,
    end: 4,
    box: {x: 680, y: 420, width: 450, height: 90},
    scale: width / 1920,
  });
  return (
    <svg viewBox={`0 0 ${width} ${height}`}
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%',
        overflow: 'visible', pointerEvents: 'none'}}>
      {rect && <rect {...rect} />}
    </svg>
  );
}
```

示例坐标需替换为本期实际目标。`scale`只缩放描边、虚线长度与圆角等样式，`box`应已在当前坐标系里。源录屏contain到画布时，先按缩放比和留边偏移换算目标坐标，或者把录屏与SVG置于同一个源尺寸容器共同变换。推近、平移、裁剪时一起处理，避免框与按钮分离。目标本身移动时，逐帧传入更新的 `box`，根据实录设置关键帧或另行完成跟踪。

HTML/HyperFrames也可使用同一函数，将输出设到SVG `rect`上，属性名从驼峰转换为SVG形式，例如 `strokeDasharray`对应 `stroke-dasharray`。由主时间轴传入秒数。Remotion中所有变化用 `frame/fps`驱动，避免以CSS动画或墙钟运行这项效果。需要持续流动时传 `style: {dashSpeed: 16}`，需要直接出现完整框时传 `style: {enterSeconds: 0}`。

选择此效果时，在 `motion_sound_plan` 与 `polish` 的项目状态加入 `green_dashed_highlight` feature。登记目标区域、起止时间、坐标来源与本期覆盖参数。可仅为该局部标注使用内置实现，其他镜头仍依本期计划选择。

## 验收与下次调用

检查入场前、入场中、完整框、目标移动/缩放中和退出后的帧。核对围住了所指对象，背景透出、小字可读、虚线与圆角清楚，未误框相邻控件。检查30/60fps下相同秒数的几何一致，打乱取帧顺序仍得到相同结果。实际预览确认展开速度与停留时间，再对导出短样核对动态。

可以复现这套构成与运动方式。与参考逐像素、逐帧一致需要取得相同底图、准确参数与时间轴，并逐项比对后才能确认。描述完成情况时说明实际验证范围。

用户下次可以直接说“用CutStation做这条视频，重点位置使用绿色动态虚线高亮框，透明绿底，像之前参考那样从左上展开。”也可指明“只在结果区域使用”或“虚线要缓慢流动”。这些称呼都指向本预设。
