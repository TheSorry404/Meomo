# Meomo Backend API 规范文档

## 概述

此文档定义了 Meomo 应用的后端 API 规范，用于前后端分离架构。API 基础 URL 默认为 `http://localhost:8000/api`，可通过环境变量配置。

## 认证机制

所有需要认证的接口都需要在请求头中携带 JWT token：

```
Authorization: Bearer <jwt_token>
```

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": <actual_data>,
  "message": "操作成功"
}
```

### 错误响应
```json
{
  "success": false,
  "error": "错误描述",
  "code": "ERROR_CODE",
  "message": "用户友好的错误信息"
}
```

## API 接口详细说明

### 1. 认证相关 (`/auth`)

#### 1.1 用户登录
- **接口**: `POST /auth/login`
- **描述**: 用户登录获取 JWT token
- **请求体**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "data": {
      "token": "jwt_token_here",
      "user": {
        "id": 1,
        "username": "johndoe",
        "email": "user@example.com",
        "avatar": "https://example.com/avatar.jpg",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    }
  }
  ```

#### 1.2 用户注册
- **接口**: `POST /auth/register`
- **描述**: 用户注册
- **请求体**:
  ```json
  {
    "username": "johndoe",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **成功响应**: 同登录响应

#### 1.3 用户登出
- **接口**: `POST /auth/logout`
- **描述**: 用户登出（可选实现，用于清除服务端 session）
- **认证**: 需要
- **请求体**: 无
- **响应**:
  ```json
  {
    "success": true,
    "message": "登出成功"
  }
  ```

#### 1.4 刷新 Token
- **接口**: `POST /auth/refresh`
- **描述**: 刷新 JWT token
- **请求体**:
  ```json
  {
    "refreshToken": "refresh_token_here"
  }
  ```

### 2. 用户相关 (`/user`)

#### 2.1 获取用户资料
- **接口**: `GET /user/profile`
- **描述**: 获取当前用户资料
- **认证**: 需要
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "username": "johndoe",
      "email": "user@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
  ```

#### 2.2 更新用户资料
- **接口**: `PUT /user/profile`
- **描述**: 更新用户资料
- **认证**: 需要
- **请求体**:
  ```json
  {
    "username": "newusername",
    "avatar": "https://example.com/new-avatar.jpg"
  }
  ```

### 3. 备忘录相关 (`/memos`)

#### 3.1 获取备忘录列表
- **接口**: `POST /memos` 或 `GET /memos`
- **描述**: 获取用户的备忘录列表（支持分页和筛选）
- **认证**: 需要
- **请求体**（POST 方式，支持复杂筛选）:
  ```json
  {
    "page": 1,
    "pageSize": 20,
    "search": "搜索关键词",
    "tags": ["tag1", "tag2"],
    "sortBy": "createdAt",
    "sortOrder": "desc"
  }
  ```
- **查询参数**（GET 方式）:
  - `page`: 页码，默认 1
  - `pageSize`: 每页数量，默认 20
  - `search`: 搜索关键词
  - `tags`: 标签筛选（逗号分隔）
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "memos": [
        {
          "id": "memo_uuid",
          "title": "备忘录标题",
          "content": "备忘录内容",
          "tags": ["工作", "重要"],
          "isPinned": false,
          "isArchived": false,
          "createdAt": "2024-01-01T00:00:00Z",
          "updatedAt": "2024-01-01T00:00:00Z",
          "userId": 1
        }
      ],
      "total": 100,
      "page": 1,
      "pageSize": 20
    }
  }
  ```

#### 3.2 创建备忘录
- **接口**: `POST /memos`
- **描述**: 创建新的备忘录
- **认证**: 需要
- **请求体**:
  ```json
  {
    "title": "备忘录标题",
    "content": "备忘录内容",
    "tags": ["工作", "重要"],
    "isPinned": false
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "memo_uuid",
      "title": "备忘录标题",
      "content": "备忘录内容",
      "tags": ["工作", "重要"],
      "isPinned": false,
      "isArchived": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "userId": 1
    }
  }
  ```

#### 3.3 获取单个备忘录
- **接口**: `GET /memos/:id`
- **描述**: 获取指定备忘录详情
- **认证**: 需要
- **响应**: 同创建备忘录响应

#### 3.4 更新备忘录
- **接口**: `PUT /memos/:id`
- **描述**: 更新指定备忘录
- **认证**: 需要
- **请求体**:
  ```json
  {
    "title": "新标题",
    "content": "新内容",
    "tags": ["新标签"],
    "isPinned": true
  }
  ```
- **响应**: 同创建备忘录响应

#### 3.5 删除备忘录
- **接口**: `DELETE /memos/:id`
- **描述**: 删除指定备忘录
- **认证**: 需要
- **响应**:
  ```json
  {
    "success": true,
    "message": "备忘录删除成功"
  }
  ```

#### 3.6 置顶/取消置顶备忘录
- **接口**: `PATCH /memos/:id/pin`
- **描述**: 切换备忘录置顶状态
- **认证**: 需要
- **请求体**:
  ```json
  {
    "isPinned": true
  }
  ```

#### 3.7 获取标签列表
- **接口**: `GET /memos/tags`
- **描述**: 获取用户所有使用过的标签
- **认证**: 需要
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "tags": [
        {
          "name": "工作",
          "count": 15
        },
        {
          "name": "生活",
          "count": 8
        }
      ]
    }
  }
  ```

## HTTP 状态码

- `200 OK`: 请求成功
- `201 Created`: 创建成功
- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未认证或认证失败
- `403 Forbidden`: 权限不足
- `404 Not Found`: 资源不存在
- `422 Unprocessable Entity`: 数据验证失败
- `500 Internal Server Error`: 服务器内部错误

## 错误代码定义

- `AUTH_001`: 登录失败
- `AUTH_002`: Token 无效
- `AUTH_003`: Token 过期
- `AUTH_004`: 用户不存在
- `USER_001`: 用户名已存在
- `USER_002`: 邮箱已存在
- `MEMO_001`: 备忘录不存在
- `MEMO_002`: 备忘录访问权限不足
- `VALIDATION_001`: 参数验证失败

## 开发注意事项

1. **CORS 配置**: 开发环境需要配置 CORS 允许前端域名访问
2. **JWT 配置**: 建议生产环境使用 RS256 算法，开发环境可使用 HS256
3. **数据库**: 推荐使用 UUID 作为备忘录 ID，增强安全性
4. **缓存**: 建议对用户资料等数据进行缓存
5. **日志**: 记录 API 访问日志和错误日志
6. **限流**: 建议添加 API 限流机制防止滥用

## 环境变量

后端服务建议支持以下环境变量：

```bash
# 服务配置
PORT=8000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=meomo
DB_USER=username
DB_PASS=password

# JWT 配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS 配置
CORS_ORIGIN=http://localhost:3000
```
