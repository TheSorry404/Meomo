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
    
    // 获取查询参数
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const pageSize = Math.min(parseInt(query.pageSize as string) || 20, 100)
    const offset = (page - 1) * pageSize
    const search = query.search as string

    const db = getDatabase()
    
    let memos
    if (search) {
      // 如果有搜索查询，使用搜索功能
      memos = await db.searchMemos(user.userId, search, pageSize)
    } else {
      // 获取用户的备忘录列表
      memos = await db.getMemosByUserId(user.userId, pageSize, offset)
    }

    return {
      success: true,
      data: {
        memos,
        pagination: {
          page,
          pageSize,
          hasMore: memos.length === pageSize
        }
      },
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
