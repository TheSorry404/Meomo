import { requireAuth } from '../../utils/auth'
import { getDatabase } from '../../../lib/database'

export default requireAuth(defineEventHandler(async (event) => {
  try {
    const user = event.context.user
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: '用户未认证'
      })
    }
    
    const db = getDatabase()
    const userProfile = await db.getUserById(user.userId)
    
    if (!userProfile) {
      throw createError({
        statusCode: 404,
        statusMessage: '用户不存在'
      })
    }
    
    // 不返回密码
    const { password, ...safeUserProfile } = userProfile
    
    return {
      success: true,
      data: { user: safeUserProfile },
      message: '获取成功'
    }
    
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('获取用户信息错误:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '获取用户信息失败'
    })
  }
}))
