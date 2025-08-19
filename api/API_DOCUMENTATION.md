# Meomo API 文档

## 概述

Meomo API 是一个 RESTful API，为 Meomo 备忘录应用提供后端服务。本文档描述了所有可用的 API 端点、请求格式和响应格式。

## 基础信息

- **Base URL**: `https://api.meomo.com/v1`
- **Content-Type**: `application/json`
- **编码**: UTF-8
- **认证**: Bearer Token

## 通用响应格式

所有 API 响应都遵循以下格式：

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    // 实际数据
  },
  "timestamp": "2025-01-19T10:30:00Z"
}
```

### HTTP 状态码

- `200` - 成功
- `201` - 创建成功
- `400` - 请求参数错误
- `401` - 未认证
- `403` - 无权限
- `404` - 资源不存在
- `422` - 数据验证失败
- `429` - 请求频率限制
- `500` - 服务器内部错误

## 认证接口

### 用户注册

```http
POST /auth/register
```

**请求体：**
```json
{
  "username": "string", // 用户名，3-20字符
  "email": "string",    // 邮箱地址
  "password": "string"  // 密码，至少6位
}
```

**响应：**
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123456789",
      "username": "张三",
      "email": "zhangsan@example.com",
      "avatar": null,
      "createdAt": "2025-01-19T10:30:00Z",
      "updatedAt": "2025-01-19T10:30:00Z"
    }
  }
}
```

### 用户登录

```http
POST /auth/login
```

**请求体：**
```json
{
  "email": "string",    // 邮箱地址
  "password": "string"  // 密码
}
```

**响应：**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123456789",
      "username": "张三",
      "email": "zhangsan@example.com",
      "avatar": "https://cdn.meomo.com/avatars/user_123456789.jpg",
      "createdAt": "2025-01-19T10:30:00Z",
      "updatedAt": "2025-01-19T10:30:00Z"
    }
  }
}
```

### 刷新令牌

```http
POST /auth/refresh
```

**请求头：**
```
Authorization: Bearer {token}
```

**响应：**
```json
{
  "code": 200,
  "message": "令牌刷新成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 退出登录

```http
POST /auth/logout
```

**请求头：**
```
Authorization: Bearer {token}
```

**响应：**
```json
{
  "code": 200,
  "message": "退出登录成功",
  "data": null
}
```

## 用户接口

### 获取用户信息

```http
GET /user/profile
```

**请求头：**
```
Authorization: Bearer {token}
```

**响应：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "user_123456789",
    "username": "张三",
    "email": "zhangsan@example.com",
    "avatar": "https://cdn.meomo.com/avatars/user_123456789.jpg",
    "createdAt": "2025-01-19T10:30:00Z",
    "updatedAt": "2025-01-19T10:30:00Z",
    "settings": {
      "theme": "light",
      "language": "zh-CN",
      "autoSave": true,
      "notifications": {
        "email": true,
        "push": false
      }
    }
  }
}
```

### 更新用户信息

```http
PUT /user/profile
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求体：**
```json
{
  "username": "string",  // 可选，用户名
  "avatar": "string"     // 可选，头像URL
}
```

**响应：**
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": "user_123456789",
    "username": "新用户名",
    "email": "zhangsan@example.com",
    "avatar": "https://cdn.meomo.com/avatars/user_123456789.jpg",
    "createdAt": "2025-01-19T10:30:00Z",
    "updatedAt": "2025-01-19T11:45:00Z"
  }
}
```

### 修改密码

```http
PUT /user/password
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求体：**
```json
{
  "currentPassword": "string", // 当前密码
  "newPassword": "string"      // 新密码，至少6位
}
```

**响应：**
```json
{
  "code": 200,
  "message": "密码修改成功",
  "data": null
}
```

## 备忘录接口

### 获取备忘录列表

```http
GET /memos
```

**请求头：**
```
Authorization: Bearer {token}
```

**查询参数：**
```
page: integer     // 页码，默认1
pageSize: integer // 每页数量，默认20，最大100
search: string    // 搜索关键词
tags: string      // 标签过滤，多个用逗号分隔
startDate: string // 开始日期 (YYYY-MM-DD)
endDate: string   // 结束日期 (YYYY-MM-DD)
pinned: boolean   // 只显示置顶
sortBy: string    // 排序字段：createdAt, updatedAt, title
sortOrder: string // 排序方向：asc, desc
```

**响应：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "memos": [
      {
        "id": "memo_123456789",
        "title": "会议记录",
        "content": "今天的产品讨论会议内容...",
        "tags": ["工作", "会议"],
        "color": "#e0e7ff",
        "isPinned": true,
        "userId": "user_123456789",
        "createdAt": "2025-01-19T10:30:00Z",
        "updatedAt": "2025-01-19T11:45:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

### 创建备忘录

```http
POST /memos
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求体：**
```json
{
  "title": "string",       // 标题，必填，最大200字符
  "content": "string",     // 内容，必填，最大50000字符
  "tags": ["string"],      // 标签数组，可选
  "color": "string",       // 颜色代码，可选，默认#ffffff
  "isPinned": boolean      // 是否置顶，可选，默认false
}
```

**响应：**
```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": "memo_123456789",
    "title": "会议记录",
    "content": "今天的产品讨论会议内容...",
    "tags": ["工作", "会议"],
    "color": "#e0e7ff",
    "isPinned": false,
    "userId": "user_123456789",
    "createdAt": "2025-01-19T10:30:00Z",
    "updatedAt": "2025-01-19T10:30:00Z"
  }
}
```

### 获取单个备忘录

```http
GET /memos/{id}
```

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**
- `id`: 备忘录ID

**响应：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "memo_123456789",
    "title": "会议记录",
    "content": "今天的产品讨论会议内容...",
    "tags": ["工作", "会议"],
    "color": "#e0e7ff",
    "isPinned": true,
    "userId": "user_123456789",
    "createdAt": "2025-01-19T10:30:00Z",
    "updatedAt": "2025-01-19T11:45:00Z",
    "wordCount": 1248,
    "readTime": 5
  }
}
```

### 更新备忘录

```http
PUT /memos/{id}
```

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**
- `id`: 备忘录ID

**请求体：**
```json
{
  "title": "string",       // 可选
  "content": "string",     // 可选
  "tags": ["string"],      // 可选
  "color": "string",       // 可选
  "isPinned": boolean      // 可选
}
```

**响应：**
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": "memo_123456789",
    "title": "更新后的标题",
    "content": "更新后的内容...",
    "tags": ["工作", "会议", "重要"],
    "color": "#fef3c7",
    "isPinned": true,
    "userId": "user_123456789",
    "createdAt": "2025-01-19T10:30:00Z",
    "updatedAt": "2025-01-19T12:15:00Z"
  }
}
```

### 删除备忘录

```http
DELETE /memos/{id}
```

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**
- `id`: 备忘录ID

**响应：**
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

### 批量操作备忘录

```http
POST /memos/batch
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求体：**
```json
{
  "action": "string",    // 操作类型：pin, unpin, delete, updateTags
  "memoIds": ["string"], // 备忘录ID数组
  "data": {}             // 额外数据，根据action不同而不同
}
```

**响应：**
```json
{
  "code": 200,
  "message": "批量操作成功",
  "data": {
    "success": 5,  // 成功数量
    "failed": 0    // 失败数量
  }
}
```

## 搜索接口

### 全文搜索

```http
POST /search
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求体：**
```json
{
  "query": "string",       // 搜索关键词
  "filters": {
    "tags": ["string"],    // 标签过滤
    "dateRange": {
      "start": "string",   // 开始日期
      "end": "string"      // 结束日期
    },
    "pinned": boolean      // 只搜索置顶
  },
  "page": 1,               // 页码
  "pageSize": 20           // 每页数量
}
```

**响应：**
```json
{
  "code": 200,
  "message": "搜索成功",
  "data": {
    "results": [
      {
        "id": "memo_123456789",
        "title": "会议记录",
        "content": "今天的产品讨论会议内容...",
        "tags": ["工作", "会议"],
        "color": "#e0e7ff",
        "isPinned": true,
        "highlight": {
          "title": "<mark>会议</mark>记录",
          "content": "今天的产品讨论<mark>会议</mark>内容..."
        },
        "score": 0.95,
        "createdAt": "2025-01-19T10:30:00Z",
        "updatedAt": "2025-01-19T11:45:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 12,
      "totalPages": 1
    },
    "searchTime": 23  // 搜索耗时（毫秒）
  }
}
```

### 搜索建议

```http
GET /search/suggestions
```

**请求头：**
```
Authorization: Bearer {token}
```

**查询参数：**
```
q: string  // 搜索前缀
```

**响应：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "suggestions": [
      {
        "type": "memo",
        "text": "会议记录",
        "count": 5
      },
      {
        "type": "tag",
        "text": "工作",
        "count": 23
      }
    ]
  }
}
```

## 标签接口

### 获取所有标签

```http
GET /tags
```

**请求头：**
```
Authorization: Bearer {token}
```

**查询参数：**
```
sort: string  // 排序方式：count, name, recent
```

**响应：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "tags": [
      {
        "name": "工作",
        "count": 23,
        "color": "#e0e7ff",
        "lastUsed": "2025-01-19T11:45:00Z"
      },
      {
        "name": "个人",
        "count": 15,
        "color": "#fef3c7",
        "lastUsed": "2025-01-19T10:30:00Z"
      }
    ]
  }
}
```

### 重命名标签

```http
PUT /tags/{name}
```

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**
- `name`: 原标签名

**请求体：**
```json
{
  "newName": "string" // 新标签名
}
```

**响应：**
```json
{
  "code": 200,
  "message": "重命名成功",
  "data": {
    "oldName": "工作",
    "newName": "工作笔记",
    "affectedMemos": 23
  }
}
```

### 删除标签

```http
DELETE /tags/{name}
```

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**
- `name`: 标签名

**响应：**
```json
{
  "code": 200,
  "message": "删除成功",
  "data": {
    "name": "工作",
    "affectedMemos": 23
  }
}
```

## 统计接口

### 获取用户统计

```http
GET /stats/overview
```

**请求头：**
```
Authorization: Bearer {token}
```

**响应：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "totalMemos": 156,
    "pinnedMemos": 8,
    "totalTags": 24,
    "todayMemos": 3,
    "weeklyMemos": 12,
    "monthlyMemos": 45,
    "averageWordsPerMemo": 247,
    "totalWords": 38532,
    "mostUsedTags": [
      {"name": "工作", "count": 23},
      {"name": "个人", "count": 15},
      {"name": "学习", "count": 12}
    ],
    "recentActivity": [
      {
        "date": "2025-01-19",
        "memosCreated": 2,
        "memosUpdated": 5
      }
    ]
  }
}
```

### 获取创作统计

```http
GET /stats/writing
```

**请求头：**
```
Authorization: Bearer {token}
```

**查询参数：**
```
period: string  // 时间周期：week, month, year
```

**响应：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "period": "month",
    "writingDays": 18,      // 写作天数
    "totalWords": 12847,    // 总字数
    "averageWordsPerDay": 713,
    "longestStreak": 7,     // 最长连续天数
    "currentStreak": 3,     // 当前连续天数
    "dailyStats": [
      {
        "date": "2025-01-19",
        "memos": 2,
        "words": 456,
        "timeSpent": 25  // 分钟
      }
    ],
    "hourlyDistribution": [
      {"hour": 9, "count": 12},
      {"hour": 14, "count": 8},
      {"hour": 20, "count": 15}
    ]
  }
}
```

## 导入导出接口

### 导出数据

```http
POST /export
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求体：**
```json
{
  "format": "string",  // 导出格式：json, markdown, pdf
  "options": {
    "includeDeleted": false,
    "dateRange": {
      "start": "2025-01-01",
      "end": "2025-01-31"
    },
    "tags": ["工作", "学习"]  // 只导出特定标签
  }
}
```

**响应：**
```json
{
  "code": 200,
  "message": "导出任务已创建",
  "data": {
    "taskId": "export_123456789",
    "status": "processing",
    "estimatedTime": 30  // 预计完成时间（秒）
  }
}
```

### 获取导出状态

```http
GET /export/{taskId}
```

**请求头：**
```
Authorization: Bearer {token}
```

**响应：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "taskId": "export_123456789",
    "status": "completed",  // processing, completed, failed
    "progress": 100,        // 进度百分比
    "downloadUrl": "https://cdn.meomo.com/exports/user_123_20250119.zip",
    "expiresAt": "2025-01-26T10:30:00Z",
    "fileSize": 1024576  // 文件大小（字节）
  }
}
```

### 导入数据

```http
POST /import
```

**请求头：**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**请求体：**
```
file: File  // 导入文件
format: string  // 文件格式：json, markdown
options: {
  "skipDuplicates": true,
  "preserveTimestamps": false
}
```

**响应：**
```json
{
  "code": 200,
  "message": "导入成功",
  "data": {
    "imported": 23,
    "skipped": 2,
    "failed": 0,
    "details": [
      {
        "title": "重复的备忘录标题",
        "status": "skipped",
        "reason": "已存在相同标题的备忘录"
      }
    ]
  }
}
```

## 错误处理

### 错误响应格式

```json
{
  "code": 400,
  "message": "请求参数错误",
  "errors": [
    {
      "field": "title",
      "message": "标题不能为空",
      "code": "REQUIRED"
    }
  ],
  "timestamp": "2025-01-19T10:30:00Z"
}
```

### 常见错误码

| 错误码 | HTTP状态 | 描述 |
|--------|----------|------|
| `INVALID_TOKEN` | 401 | 无效的访问令牌 |
| `TOKEN_EXPIRED` | 401 | 访问令牌已过期 |
| `INSUFFICIENT_PERMISSIONS` | 403 | 权限不足 |
| `RESOURCE_NOT_FOUND` | 404 | 资源不存在 |
| `VALIDATION_ERROR` | 422 | 数据验证失败 |
| `RATE_LIMIT_EXCEEDED` | 429 | 请求频率超限 |
| `STORAGE_QUOTA_EXCEEDED` | 413 | 存储空间不足 |

## 速率限制

- **认证接口**: 每分钟 10 次请求
- **创建备忘录**: 每分钟 30 次请求
- **搜索接口**: 每分钟 60 次请求
- **其他接口**: 每分钟 100 次请求

## 数据格式

### 日期时间格式

所有日期时间都使用 ISO 8601 格式：`YYYY-MM-DDTHH:mm:ssZ`

### 颜色格式

颜色值使用十六进制格式：`#RRGGBB`

### 文件大小限制

- 单个备忘录内容：最大 50KB
- 导入文件：最大 10MB
- 用户头像：最大 2MB

## API 版本

当前版本：`v1`

版本控制通过 URL 路径实现：`/v1/memos`

## SDK 和示例

### JavaScript/TypeScript

```typescript
// 安装：npm install @meomo/api-client

import { MeomoClient } from '@meomo/api-client'

const client = new MeomoClient({
  baseURL: 'https://api.meomo.com/v1',
  token: 'your-access-token'
})

// 创建备忘录
const memo = await client.memos.create({
  title: '我的备忘录',
  content: '这是备忘录内容',
  tags: ['标签1', '标签2']
})

// 获取备忘录列表
const memos = await client.memos.list({
  page: 1,
  pageSize: 20,
  search: '关键词'
})
```

### Python

```python
# 安装：pip install meomo-api

from meomo_api import MeomoClient

client = MeomoClient(
    base_url='https://api.meomo.com/v1',
    token='your-access-token'
)

# 创建备忘录
memo = client.memos.create(
    title='我的备忘录',
    content='这是备忘录内容',
    tags=['标签1', '标签2']
)

# 获取备忘录列表
memos = client.memos.list(
    page=1,
    page_size=20,
    search='关键词'
)
```

## 更新日志

### v1.0.0 (2025-01-19)
- 初始版本发布
- 支持用户认证和备忘录 CRUD
- 支持搜索和标签管理
- 支持数据导入导出

---

## 联系我们

- **技术支持**: dev@meomo.com
- **API 问题**: api@meomo.com
- **文档反馈**: docs@meomo.com

更多信息请访问：[https://developers.meomo.com](https://developers.meomo.com)
