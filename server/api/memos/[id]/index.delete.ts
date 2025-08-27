import { requireAuth } from '../../../utils/auth'
import { getDatabase } from '../../../../lib/database'

export default requireAuth(defineEventHandler(async (event) => {
  assertMethod(event, 'DELETE')
  
  try {
    const user = event.context.user
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: '用户未认证'
      })
    }
    
    // 获取备忘录ID
    const memoId = getRouterParam(event, 'id')
    
    if (!memoId) {
      throw createError({
        statusCode: 400,
        statusMessage: '备忘录ID不能为空'
      })
    }
    
    // 检查备忘录是否存在并属于当前用户
    const existingMemo = await getAsync(
      'SELECT * FROM memos WHERE id = ? AND user_id = ?',
      [memoId, user.userId]
    )
    
    if (!existingMemo) {
      throw createError({
        statusCode: 404,
        statusMessage: '备忘录不存在或无权访问'
      })
    }
    
    // 删除备忘录
    await runAsync(
      'DELETE FROM memos WHERE id = ? AND user_id = ?',
      [memoId, user.userId]
    )
    
    return {
      success: true,
      message: '备忘录删除成功'
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
