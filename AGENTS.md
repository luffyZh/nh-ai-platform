# AGENTS.md

## 1. Project Overview (项目基础信息)
- **项目名称**：NHY AI 创智平台 - 前端演示版 (Frontend Demo)
- **项目用途**：用于内部高层汇报与交互演示的高保真前端原型。
- **核心约束**：当前为纯前端 Demo，**没有后端接口**。所有页面数据必须使用高质量的 Mock 数据（假数据）进行渲染，确保演示时的视觉丰满度和交互连贯性。

## 2. Tech Stack & Standards (技术栈与代码规范)
- **核心框架**：React 18 + TypeScript 5.x + Vite 5.x
- **UI & 样式**：Tailwind CSS 3.x + Shadcn UI + Lucide React (图标)
- **图表库**：Recharts (用于渲染部门效能大盘的雷达图、柱状图等)
- **状态与路由**：Zustand (用于跨页面状态共享，如“新建创意”后在列表中展示) + React Router v6
- **包管理器**：`pnpm` (严禁使用 npm 或 yarn)
- **规范**：强制使用 React 函数式组件 (Functional Components)；禁止使用 `any` 类型。

## 3. Mock Data Strategy (数据模拟策略)
*为了保证 Demo 的演示效果，请严格遵守以下 Mock 规范：*
- **禁止真实请求**：不要使用 `axios` 或 `fetch` 请求任何外部/真实 API。
- **数据存放**：所有的假数据必须集中存放在 `src/mock/` 目录下，按业务模块划分（如 `ideaMock.ts`, `productMock.ts`）。
- **高质量假数据**：生成假数据时，必须符合真实的业务场景。例如：部门名称必须是“硬件一部、算法中心”；指标名称必须是“打样直通率、延期率”；人名必须是真实的中文姓名（如“张伟、李娜”），**严禁使用 `test1`, `foo`, `bar` 等敷衍词汇**。

## 4. Business Domain Glossary (核心业务字典与 UI 映射)
*在生成组件和 Mock 数据时，请准确映射以下业务概念：*
- **Idea (创意提案)**：对应“创意大盘”列表。新建时需展示一个分步向导 (Wizard) 和类似 ChatGPT 的对话 UI，右侧实时预览 Markdown 格式的 PRD。
- **Product (产品线)**：对应“产品大盘”列表。表格中必须包含“参战部门”的 Tag 标签和“健康度”状态圆点。
- **Phase-Gate (阶段门径)**：在产品详情页中，使用 Tabs 切换不同阶段（原型期/EVT/DVT/MP），展示该阶段必填的文档清单卡片。
- **Metrics (效能指标)**：在“部门效能大盘”中，使用 Recharts 渲染雷达图（展示部门综合能力）和柱状图（展示各项目效能对比）。

## 5. Setup & Commands (环境搭建与执行命令)
- **安装依赖**：`pnpm install`
- **本地开发**：`pnpm run dev`
- **生产构建**：`pnpm run build`

## 6. Working Agreements & Red Lines (协作约定与绝对红线)
- **沟通语言**：默认使用**中文（简体）**进行代码注释和文档输出。
- 🚫 **红线 1：禁止擅自引入 UI 库**。除了 Shadcn UI、Tailwind 和 Recharts，禁止擅自引入 Ant Design、MUI、Element 等其他组件库，以保证 UI 风格绝对统一。
- 🚫 **红线 2：禁止修改基础配置**。绝对不允许修改 `vite.config.ts`、`tailwind.config.js` 等核心配置文件，除非用户明确要求。
- 🚫 **红线 3：页面不能白屏**。在编写复杂组件时，必须做好异常容错处理（如数据为空时的 Empty State 展示），确保在任何点击交互下 Demo 都不会崩溃。
