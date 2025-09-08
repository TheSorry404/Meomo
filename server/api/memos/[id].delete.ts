import { requireAuth } from "../../utils/auth";
import { PrismaClient } from "@prisma/client";

export default requireAuth(
	defineEventHandler(async (event) => {
		const prisma = new PrismaClient();
		assertMethod(event, "DELETE");

		try {
			const user = event.context.user;
			const memoId = parseInt(getRouterParam(event, "id") as string);

			if (!memoId) {
				throw createError({
					statusCode: 400,
					message: "备忘录ID无效",
				});
			}

			// 检查备忘录是否存在且属于当前用户
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

			// 删除备忘录
			const success = await prisma.memo.delete({
				where: {
					id: memoId,
				},
			});

			if (!success) {
				throw createError({
					statusCode: 500,
					message: "删除失败",
				});
			}

			return {
				success: true,
				message: "删除成功",
			};
		} catch (error: any) {
			if (error.statusCode) {
				throw error;
			}

			console.error("删除备忘录错误:", error);
			throw createError({
				statusCode: 500,
				message: "删除备忘录失败",
			});
		}
	})
);
