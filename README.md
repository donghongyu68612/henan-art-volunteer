# 🎯 河南艺术生志愿填报助手

> 智能推荐 · 冲稳保分析 · 一键导出 · v2.2

河南艺术生高考志愿填报智能推荐工具。基于近三年录取数据，为美术与设计类等六大艺术专业考生提供冲/稳/保分层推荐、院校对比、志愿方案管理等功能。

**技术栈：** 纯静态 HTML + CSS + JavaScript · PWA 离线支持 · ECharts 图表

---

## 目录

- [快速开始](#快速开始)
- [功能概览](#功能概览)
- [数据格式](#数据格式)
- [架构说明](#架构说明)
- [API 参考](#api-参考)
- [部署](#部署)
- [开发](#开发)

---

## 快速开始

本项目是纯静态前端应用，无需构建步骤：

```bash
# 直接双击打开
open index.html

# 或启动本地服务器
python -m http.server 8080
```

**浏览器要求：** 现代浏览器（Chrome / Edge / Firefox），建议使用 Chrome 以获得最佳 PWA 体验。

---

## 功能概览

| 功能 | 页面 | 说明 |
|------|------|------|
| 智能推荐 | 首页 | 输入统考分 + 文化分，系统计算综合分 → 匹配院校并分层 |
| 院校列表 | 推荐页 | 冲/稳/保三级筛选，按批次过滤，录取概率进度条 |
| 院校详情 | 详情弹窗 | 近三年分数线趋势图（ECharts）、招生信息、录取评估 |
| 院校对比 | 对比页 | 最多 4 所院校并排对比，总分对比柱状图 |
| 志愿方案 | 方案页 | 冲/稳/保分层管理，支持导出 PDF / 复制文本 |
| 辅助工具 | 工具页 | 综合分计算器、同位分换算器、院校地区分布地图 |
| 数据管理 | 关于页 | CSV 批量导入/导出/恢复默认数据 |
| PWA 离线 | — | Service Worker 缓存静态资源，可安装到桌面 |

### 综合分计算公式

<!-- AUTO-GENERATED: formulas from DB -->
| 专业类别 | 公式 |
|----------|------|
| 美术与设计类 | 专业×1.25 + 文化×0.5 |
| 音乐类 | 专业×1.25 + 文化×0.5 |
| 舞蹈类 | 专业×1.25 + 文化×0.5 |
| 播音与主持类 | 专业×1.0 + 文化×0.667 |
| 表（导）演类 | 专业×1.25 + 文化×0.5 |
| 书法类 | 专业×1.25 + 文化×0.5 |
<!-- AUTO-GENERATED -->

### 推荐算法

- **冲刺（Chong）：** 院校综合分高于用户综合分 > 5 分，录取概率 10%~40%
- **稳妥（Wen）：** 院校综合分在用户综合分 ±5 分范围内，录取概率 50%~75%
- **保底（Bao）：** 院校综合分低于用户综合分 > 5 分，录取概率 85%~98%

---

## 数据格式

### 内置数据：95 所院校

涵盖河南省内 30 所公办/民办院校 + 全国 65 所重点/艺术类院校，含 2023–2025 三年录取数据。

### CSV 导入格式

```csv
院校名称,城市,类型,批次,专业,计划数,2025综合分,2024综合分,2023综合分
郑州大学,郑州,公办,本科A段,视觉传达设计,85,550,542,535
河南大学,开封,公办,本科A段,美术学,120,535,530,522
```

### 院校数据字段

```typescript
interface School {
  id: number;
  name: string;           // 院校名称
  city: string;           // 所在城市
  region: string;         // 地区分组（河南省内/华东/华北/...）
  type: '公办' | '民办';  // 办学类型
  level?: string;         // 院校层次（985/211/双一流）
  batch: string;          // 录取批次（提前批/本科A段/本科B段）
  majors: string[];       // 招生专业列表
  planCount: number;      // 计划招生人数
  tuition: string;        // 学费
  desc: string;           // 院校简介
  tags: string[];         // 标签（公办/211/985/双一流/美院/民办）
  scores: {
    [year: string]: {     // year: "2023" | "2024" | "2025"
      prof: number;       // 专业录取分
      culture: number;    // 文化录取分
      total: number;      // 综合录取分
    };
  };
}
```

---

## 架构说明

### 文件结构

```
henan-art-volunteer/
├── index.html          # 主应用（HTML + CSS + JS 全量内联）
├── sw.js               # Service Worker（离线缓存策略）
├── manifest.json       # PWA 配置清单
└── icons/              # PWA 图标（72–512px SVG）
    ├── icon-72.svg
    ├── icon-96.svg
    ├── icon-128.svg
    ├── icon-144.svg
    ├── icon-152.svg
    ├── icon-192.svg
    ├── icon-384.svg
    └── icon-512.svg
```

> **注意：** 所有代码在单个 `index.html` 文件中（约 1390 行），包含 CSS 样式、HTML 结构和 JavaScript 逻辑。无需包管理器或构建工具。

### 代码结构（index.html）

| 区域 | 行范围 | 说明 |
|------|--------|------|
| CSS 样式 | 18–158 | 响应式样式，CSS 变量主题 |
| HTML 页面 | 159–389 | 6 个页面 + 底部导航 |
| **DB 数据层** | ~392–809 | 模拟数据（API 替换入口） |
| **App 应用层** | ~810–1385 | 主应用逻辑 |

### 数据流

```
用户输入 (分数/科类)
   ↓
app.recommend() ──→ DB.schools (95所院校)
   ↓
computeProb() ──→ 计算录取概率 + 冲/稳/保判定
   ↓
renderSchools() ──→ 渲染推荐卡片列表
   ↓
用户操作 (收藏/对比/加入方案)
   ↓
localStorage 持久化 \_ 方案数据保存
```

### Service Worker 缓存策略

| 资源 | 策略 | 说明 |
|------|------|------|
| `index.html` | Network Only | 始终从服务器获取最新版本 |
| 其他静态资源 | Cache First | 缓存优先，网络兜底 |
| 版本管理 | `v4` | 版本号递增触发 SW 更新 |

---

## API 参考

### DB 数据层（API 替换入口）

<!-- AUTO-GENERATED: DB methods -->

| 方法 | 说明 | 参数 |
|------|------|------|
| `DB.getSchoolsByRegion()` | 按地区分组院校 | — |
| `DB.searchSchools(keyword, filters)` | 搜索院校 | `keyword: string`, `filters: {batch?, region?, type?}` |
| `DB.getSchool(id)` | 获取单个院校详情 | `id: number` |
| `DB.fetchAll()` | 远程加载数据（可替换为真实 API） | — |

> **替换真实 API：** 修改 `DB.fetchAll()` 方法，将注释掉的 `fetch('/api/schools')` 替换为真实后端地址。

<!-- AUTO-GENERATED -->

### App 应用层

<!-- AUTO-GENERATED: app methods -->

| 方法 | 说明 | 触发方式 |
|------|------|----------|
| `app.recommend()` | 智能推荐入口 | 点击「智能推荐院校」按钮 |
| `app.nav(pageId)` | 页面导航 | 底部导航栏点击 |
| `app.renderSchools()` | 渲染推荐列表 | 推荐/筛选时自动调用 |
| `app.toggleFav(id)` | 切换收藏 | ♡ 按钮 |
| `app.toggleCompare(id)` | 切换对比 | ⚖ 对比按钮 |
| `app.addToPlan(id)` | 加入志愿方案 | ＋加入按钮 |
| `app.exportPDF()` | 导出 PDF 方案 | 方案页「导出PDF」按钮 |
| `app.exportText()` | 复制方案文本 | 方案页「复制文本」按钮 |
| `app.importData()` | CSV 导入院校 | 关于页「导入数据」按钮 |
| `app.exportData()` | CSV 导出院校 | 关于页「导出数据」按钮 |
| `app.calcTool()` | 综合分计算 | 工具页「计算」按钮 |
| `app.calcEquivalent()` | 同位分换算 | 工具页「换算」按钮 |

<!-- AUTO-GENERATED -->

---

## 部署

本项目为纯静态网站，可部署到任何静态托管服务：

### GitHub Pages

```bash
git checkout gh-pages
git merge main
git push origin gh-pages
```

### 其他平台

| 平台 | 步骤 |
|------|------|
| Vercel | 导入项目 → 自动识别 |
| Netlify | 拖放 `index.html` 到部署区 |
| 任意 Web 服务器 | 复制所有文件到 `www/` 目录 |

---

## 开发

### 修改院校数据

编辑 `index.html` 中的 `DB.schools` 数组：

```javascript
const DB = {
  schools: [
    {
      id: 96,
      name: "新院校",
      city: "城市",
      region: "地区分组",
      type: "公办",
      batch: "本科A段",
      majors: ["专业1", "专业2"],
      planCount: 50,
      tuition: "8000元/年",
      desc: "院校简介",
      tags: ["公办"],
      scores: {
        "2025": { prof: 240, culture: 420, total: 510 },
        "2024": { prof: 238, culture: 415, total: 505 },
        "2023": { prof: 235, culture: 408, total: 498 }
      }
    }
  ]
};
```

### 添加新页面

1. 在 HTML 中添加 `<div id="page-xxx" class="page">...</div>`
2. 在底部导航 `<nav>` 中添加对应按钮
3. 在 `app` 对象中添加对应的渲染方法

### 替换为真实后端 API

```javascript
// 在 DB.fetchAll() 中：
async fetchAll() {
  const res = await fetch('https://your-api.com/schools');
  return res.json();
}
```

---

## 重要声明

本工具数据来源于公开渠道整理，仅供填报参考。最终志愿请以 **《招生考试之友》** 和 **河南省教育考试院官网** 公布为准。
