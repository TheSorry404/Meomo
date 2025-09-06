// API状态检查
export default defineEventHandler(async (event) => {
  try {
    return {
      success: true,
      message: 'Meomo API 运行正常',
      data: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        env: process.env.NODE_ENV || 'development'
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API 状态检查失败'
    })
  }
})
