const labels = {
  en: {
    original: "Original PDF", notes: "Reading notes", downloads: "Source downloads",
    presentation: "Paper presentation", choose: "Choose a slide", readAll: "Read all",
    present: "Present", fullscreen: "Fullscreen", exitFullscreen: "Exit fullscreen",
    fullImage: "Open full-size image", steps: "Method steps", keyboard: "Use ← → to navigate",
    previous: "Previous", previousLabel: "Previous slide", next: "Next", nextLabel: "Next slide",
    back: "Back to", slides: "slides", expanded: "Expanded presentation. Press Escape to exit.",
  },
  "zh-CN": {
    original: "论文原文", notes: "学习笔记", downloads: "原始文件下载",
    presentation: "文献汇报", choose: "选择汇报页", readAll: "连续阅读",
    present: "逐页汇报", fullscreen: "全屏", exitFullscreen: "退出全屏",
    fullImage: "查看原尺寸图片", steps: "方法步骤", keyboard: "使用 ← → 翻页",
    previous: "上一页", previousLabel: "上一页", next: "下一页", nextLabel: "下一页",
    back: "返回", slides: "页", expanded: "汇报已展开，按 Esc 退出。",
  },
};

export function presentationLabels(language: string) {
  return labels[language === "zh-CN" ? "zh-CN" : "en"];
}
