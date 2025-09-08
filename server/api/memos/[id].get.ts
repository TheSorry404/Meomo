import { requireAuth } from "../../utils/auth";
import { PrismaClient } from "@prisma/client";

export default requireAuth(
	defineEventHandler(async (event) => {
		const prisma = new PrismaClient();
		try {
			const user = event.context.user;
			const memoId = parseInt(getRouterParam(event, "id") as string);

			if (!memoId) {
				throw createError({
					statusCode: 400,
					message: "备忘录ID无效",
				});
			}

			const memo = await prisma.memo.findFirst({
				where: {
					id: memoId,
					userId: user.userId,
				},
			});

			if (!memo) {
				throw createError({
					statusCode: 404,
					message: "备忘录不存在",
				});
			}

			return {
				success: true,
				data: { memo },
				message: "获取成功",
			};
		} catch (error: any) {
			if (error.statusCode) {
				throw error;
			}

			console.error("获取备忘录错误:", error);
			throw createError({
				statusCode: 500,
				message: "获取备忘录失败",
			});
		}
	})
);
