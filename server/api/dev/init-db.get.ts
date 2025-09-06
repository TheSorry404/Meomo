// 数据库初始化API（仅开发环境）
export default defineEventHandler(async (event) => {
  // 只允许GET请求
  assertMethod(event, 'GET')
  
  // 仅在开发环境允许
  if (process.env.NODE_ENV === 'production') {
    throw createError({
      statusCode: 403,
      statusMessage: '生产环境禁用此API'
    })
  }
  
  try {
    // 动态导入数据库模块以触发初始化
    const { initDatabase, queryAsync } = await import('../../../lib/database')
    
    // 重新初始化数据库
    initDatabase()
    
    // 检查表是否创建成功
    const tables = queryAsync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `)
    
    return {
      success: true,
      message: '数据库初始化成功',
      data: {
        tables: tables.map(t => t.name),
        timestamp: new Date().toISOString()
      }
    }
    
  } catch (error: any) {
    console.error('数据库初始化错误:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '数据库初始化失败: ' + error.message
    })
  }
})
