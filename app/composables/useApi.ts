import type { UseFetchOptions } from "#app";

export const useApi = () => {
	const baseURL = "/api";
	const auth = useAuth(); // 假设已实现 useAuth composable

	/**
	 * 核心请求方法
	 * @param path 请求路径
	 * @param options 请求配置（包含 skipAuth 选项）
	 */
	const useApiFetch = async <T>(
		path: string,
		options: UseFetchOptions<T> & { skipAuth?: boolean } = {}
	) => {
		const { skipAuth = false, ...fetchOptions } = options;

		// 合并请求配置
		const mergedOptions: UseFetchOptions<T> = {
			baseURL,
			...fetchOptions,
			headers: {
				"Content-Type": "application/json",
				...(!skipAuth && auth.getToken()
					? { Authorization: `Bearer ${auth.getToken()}` }
					: {}),
				...options.headers,
			},
		};

		// 处理响应
		const { data, error } = await useFetch(path, mergedOptions);

		if (error.value) {
			const { data: err } = error.value as { data?: any };

			if (err.code === 401 && !skipAuth) {
				// 清除cookie并重定向到登录页
				auth.clearAuthCookies();
				const currentPath = useRoute().fullPath;
				const loginPath = `/login?redirect=${encodeURIComponent(currentPath)}`;
				if (process.client) {
					window.location.href = loginPath;
				}
			}
			return Promise.resolve(err);
		}
		return Promise.resolve(data.value as T);
	};

	// 快捷方法
	return {
		useApiFetch,
		get: <T>(
			path: string,
			opts?: UseFetchOptions<T> & { skipAuth?: boolean }
		) => useApiFetch<T>(path, { method: "GET", ...opts }),
		post: <T>(
			path: string,
			body?: any,
			opts?: UseFetchOptions<T> & { skipAuth?: boolean }
		) => useApiFetch<T>(path, { method: "POST", body, ...opts }),
		put: <T>(
			path: string,
			body?: any,
			opts?: UseFetchOptions<T> & { skipAuth?: boolean }
		) => useApiFetch<T>(path, { method: "PUT", body, ...opts }),
		patch: <T>(
			path: string,
			body?: any,
			opts?: UseFetchOptions<T> & { skipAuth?: boolean }
		) => useApiFetch<T>(path, { method: "PATCH", body, ...opts }),
		delete: <T>(
			path: string,
			opts?: UseFetchOptions<T> & { skipAuth?: boolean }
		) => useApiFetch<T>(path, { method: "DELETE", ...opts }),
	};
};

// 类型定义扩展
declare module "#app" {
	interface NuxtApp {
		$api: ReturnType<typeof useApi>;
	}
}
