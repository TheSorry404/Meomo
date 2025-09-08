import { verifyPassword } from "../../lib/password";
import { generateTokenPair, type JwtPayload } from "../../lib/auth";
import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
	const prisma = new PrismaClient();
	assertMethod(event, "POST");

	try {
		const { email, password } = await readBody(event);

		// 验证必填字段
		if (!email || !password) {
			throw createError({
				statusCode: 400,
				message: "邮箱和密码不能为空",
			});
		}

		// 查找用户
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			throw createError({
				statusCode: 401,
				message: "邮箱或密码错误",
			});
		}

		// 验证密码
		const isPasswordValid = await verifyPassword(password, user.password);
		if (!isPasswordValid) {
			throw createError({
				statusCode: 401,
				message: "邮箱或密码错误",
			});
		}

		// 生成JWT token
		const payload: JwtPayload = {
			userId: user.id,
			email: user.email,
			username: user.username,
		};

		const tokens = generateTokenPair(payload);

		// 返回用户信息和token（不包含密码）
		const { password: _, ...userWithoutPassword } = user;

		return {
			success: true,
			data: {
				token: tokens.accessToken,
				refreshToken: tokens.refreshToken,
				user: userWithoutPassword,
			},
			message: "登录成功",
		};
	} catch (error: any) {
		// 如果是已知错误，直接抛出
		if (error.statusCode) {
			throw error;
		}

		// 其他错误
		console.error("登录错误:", error);
		throw createError({
			statusCode: 500,
			message: "登录失败，请稍后重试",
		});
	}
});
