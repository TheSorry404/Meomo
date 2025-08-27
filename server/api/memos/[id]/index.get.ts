// 获取单个备忘录API
import { requireAuth } from '../../../utils/auth'
import { getAsync } from '../../../../lib/database'

export default requireAuth(defineEventHandler(async (event) => {
  // 只允许GET请求
  assertMethod(event, 'GET')
  
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
    
    // 查询备忘录
    const memo = await getAsync(
      'SELECT * FROM memos WHERE id = ? AND user_id = ?',
      [memoId, user.userId]
    )
    
    if (!memo) {
      throw createError({
        statusCode: 404,
        statusMessage: '备忘录不存在或无权访问'
      })
    }
    
    return {
      success: true,
      data: {
        id: memo.id,
        title: memo.title,
        content: memo.content,
        tags: JSON.parse(memo.tags || '[]'),
        isPinned: Boolean(memo.is_pinned),
        isArchived: Boolean(memo.is_archived),
        createdAt: memo.created_at,
        updatedAt: memo.updated_at,
        userId: memo.user_id
      }
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
