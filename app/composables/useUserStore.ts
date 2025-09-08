import { useUserStore as _useUserStore } from "~/stores/user";
import { storeToRefs } from "pinia";

export function useUserStore() {
	try {
		const store = _useUserStore();

		if (!store) {
			throw new Error("[Nuxt Pinia] User store is not available");
		}

		const refs = storeToRefs(store);

		return {
			...store,
			...refs,
		};
	} catch (error) {
		if (process.server) {
			console.warn("[Nuxt Pinia] Server-side store access may be limited");
		}

		if (process.dev) {
			console.error("[Nuxt Pinia] Store access error:", error);
		}

		throw createError({
			statusCode: 500,
			message: "Failed to initialize user store",
			fatal: !process.dev,
		});
	}
}
