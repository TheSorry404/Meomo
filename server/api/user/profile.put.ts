import { requireAuth } from "../../utils/auth";
import { PrismaClient } from "@prisma/client";

export default requireAuth(
	defineEventHandler(async (event) => {
		const prisma = new PrismaClient();
		assertMethod(event, "PUT");

		try {
			const user = event.context.user;

			if (!user) {
				throw createError({
					statusCode: 401,
					message: "用户未认证",
				});
			}

			const { username, email } = await readBody(event);

			// 至少需要提供一个更新字段
			if (!username && !email) {
				throw createError({
					statusCode: 400,
					message: "请提供要更新的信息",
				});
			}

			const updateData: any = {};
			if (username) updateData.username = username;
			if (email) updateData.email = email;

			const updatedUser = await prisma.user.update({
				where: { id: user.userId },
				data: updateData,
			});

			if (!updatedUser) {
				throw createError({
					statusCode: 500,
					message: "更新失败",
				});
			}

			// 不返回密码
			const { password, ...safeUserProfile } = updatedUser;

			return {
				success: true,
				data: { user: safeUserProfile },
				message: "更新成功",
			};
		} catch (error: any) {
			if (error.statusCode) {
				throw error;
			}

			console.error("更新用户信息错误:", error);
			throw createError({
				statusCode: 500,
				message: "更新用户信息失败",
			});
		}
	})
);
