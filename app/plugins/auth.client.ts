// ~/plugins/auth.client.ts
import { defineNuxtPlugin } from "#app";

class AuthCookieManager {
	private cookieOptions = {
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict" as const,
		maxAge: 60 * 60 * 24 * 7, // 7天
	};

	setCookie(name: string, value: string): void {
		if (process.server) return;

		const expires = new Date();
		expires.setTime(expires.getTime() + this.cookieOptions.maxAge * 1000);

		let cookieString = `${name}=${encodeURIComponent(value)}`;
		cookieString += `; expires=${expires.toUTCString()}`;
		cookieString += `; path=/`;

		if (this.cookieOptions.secure) {
			cookieString += "; secure";
		}

		cookieString += `; samesite=${this.cookieOptions.sameSite}`;

		document.cookie = cookieString;
	}

	getCookie(name: string): string | null {
		if (process.server) return null;

		const nameEQ = name + "=";
		const cookies = document.cookie.split(";");

		for (let cookie of cookies) {
			cookie = cookie.trim();
			if (cookie.indexOf(nameEQ) === 0) {
				return decodeURIComponent(cookie.substring(nameEQ.length));
			}
		}
		return null;
	}

	removeCookie(name: string): void {
		if (process.server) return;

		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	}

	setAuthToken(token: string): void {
		this.setCookie("auth_token", token);
	}

	getAuthToken(): string | null {
		return this.getCookie("auth_token");
	}

	setUserInfo(user: any): void {
		this.setCookie("user_info", JSON.stringify(user));
	}

	getUserInfo(): any | null {
		const userStr = this.getCookie("user_info");
		if (!userStr) return null;

		try {
			return JSON.parse(userStr);
		} catch {
			return null;
		}
	}

	clearAuth(): void {
		this.removeCookie("auth_token");
		this.removeCookie("user_info");
	}
}

export default defineNuxtPlugin(() => {
	const cookieManager = new AuthCookieManager();

	return {
		provide: {
			authCookie: {
				set: cookieManager.setCookie.bind(cookieManager),
				get: cookieManager.getCookie.bind(cookieManager),
				remove: cookieManager.removeCookie.bind(cookieManager),
				setToken: cookieManager.setAuthToken.bind(cookieManager),
				getToken: cookieManager.getAuthToken.bind(cookieManager),
				setUser: cookieManager.setUserInfo.bind(cookieManager),
				getUser: cookieManager.getUserInfo.bind(cookieManager),
				clear: cookieManager.clearAuth.bind(cookieManager),
			},
		},
	};
});
