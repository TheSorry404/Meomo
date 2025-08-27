import { hashPassword } from '../../../lib/password'
import { generateTokenPair, type JwtPayload } from '../../../lib/auth'
import { getDatabase } from '../../../lib/database'

export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST')
  
  try {
    const { username, email, password } = await readBody(event)
    
    // 验证必填字段
    if (!username || !email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: '用户名、邮箱和密码不能为空'
      })
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: '邮箱格式不正确'
      })
    }
    
    // 验证密码强度
    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: '密码长度至少6位'
      })
    }
    
    const db = getDatabase()
    
    // 检查邮箱是否已存在
    const existingUserByEmail = await db.getUserByEmail(email)
    if (existingUserByEmail) {
      throw createError({
        statusCode: 409,
        statusMessage: '邮箱已被注册'
      })
    }
    
    // 加密密码
    const hashedPassword = await hashPassword(password)
    
    // 创建用户
    const newUser = await db.createUser({
      username,
      email,
      password: hashedPassword
    })
    
    // 生成JWT token
    const payload: JwtPayload = {
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username
    }
    
    const tokens = generateTokenPair(payload)
    
    // 返回用户信息和token（不包含密码）
    const { password: _, ...userWithoutPassword } = newUser
    
    return {
      success: true,
      data: {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: userWithoutPassword
      },
      message: '注册成功'
    }
    
  } catch (error: any) {
    // 如果是已知错误，直接抛出
    if (error.statusCode) {
      throw error
    }
    
    // 其他错误
    console.error('注册错误:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '注册失败，请稍后重试'
    })
  }
})
