<template>
	<div class="auth-page">
		<div class="auth-container">
			<div class="auth-card">
				<div class="auth-header">
					<h1>📝 Meomo</h1>
					<h2>登录到你的账户</h2>
					<p>继续你的创作之旅</p>
				</div>

				<form
					class="auth-form"
					@submit.prevent="handleLogin"
				>
					<div class="form-group">
						<label for="email">邮箱地址</label>
						<input
							id="email"
							v-model="form.email"
							type="email"
							placeholder="请输入邮箱地址"
							required
							:disabled="loading"
						/>
					</div>

					<div class="form-group">
						<label for="password">密码</label>
						<input
							id="password"
							v-model="form.password"
							type="password"
							placeholder="请输入密码"
							required
							:disabled="loading"
						/>
					</div>

					<div class="form-options">
						<label class="checkbox-label">
							<input
								v-model="form.rememberMe"
								type="checkbox"
							/>
							<span class="checkmark" />
							记住我
						</label>
						<NuxtLink
							to="/forgot-password"
							class="forgot-link"
						>
							忘记密码？
						</NuxtLink>
					</div>

					<button
						type="submit"
						class="btn btn-primary"
						:disabled="loading"
					>
						<span
							v-if="loading"
							class="loading-spinner"
						/>
						{{ loading ? "登录中..." : "登录" }}
					</button>

					<div
						v-if="error"
						class="error-message"
					>
						{{ error }}
					</div>
				</form>

				<div class="auth-footer">
					<p>
						还没有账户？
						<NuxtLink
							to="/register"
							class="auth-link"
						>
							立即注册
						</NuxtLink>
					</p>
				</div>

				<!-- <div class="divider">
          <span>或者</span>
        </div>

        <div class="social-login">
          <button type="button" class="btn btn-social" @click="loginWithGoogle">
            <svg class="social-icon" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            使用 Google 登录
          </button>
        </div> -->
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// 使用安全的 composable
import { useUserStore } from "../composables/useUserStore";

// 定义组件名称
defineOptions({
	name: "LoginPage",
});

// 页面 meta
definePageMeta({
	layout: false,
	auth: false,
});

// // 在 setup 中初始化 store
// const userStore = useUserStore()

// 响应式数据
const form = ref({
	email: "",
	password: "",
	rememberMe: false,
});

const loading = ref(false);
const error = ref("");

const isStoreReady = ref(false);

onMounted(async () => {
	// 等待一个tick确保Pinia完全加载
	await nextTick();
	try {
		useUserStore(); // 测试是否可用
		isStoreReady.value = true;
	} catch (err) {
		console.error("Store初始化失败:", err);
	}
});

// 登录处理
const handleLogin = async () => {
	if (!isStoreReady.value) {
		error.value = "系统正在初始化，请稍后重试";
		return;
	}
	if (!form.value.email || !form.value.password) {
		error.value = "请填写所有必填字段";
		return;
	}

	loading.value = true;
	error.value = "";

	try {
		// 使用已初始化的用户store进行登录
		const userStore = useUserStore();
		const result = await userStore.login(form.value.email, form.value.password);

		if (result.success) {
			// 登录成功，跳转到仪表板
			await navigateTo("/dashboard");
		} else {
			error.value = result.error || "登录失败";
		}
	} catch (err) {
		error.value = "网络错误，请稍后重试";
		console.error("Login error:", err);
	} finally {
		loading.value = false;
	}
};

// Google 登录
const loginWithGoogle = () => {
	// TODO: 实现 Google OAuth 登录
	console.log("Google login not implemented yet");
};
</script>

<style scoped>
.auth-page {
	min-height: 100vh;
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
}

.auth-container {
	width: 100%;
	max-width: 400px;
}

.auth-card {
	background: white;
	border-radius: 1rem;
	padding: 2rem;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.auth-header {
	text-align: center;
	margin-bottom: 2rem;
}

.auth-header h1 {
	font-size: 2rem;
	color: #4338ca;
	margin-bottom: 0.5rem;
}

.auth-header h2 {
	font-size: 1.5rem;
	color: #1f2937;
	margin-bottom: 0.5rem;
}

.auth-header p {
	color: #6b7280;
}

.auth-form {
	margin-bottom: 1.5rem;
}

.form-group {
	margin-bottom: 1rem;
}

.form-group label {
	display: block;
	margin-bottom: 0.5rem;
	font-weight: 500;
	color: #374151;
}

.form-group input {
	width: 100%;
	padding: 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	font-size: 1rem;
	transition:
		border-color 0.3s ease,
		box-shadow 0.3s ease;
}

.form-group input:focus {
	outline: none;
	border-color: #4338ca;
	box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.1);
}

.form-group input:disabled {
	background-color: #f3f4f6;
	cursor: not-allowed;
}

.form-options {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1.5rem;
}

.checkbox-label {
	display: flex;
	align-items: center;
	cursor: pointer;
	font-size: 0.9rem;
	color: #374151;
}

.checkbox-label input {
	margin-right: 0.5rem;
}

.forgot-link {
	color: #4338ca;
	text-decoration: none;
	font-size: 0.9rem;
}

.forgot-link:hover {
	text-decoration: underline;
}

.btn {
	width: 100%;
	padding: 0.75rem;
	border: none;
	border-radius: 0.5rem;
	font-size: 1rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
}

.btn-primary {
	background: #4338ca;
	color: white;
}

.btn-primary:hover:not(:disabled) {
	background: #3730a3;
}

.btn-primary:disabled {
	background: #9ca3af;
	cursor: not-allowed;
}

.btn-social {
	background: white;
	color: #374151;
	border: 1px solid #d1d5db;
}

.btn-social:hover {
	background: #f9fafb;
}

.loading-spinner {
	width: 16px;
	height: 16px;
	border: 2px solid transparent;
	border-top: 2px solid currentColor;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.error-message {
	background: #fef2f2;
	color: #dc2626;
	padding: 0.75rem;
	border-radius: 0.5rem;
	margin-top: 1rem;
	font-size: 0.9rem;
	border: 1px solid #fecaca;
}

.auth-footer {
	text-align: center;
	color: #6b7280;
}

.auth-link {
	color: #4338ca;
	text-decoration: none;
	font-weight: 500;
}

.auth-link:hover {
	text-decoration: underline;
}

.divider {
	text-align: center;
	margin: 1.5rem 0;
	position: relative;
}

.divider::before {
	content: "";
	position: absolute;
	top: 50%;
	left: 0;
	right: 0;
	height: 1px;
	background: #e5e7eb;
}

.divider span {
	background: white;
	padding: 0 1rem;
	color: #6b7280;
	font-size: 0.9rem;
}

.social-login {
	margin-top: 1rem;
}

.social-icon {
	width: 20px;
	height: 20px;
}

@media (max-width: 480px) {
	.auth-card {
		padding: 1.5rem;
	}

	.auth-header h1 {
		font-size: 1.8rem;
	}

	.auth-header h2 {
		font-size: 1.3rem;
	}
}
</style>
