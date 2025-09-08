// 用户登出API
export default defineEventHandler(async (event) => {
	// 只允许POST请求
	assertMethod(event, "POST");

	try {
		// 清除认证相关的cookie
		return {
			success: true,
			message: "登出成功",
		};
	} catch (error: any) {
		console.error("登出错误:", error);
		throw createError({
			statusCode: 500,
			message: "登出失败，请稍后重试",
		});
	}
});
