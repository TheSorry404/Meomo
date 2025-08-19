# Meomo 项目结构说明

## 项目概述

Meomo 是一个现代化的备忘录 Web 应用，基于 Nuxt 3 + Vue 3 + TypeScript 构建，提供云端同步的备忘录管理功能。

## 技术栈

### 前端框架
- **Nuxt 3** - Vue.js 全栈框架
- **Vue 3** - 响应式前端框架
- **TypeScript** - 类型安全的 JavaScript
- **Ant Design Vue** - UI 组件库
- **Pinia** - 状态管理
- **UnoCSS** - 原子化 CSS 框架

### 开发工具
- **ESLint** - 代码检查
- **Vite** - 构建工具
- **PostCSS** - CSS 处理

## 项目结构

```
meomo/
├── app/                    # 应用核心
│   └── app.vue            # 根应用组件
├── pages/                  # 页面路由
│   ├── index.vue          # 首页（产品介绍）
│   ├── login.vue          # 登录页面
│   ├── register.vue       # 注册页面
│   └── dashboard.vue      # 仪表板（管理页面）
├── components/            # Vue 组件
│   ├── DashboardHeader.vue    # 仪表板头部
│   ├── DashboardSidebar.vue   # 仪表板侧边栏
│   ├── MemoCard.vue          # 备忘录卡片
│   └── MemoEditor.vue        # 备忘录编辑器
├── stores/                # Pinia 状态管理
│   ├── user.ts           # 用户状态
│   └── memo.ts           # 备忘录状态
├── types/                 # TypeScript 类型定义
│   └── index.ts          # 通用类型
├── api/                   # API 文档
│   └── API_DOCUMENTATION.md  # API 接口文档
├── public/               # 静态资源
│   ├── favicon.ico       # 网站图标
│   └── robots.txt        # 搜索引擎配置
├── nuxt.config.ts        # Nuxt 配置文件
├── package.json          # 项目依赖和脚本
├── tsconfig.json         # TypeScript 配置
├── eslint.config.mjs     # ESLint 配置
└── README.md            # 项目说明文档
```

## 页面说明

### 1. 首页 (index.vue)
- **功能**: 产品介绍和营销页面
- **特性**:
  - 响应式设计
  - 产品特色展示
  - 使用场景介绍
  - 导航到登录/注册

### 2. 登录页面 (login.vue)
- **功能**: 用户身份验证
- **特性**:
  - 邮箱/密码登录
  - 记住我选项
  - 社交登录（Google）
  - 错误处理和加载状态

### 3. 注册页面 (register.vue)
- **功能**: 新用户注册
- **特性**:
  - 用户名、邮箱、密码注册
  - 密码强度指示器
  - 密码确认验证
  - 同意服务条款

### 4. 仪表板页面 (dashboard.vue)
- **功能**: 主要的备忘录管理界面
- **特性**:
  - 统计数据展示
  - 搜索和筛选
  - 备忘录列表（网格/列表视图）
  - 创建、编辑、删除备忘录
  - 置顶功能
  - 分页导航

## 组件说明

### 1. DashboardHeader.vue
- **功能**: 仪表板顶部导航栏
- **特性**:
  - 应用 Logo 和标题
  - 快速搜索框
  - 通知按钮
  - 用户菜单

### 2. DashboardSidebar.vue
- **功能**: 仪表板侧边栏
- **特性**:
  - 导航菜单
  - 快速访问（置顶、最近等）
  - 标签管理
  - 存储空间显示
  - 可折叠设计

### 3. MemoCard.vue
- **功能**: 备忘录卡片组件
- **特性**:
  - 支持网格和列表视图
  - 标题、内容、标签显示
  - 置顶标识
  - 操作按钮（编辑、删除、置顶）
  - 悬停效果

### 4. MemoEditor.vue
- **功能**: 备忘录编辑器
- **特性**:
  - 全屏编辑模式
  - 标题和内容编辑
  - 标签管理
  - 颜色选择
  - 置顶选项
  - 自动保存
  - 快捷键支持

## 状态管理

### 用户状态 (stores/user.ts)
- 用户信息管理
- 登录/注册/登出
- Token 管理
- 用户配置

### 备忘录状态 (stores/memo.ts)
- 备忘录 CRUD 操作
- 搜索和筛选
- 标签管理
- 分页处理

## 类型定义

### 核心类型 (types/index.ts)
- `User`: 用户信息接口
- `Memo`: 备忘录数据接口
- `LoginForm`: 登录表单接口
- `RegisterForm`: 注册表单接口
- `ApiResponse`: API 响应格式
- `MemoFilter`: 备忘录筛选条件

## 功能特性

### 用户管理
- [x] 用户注册和登录
- [x] 密码强度验证
- [x] 记住登录状态
- [ ] 社交登录（Google）
- [ ] 找回密码
- [x] 用户资料管理

### 备忘录功能
- [x] 创建、编辑、删除备忘录
- [x] 备忘录置顶
- [x] 标签系统
- [x] 颜色分类
- [x] 搜索功能
- [x] 筛选功能
- [x] 网格/列表视图切换
- [ ] 富文本编辑
- [ ] 图片上传
- [ ] 备忘录分享

### 用户体验
- [x] 响应式设计
- [x] 暗色主题支持（CSS 变量）
- [x] 加载状态指示
- [x] 错误处理
- [x] 自动保存
- [x] 快捷键支持
- [ ] 离线支持

### 数据管理
- [x] 云端同步
- [x] 数据统计
- [ ] 数据导出
- [ ] 数据导入
- [ ] 数据备份

## 开发指南

### 环境要求
- Node.js 18+
- npm 或 yarn
- 现代浏览器

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 配置的代码规范
- 使用 Vue 3 Composition API
- 组件采用 `<script setup>` 语法
- CSS 使用 scoped 样式

### 提交规范
- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

## 部署说明

### 静态部署
```bash
# 生成静态文件
npm run generate

# 部署到 dist 目录
```

### 服务端渲染
```bash
# 构建应用
npm run build

# 启动服务器
npm run preview
```

### 环境变量
- `NUXT_PUBLIC_API_BASE`: API 基础 URL
- `NUXT_SECRET_KEY`: 应用密钥

## 待办事项

### 高优先级
- [ ] 实现后端 API
- [ ] 用户认证中间件
- [ ] 数据持久化
- [ ] 错误边界处理

### 中优先级
- [ ] 富文本编辑器
- [ ] 图片上传功能
- [ ] 备忘录分享
- [ ] 数据导入导出
- [ ] 推送通知

### 低优先级
- [ ] 多语言支持
- [ ] 主题自定义
- [ ] 插件系统
- [ ] 移动端应用

## 联系信息

- 项目维护者: [您的姓名]
- 邮箱: [您的邮箱]
- GitHub: [GitHub 仓库地址]

## 许可证

MIT License - 详见 LICENSE 文件
