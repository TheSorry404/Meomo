# Meomo

集多功能于一体的智能个人工具平台，专为追求高效生活与创意表达的用户设计。将📅日历管理、📝日常记录与✍️博客功能完美融合，让你在一个应用中轻松管理生活的方方面面。

## Quick Start

1. 安装依赖 (务必使用NPM包管理器)
   ```bash
   npm install
   ```
1. 配置环境变量
   - 复制 `.env.example` 文件并重命名为 `.env`
   - 根据需要修改环境变量
1. 初始化数据库
   ```bash
   npx prisma migrate dev --name init
   ```
1. 启动开发服务器
   ```bash
   npm run dev
   ```
1. 打开浏览器并访问 `http://localhost:3000`
1. 享受开发 Meomo 的乐趣！
