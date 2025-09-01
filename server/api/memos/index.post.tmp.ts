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
    
    const { title, content, tags } = await readBody(event)
    
    // 验证必填字段
    if (!title || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: '标题和内容不能为空'
      })
    }
    
    const db = getDatabase()
    
    // 创建备忘录
    const memo = await db.createMemo({
      userId: user.userId,
      title,
      content,
      tags: tags || []
    })

    return {
      success: true,
      data: { memo },
      message: '创建成功'
    }
    
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('创建备忘录错误:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '创建备忘录失败'
    })
  }
}))
