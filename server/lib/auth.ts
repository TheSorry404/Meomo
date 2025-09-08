import jwt from "jsonwebtoken";

// JWT 密钥，生产环境应该从环境变量读取
const JWT_SECRET = process.env.JWT_SECRET || "meomo-secret-key-2024";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export interface JwtPayload {
	userId: string;
	email: string;
	username: string;
}

// 生成访问token
export const generateAccessToken = (payload: JwtPayload): string => {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	} as jwt.SignOptions);
};

// 生成刷新token
export const generateRefreshToken = (payload: JwtPayload): string => {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_REFRESH_EXPIRES_IN,
	} as jwt.SignOptions);
};

// 验证token
export const verifyToken = (token: string): Promise<JwtPayload> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, JWT_SECRET, (err, decoded) => {
			if (err) {
				reject(new Error("Token验证失败: " + err.message));
			} else {
				resolve(decoded as JwtPayload);
			}
		});
	});
};

// 从请求头中提取token
export const extractTokenFromHeader = (
	authHeader?: string
): string | null | undefined => {
	if (!authHeader) return null;

	const parts = authHeader.split(" ");
	if (parts.length !== 2 || parts[0] !== "Bearer") {
		return null;
	}

	return parts[1];
};

// 生成token对
export const generateTokenPair = (payload: JwtPayload) => {
	return {
		accessToken: generateAccessToken(payload),
		refreshToken: generateRefreshToken(payload),
	};
};
