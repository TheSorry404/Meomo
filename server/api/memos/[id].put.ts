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

			// 获取备忘录ID
			const memoId = parseInt(getRouterParam(event, "id") as string);

			if (!memoId) {
				throw createError({
					statusCode: 400,
					message: "备忘录ID不能为空",
				});
			}

			// 检查备忘录是否存在并属于当前用户
			const existingMemo = await prisma.memo.findFirst({
				where: {
					id: memoId,
					userId: user.userId,
				},
			});

			if (!existingMemo) {
				throw createError({
					statusCode: 404,
					message: "备忘录不存在或无权访问",
				});
			}

			// 获取请求体
			const { title, content, tags, isPinned, isArchived } =
				await readBody(event);

			// 构建更新字段
			const updates: string[] = [];
			const params: any[] = [];

			if (title !== undefined) {
				updates.push("title = ?");
				params.push(title);
			}

			if (content !== undefined) {
				updates.push("content = ?");
				params.push(content);
			}

			if (tags !== undefined) {
				updates.push("tags = ?");
				params.push(JSON.stringify(Array.isArray(tags) ? tags : []));
			}

			if (isPinned !== undefined) {
				updates.push("is_pinned = ?");
				params.push(isPinned ? 1 : 0);
			}

			if (isArchived !== undefined) {
				updates.push("is_archived = ?");
				params.push(isArchived ? 1 : 0);
			}

			// 如果没有要更新的字段
			if (updates.length === 0) {
				throw createError({
					statusCode: 400,
					message: "没有要更新的字段",
				});
			}

			// 添加更新时间
			updates.push("updated_at = CURRENT_TIMESTAMP");
			params.push(memoId, user.userId); // 用于WHERE条件

			// 执行更新
			await prisma.$executeRawUnsafe(
				`UPDATE memos SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
				...params
			);

			// 获取更新后的备忘录
			const updatedMemo = await prisma.memo.findFirst({
				where: {
					id: memoId,
					userId: user.userId,
				},
			});

			return {
				success: true,
				data: {
					id: updatedMemo.id,
					title: updatedMemo.title,
					content: updatedMemo.content,
					tags: JSON.parse(updatedMemo.tags || "[]"),
					isPinned: Boolean(updatedMemo.is_pinned),
					isArchived: Boolean(updatedMemo.is_archived),
					createdAt: updatedMemo.created_at,
					updatedAt: updatedMemo.updated_at,
					userId: updatedMemo.user_id,
				},
				message: "备忘录更新成功",
			};
		} catch (error: any) {}
	})
);
