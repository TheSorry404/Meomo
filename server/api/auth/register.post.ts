import { hashPassword } from "../../lib/password";
import { generateTokenPair, type JwtPayload } from "../../lib/auth";
import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
	const prisma = new PrismaClient();
	assertMethod(event, "POST");

	try {
		const { username, email, password } = await readBody(event);

		// 验证必填字段
		if (!username || !email || !password) {
			return createError({
				status: 400,
				message: "用户名、邮箱和密码为必填项",
			});
		}

		// 验证邮箱格式
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw createError({
				statusCode: 400,
				message: "邮箱格式不正确",
				data: {
					code: 500,
					message: "邮箱格式不正确",
				},
			});
		}

		// 验证密码强度
		if (password.length < 6) {
			throw createError({
				statusCode: 400,
				message: "密码长度至少6位",
				data: {
					code: 500,
					message: "密码长度至少6位",
				},
			});
		}

		// 检查邮箱是否已存在
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});
		if (existingUser) {
			throw createError({
				statusCode: 500,
				message: "该邮箱已被注册",
				data: {
					code: 500,
					message: "该邮箱已被注册",
				},
			});
		}

		// 加密密码
		const hashedPassword = await hashPassword(password);

		// 创建用户
		const newUser = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
			},
		});

		// 生成JWT token
		const payload: JwtPayload = {
			userId: newUser.id,
			email: newUser.email,
			username: newUser.username,
		};

		const tokens = generateTokenPair(payload);

		// 返回用户信息和token（不包含密码）
		const { password: _, ...userWithoutPassword } = newUser;

		return {
			success: true,
			data: {
				token: tokens.accessToken,
				refreshToken: tokens.refreshToken,
				user: userWithoutPassword,
			},
			message: "注册成功",
		};
	} catch (error: any) {
		// 如果是已知错误，直接抛出
		if (error.statusCode) {
			throw error;
		}

		// 其他错误
		console.error("注册错误:", error);
		throw createError({
			statusCode: 500,
			message: "注册失败，请稍后重试",
		});
	}
});
