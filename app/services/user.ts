import { useApi } from "~/composables/useApi";
const api = useApi();

export const getUserProfile = async () => {
	return api.get<{ id: string; username: string; email: string }>(
		"/user/profile"
	);
};
