import { requireAuth } from "../../utils/auth";
import { PrismaClient } from "@prisma/client";

export default requireAuth(
	defineEventHandler(async (event) => {
		const prisma = new PrismaClient();
		assertMethod(event, "POST");
		try {
			const user = event.context.user;

			if (!user) {
				throw createError({
					statusCode: 401,
					message: "用户未认证",
				});
			}

			const { title, content, tags } = await readBody(event);

			// 验证必填字段
			if (!title || !content) {
				throw createError({
					statusCode: 400,
					message: "标题和内容不能为空",
				});
			}

			// 创建备忘录
			const memo = await prisma.memo.create({
				data: {
					title,
					content,
					tags: tags || [],
					userId: user.userId,
				},
			});

			return {
				success: true,
				data: { memo },
				message: "创建成功",
			};
		} catch (error: any) {
			if (error.statusCode) {
				throw error;
			}

			console.error("创建备忘录错误:", error);
			throw createError({
				statusCode: 500,
				message: "创建备忘录失败",
			});
		}
	})
);
