# 🎯 河南艺术生志愿填报助手

> 河南艺术类高考志愿填报智能推荐工具 — 冲稳保分析 · 院校对比 · 一键导出PDF

## ✨ 功能

- **智能推荐** — 输入专业分和文化分，按「冲·稳·保」分层推荐院校
- **综合分计算** — 支持文5专5、文6专4、文7专3、文8专2、仅文化 五种公式
- **院校对比** — 最多对比4所院校，ECharts 图表直观展示
- **志愿方案** — 分层管理志愿，支持导出PDF/复制文本
- **数据管理** — CSV导入/导出，支持自定义院校数据
- **PWA 离线支持** — 可安装到桌面，离线使用

## 🚀 快速部署

### Vercel（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdonghongyu68612%2Fhenan-art-volunteer)

或手动部署：

```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages

1. 在仓库 Settings → Pages 中开启
2. 选择部署分支（main）
3. 无需额外配置（已包含 `.nojekyll`）

### 本地运行

```bash
# 用任意静态服务器启动
npx serve .
# 或 Python
python -m http.server 8080
# 或 Node.js
npx http-server . -p 8080
```

## 🔧 开发

```bash
# 安装依赖（仅用于图标生成）
npm install

# 生成 PWA 图标（从 SVG 生成 PNG）
node scripts/generate-icons.js

# 构建（压缩 HTML/CSS/JS）
node scripts/build.js
```

## 📁 项目结构

```
├── index.html          # 主应用（单页HTML）
├── sw.js               # Service Worker（离线缓存）
├── manifest.json       # PWA 配置
├── vercel.json         # Vercel 部署配置
├── .nojekyll           # GitHub Pages 配置
├── icons/              # PWA 图标（SVG + PNG）
│   ├── icon-*.svg
│   └── icon-*.png
└── scripts/
    ├── build.js        # 构建压缩脚本
    └── generate-icons.js # 图标生成脚本
```

## ⚠️ 数据声明

内置 95 所院校模拟数据（含近三年录取分数线），仅供参考。
最终志愿请以 **《招生考试之友》** 和 **河南省教育考试院官网** 公布为准。

## 📄 许可

MIT
