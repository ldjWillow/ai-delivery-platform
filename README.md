# AI 软件交付平台 · React 脚手架

基于 Vite + React + Ant Design 的**交付控制台前端脚手架**（假数据可交互演示）。可复用侧栏分组、顶栏项目切换、⌘K 命令面板、模块路由与主题 token。

## 技术栈

- Vite 8 + React 19 + TypeScript
- Ant Design 6 + `@ant-design/icons` + `@ant-design/charts`
- React Router 7

## 快速开始

```bash
npm install
npm run dev
```

打开 http://localhost:5173/

```bash
npm run build
npm run preview
```

## 模块路由

| 模块 | 路径 |
|------|------|
| 项目总览 | `/` |
| 流水线 | `/pipelines` |
| AI Agent | `/agent` |
| 构建中心 | `/builds` |
| 部署中心 | `/deploys` |
| 环境管理 | `/environments` |
| 版本管理 | `/versions` |
| 日志中心 | `/logs` |
| 审批中心 | `/approvals` |
| 告警中心 | `/alerts` |
| 系统设置 | `/settings` |

## 目录结构

```
src/
  layouts/AppLayout.tsx   # 壳层：侧栏分组、顶栏、命令面板
  components/             # 通用 UI + CommandPalette
  pages/                  # 各业务页（mock 数据）
  mock/data.ts            # 假数据
  theme.ts                # Ant Design 主题
  styles / index.css      # 壳层与语义色
```

## 当作脚手架使用

1. Fork / Clone 本仓库后改 `package.json` 的 `name`
2. 替换 `src/mock/data.ts` 与页面文案
3. 在 `App.tsx` 增减路由；侧栏菜单在 `AppLayout.tsx`
4. 对接真实 API 时，把 mock 换成 service 层即可

## 说明

- 当前为前端演示，**未对接**真实 GitHub / Actions / Coolify / Agent
- Secret 仅掩码展示；审批 / 回滚等为前端交互闭环

## License

MIT（可按需修改）
