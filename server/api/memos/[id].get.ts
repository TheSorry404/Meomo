import { requireAuth } from '../../utils/auth'
import { getDatabase } from '../../../lib/database'

export default requireAuth(defineEventHandler(async (event) => {
  try {
    const user = event.context.user
    const memoId = parseInt(getRouterParam(event, 'id') as string)
    
    if (!memoId) {
      throw createError({
        statusCode: 400,
        statusMessage: '备忘录ID无效'
      })
    }
    
    const db = getDatabase()
    const memo = await db.getMemoById(memoId, user.userId)
    
    if (!memo) {
      throw createError({
        statusCode: 404,
        statusMessage: '备忘录不存在'
      })
    }

    return {
      success: true,
      data: { memo },
      message: '获取成功'
    }
    
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('获取备忘录错误:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '获取备忘录失败'
    })
  }
}))
