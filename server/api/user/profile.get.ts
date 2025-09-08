import { requireAuth } from "../../utils/auth";
import { PrismaClient } from "@prisma/client";

export default requireAuth(
	defineEventHandler(async (event) => {
		const prisma = new PrismaClient();
		try {
			const user = event.context.user;

			if (!user) {
				throw createError({
					statusCode: 401,
					message: "用户未认证",
				});
			}

			const userProfile = await prisma.user.findUnique({
				where: { id: user.userId },
			});

			if (!userProfile) {
				throw createError({
					statusCode: 404,
					message: "用户不存在",
				});
			}

			// 不返回密码
			const { password, ...safeUserProfile } = userProfile;

			return {
				success: true,
				data: { user: safeUserProfile },
				message: "获取成功",
			};
		} catch (error: any) {
			if (error.statusCode) {
				throw error;
			}

			console.error("获取用户信息错误:", error);
			throw createError({
				statusCode: 500,
				message: "获取用户信息失败",
			});
		}
	})
);
