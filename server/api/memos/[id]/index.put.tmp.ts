import { requireAuth } from "../../../utils/auth";
import { getDatabase } from "../../../lib/database";

export default requireAuth(
	defineEventHandler(async (event) => {
		assertMethod(event, "PUT");

		try {
			const user = event.context.user;

			if (!user) {
				throw createError({
					statusCode: 401,
					statusMessage: "用户未认证",
				});
			}

			const memoId = parseInt(getRouterParam(event, "id") as string);

			if (!memoId) {
				throw createError({
					statusCode: 400,
					statusMessage: "备忘录ID无效",
				});
			}

			const { title, content, tags } = await readBody(event);

			const db = getDatabase();

			// 检查备忘录是否存在且属于当前用户
			const existingMemo = await db.getMemoById(memoId, user.userId);
			if (!existingMemo) {
				throw createError({
					statusCode: 404,
					statusMessage: "备忘录不存在",
				});
			}

			// 更新备忘录
			const updatedMemo = await db.updateMemo(memoId, user.userId, {
				title: title || existingMemo.title,
				content: content || existingMemo.content,
				tags: tags || existingMemo.tags,
			});

			if (!updatedMemo) {
				throw createError({
					statusCode: 500,
					statusMessage: "更新失败",
				});
			}

			return {
				success: true,
				data: { memo: updatedMemo },
				message: "更新成功",
			};
		} catch (error: any) {
			if (error.statusCode) {
				throw error;
			}

			console.error("更新备忘录错误:", error);
			throw createError({
				statusCode: 500,
				statusMessage: "更新备忘录失败",
			});
		}
	})
);
