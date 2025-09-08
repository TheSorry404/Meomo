// 用户登出API
export default defineEventHandler(async (event) => {
	// 只允许POST请求
	assertMethod(event, "POST");

	try {
		// 在实际应用中，这里可以将token加入黑名单
		// 或者清除服务端存储的会话信息

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
