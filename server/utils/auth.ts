import type { EventHandler } from 'h3'
import { extractTokenFromHeader, verifyToken, type JwtPayload } from '../../lib/auth'

// 扩展事件上下文类型
declare module 'h3' {
  interface EventHandlerRequest {
    user?: JwtPayload
  }
}

// 身份验证中间件
export const requireAuth = (handler: EventHandler): EventHandler => {
  return defineEventHandler(async (event) => {
    try {
      // 获取Authorization头
      const authHeader = getHeader(event, 'authorization')
      const token = extractTokenFromHeader(authHeader)
      
      if (!token) {
        throw createError({
          statusCode: 401,
          statusMessage: '未提供认证token'
        })
      }
      
      // 验证token
      const payload = await verifyToken(token)
      
      // 将用户信息附加到请求上下文
      event.context.user = payload
      
      // 调用原始处理器
      return await handler(event)
      
    } catch (error: any) {
      // 如果是createError创建的错误，直接抛出
      if (error.statusCode) {
        throw error
      }
      
      // 其他错误统一处理为认证失败
      throw createError({
        statusCode: 401,
        statusMessage: 'Token验证失败'
      })
    }
  })
}

// 可选身份验证中间件（不强制要求登录）
export const optionalAuth = (handler: EventHandler): EventHandler => {
  return defineEventHandler(async (event) => {
    try {
      const authHeader = getHeader(event, 'authorization')
      const token = extractTokenFromHeader(authHeader)
      
      if (token) {
        try {
          const payload = await verifyToken(token)
          event.context.user = payload
        } catch {
          // 忽略token验证错误，继续执行
        }
      }
      
      return await handler(event)
      
    } catch (error) {
      return await handler(event)
    }
  })
}

// 管理员权限中间件（如果需要的话）
export const requireAdmin = (handler: EventHandler): EventHandler => {
  return requireAuth(defineEventHandler(async (event) => {
    const user = event.context.user
    
    // 这里可以添加管理员检查逻辑
    // 例如检查用户角色或权限
    
    return await handler(event)
  }))
}
