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

			// 获取查询参数
			const query = getQuery(event);
			const page = parseInt(query.page as string) || 1;
			const pageSize = Math.min(parseInt(query.pageSize as string) || 20, 100);
			const offset = (page - 1) * pageSize;
			const search = query.search as string;

			let memos;
			if (search) {
				// 如果有搜索查询，使用搜索功能
				memos = await prisma.$queryRawUnsafe(
					`SELECT * FROM memos WHERE user_id = ? AND (title LIKE ? OR content LIKE ?) ORDER BY created_at DESC LIMIT ? OFFSET ?`,
					user.userId,
					`%${search}%`,
					`%${search}%`,
					pageSize,
					offset
				);
			} else {
				// 获取用户的备忘录列表
				memos = await prisma.memo.findMany({
					where: {
						userId: user.userId,
					},
					take: pageSize,
					skip: offset,
					orderBy: {
						createdAt: "desc",
					},
				});
			}

			return {
				success: true,
				data: {
					memos,
					pagination: {
						page,
						pageSize,
						hasMore: memos.length === pageSize,
					},
				},
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
