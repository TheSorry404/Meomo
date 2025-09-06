import { requireAuth } from '../../../utils/auth'
import { getDatabase } from '../../../../lib/database'

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
    
    // 检查备忘录是否存在且属于当前用户
    const memo = await db.getMemoById(memoId, user.userId)
    if (!memo) {
      throw createError({
        statusCode: 404,
        statusMessage: '备忘录不存在'
      })
    }
    
    // 删除备忘录
    const success = await db.deleteMemo(memoId, user.userId)
    
    if (!success) {
      throw createError({
        statusCode: 500,
        statusMessage: '删除失败'
      })
    }

    return {
      success: true,
      message: '删除成功'
    }
    
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('删除备忘录错误:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '删除备忘录失败'
    })
  }
}))
