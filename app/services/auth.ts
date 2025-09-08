import { useApi } from "~/composables/useApi";
const api = useApi();

export const login = async (email: string, password: string) => {
	return api.post("/auth/login", { email, password }, { skipAuth: true });
};

export const register = async (userData: {
	username: string;
	email: string;
	password: string;
}) => {
	return api.post("/auth/register", userData, { skipAuth: true });
};

export const logout = async () => {
	return api.post("/auth/logout");
};

export const forgotPassword = async (email: string) => {
	return api.post("/auth/forgot-password", { email }, { skipAuth: true });
};
export const resetPassword = async (token: string, newPassword: string) => {
	return api.post(
		"/auth/reset-password",
		{ token, newPassword },
		{ skipAuth: true }
	);
};
