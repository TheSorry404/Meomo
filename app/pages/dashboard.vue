<template>
	<div class="dashboard" :class="{ 'sidebar-collapsed': uiStore.isSidebarCollapsed }">
		<DashboardHeader />

		<div class="dashboard-container">
			<DashboardSidebar />

			<main class="dashboard-main">
				<!-- 顶部统计区域 -->
				<div class="stats-grid">
					<div class="stat-card">
						<div class="stat-icon">📝</div>
						<div class="stat-content">
							<div class="stat-number">{{ totalMemos }}</div>
							<div class="stat-label">总备忘录</div>
						</div>
					</div>
					<div class="stat-card">
						<div class="stat-icon">📌</div>
						<div class="stat-content">
							<div class="stat-number">{{ pinnedMemos }}</div>
							<div class="stat-label">置顶备忘录</div>
						</div>
					</div>
					<div class="stat-card">
						<div class="stat-icon">🏷️</div>
						<div class="stat-content">
							<div class="stat-number">{{ totalTags }}</div>
							<div class="stat-label">标签数量</div>
						</div>
					</div>
					<div class="stat-card">
						<div class="stat-icon">📅</div>
						<div class="stat-content">
							<div class="stat-number">{{ todayMemos }}</div>
							<div class="stat-label">今日新增</div>
						</div>
					</div>
				</div>

				<!-- 工具栏 -->
				<div class="toolbar">
					<div class="toolbar-left">
						<div class="search-box">
							<input
								v-model="searchQuery"
								type="text"
								placeholder="搜索备忘录..."
								class="search-input"
								@keyup.enter="handleSearch"
							/>
							<button
								class="search-btn"
								@click="handleSearch"
							>
								🔍
							</button>
						</div>

						<div class="filter-dropdown">
							<button
								class="filter-btn"
								@click="showFilters = !showFilters"
							>
								筛选
								{{
									activeFilters.length > 0 ? `(${activeFilters.length})` : ""
								}}
							</button>
							<div
								v-if="showFilters"
								class="filter-menu"
							>
								<div class="filter-group">
									<label>标签</label>
									<div class="tag-filters">
										<label
											v-for="tag in availableTags"
											:key="tag"
											class="tag-filter"
										>
											<input
												v-model="selectedTags"
												type="checkbox"
												:value="tag"
											/>
											{{ tag }}
										</label>
									</div>
								</div>
								<div class="filter-group">
									<label>时间范围</label>
									<select v-model="selectedTimeRange">
										<option value="">全部时间</option>
										<option value="today">今天</option>
										<option value="week">本周</option>
										<option value="month">本月</option>
									</select>
								</div>
							</div>
						</div>
					</div>

					<div class="toolbar-right">
						<button
							class="btn btn-outline"
							@click="showViewOptions = !showViewOptions"
						>
							视图
						</button>
						<button
							class="btn btn-primary"
							@click="createNewMemo"
						>
							+ 新建备忘录
						</button>
					</div>
				</div>

				<!-- 视图选项 -->
				<div
					v-if="showViewOptions"
					class="view-options"
				>
					<button
						class="view-btn"
						:class="{ active: viewMode === 'grid' }"
						@click="viewMode = 'grid'"
					>
						网格视图
					</button>
					<button
						class="view-btn"
						:class="{ active: viewMode === 'list' }"
						@click="viewMode = 'list'"
					>
						列表视图
					</button>
				</div>

				<!-- 备忘录列表 -->
				<div class="memos-section">
					<div
						v-if="loading"
						class="loading-state"
					>
						<div class="loading-spinner" />
						<p>加载中...</p>
					</div>

					<div
						v-else-if="filteredMemos.length === 0"
						class="empty-state"
					>
						<div class="empty-icon">📝</div>
						<h3>暂无备忘录</h3>
						<p>创建你的第一个备忘录吧！</p>
						<button
							class="btn btn-primary"
							@click="createNewMemo"
						>
							+ 新建备忘录
						</button>
					</div>

					<div
						v-else
						:class="`memos-${viewMode}`"
					>
						<!-- 置顶备忘录 -->
						<div
							v-if="pinnedMemosList.length > 0"
							class="pinned-section"
						>
							<h3 class="section-title">置顶备忘录</h3>
							<div :class="`memos-${viewMode}`">
								<MemoCard
									v-for="memo in pinnedMemosList"
									:key="memo.id"
									:memo="memo"
									:view-mode="viewMode"
									@edit="editMemo"
									@delete="deleteMemo"
									@toggle-pin="togglePin"
								/>
							</div>
						</div>

						<!-- 普通备忘录 -->
						<div
							v-if="unpinnedMemosList.length > 0"
							class="regular-section"
						>
							<h3
								v-if="pinnedMemosList.length > 0"
								class="section-title"
							>
								其他备忘录
							</h3>
							<div :class="`memos-${viewMode}`">
								<MemoCard
									v-for="memo in unpinnedMemosList"
									:key="memo.id"
									:memo="memo"
									:view-mode="viewMode"
									@edit="editMemo"
									@delete="deleteMemo"
									@toggle-pin="togglePin"
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- 分页 -->
				<div
					v-if="totalPages > 1"
					class="pagination"
				>
					<button
						class="page-btn"
						:disabled="currentPage === 1"
						@click="changePage(currentPage - 1)"
					>
						上一页
					</button>

					<div class="page-numbers">
						<button
							v-for="page in visiblePages"
							:key="page"
							class="page-btn"
							:class="{ active: page === currentPage }"
							@click="changePage(page)"
						>
							{{ page }}
						</button>
					</div>

					<button
						class="page-btn"
						:disabled="currentPage === totalPages"
						@click="changePage(currentPage + 1)"
					>
						下一页
					</button>
				</div>
			</main>
		</div>

		<!-- 备忘录编辑弹窗 -->
		<MemoEditor
			v-if="showEditor"
			:memo="currentEditingMemo"
			@save="saveMemo"
			@cancel="cancelEdit"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useApi } from "~/composables/useApi";
import type { Memo } from "~/types";
import { useUiStore } from '~/stores/ui';

// 定义组件名称
defineOptions({
	name: "DashboardPage",
});

// 页面 meta
definePageMeta({
	middleware: "auth",
});

const uiStore = useUiStore();

// 响应式数据
const loading = ref(false);
const searchQuery = ref("");
const selectedTags = ref<string[]>([]);
const selectedTimeRange = ref("");
const showFilters = ref(false);
const showViewOptions = ref(false);
const viewMode = ref<"grid" | "list">("grid");
const currentPage = ref(1);
const pageSize = ref(20);

// 备忘录数据
const memos = ref<Memo[]>([]);
const totalMemos = ref(0);
const showEditor = ref(false);
const currentEditingMemo = ref<Memo | null>(null);

// 统计数据
const pinnedMemos = computed(
	() => memos.value.filter((m) => m.isPinned).length
);
const totalTags = computed(() => {
	const tags = memos.value.flatMap((m) => m.tags);
	return [...new Set(tags)].length;
});
const todayMemos = computed(() => {
	const today = new Date().toDateString();
	return memos.value.filter(
		(m) => new Date(m.createdAt).toDateString() === today
	).length;
});

// 可用标签
const availableTags = computed(() => {
	const tags = memos.value.flatMap((m) => m.tags);
	return [...new Set(tags)];
});

// 激活的筛选器
const activeFilters = computed(() => {
	const filters: string[] = [];
	if (selectedTags.value.length > 0) filters.push("标签");
	if (selectedTimeRange.value) filters.push("时间");
	if (searchQuery.value) filters.push("搜索");
	return filters;
});

// 筛选后的备忘录
const filteredMemos = computed(() => {
	let filtered = [...memos.value];

	// 搜索过滤
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		filtered = filtered.filter(
			(memo) =>
				memo.title.toLowerCase().includes(query) ||
				memo.content.toLowerCase().includes(query) ||
				memo.tags.some((tag) => tag.toLowerCase().includes(query))
		);
	}

	// 标签过滤
	if (selectedTags.value.length > 0) {
		filtered = filtered.filter((memo) =>
			selectedTags.value.some((tag) => memo.tags.includes(tag))
		);
	}

	// 时间范围过滤
	if (selectedTimeRange.value) {
		const now = new Date();
		const startDate = new Date();

		switch (selectedTimeRange.value) {
			case "today":
				startDate.setHours(0, 0, 0, 0);
				break;
			case "week":
				startDate.setDate(now.getDate() - 7);
				break;
			case "month":
				startDate.setMonth(now.getMonth() - 1);
				break;
		}

		filtered = filtered.filter((memo) => new Date(memo.createdAt) >= startDate);
	}

	return filtered;
});

// 置顶和普通备忘录
const pinnedMemosList = computed(() =>
	filteredMemos.value.filter((m) => m.isPinned)
);
const unpinnedMemosList = computed(() =>
	filteredMemos.value.filter((m) => !m.isPinned)
);

// 分页
const totalPages = computed(() => Math.ceil(totalMemos.value / pageSize.value));
const visiblePages = computed(() => {
	const start = Math.max(1, currentPage.value - 2);
	const end = Math.min(totalPages.value, start + 4);
	return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// 方法
const handleSearch = () => {
	// 搜索逻辑已在 computed 中处理
};

const createNewMemo = () => {
	currentEditingMemo.value = null;
	showEditor.value = true;
};

const editMemo = (memo: Memo) => {
	currentEditingMemo.value = memo;
	showEditor.value = true;
};

const saveMemo = async (memoData: any) => {
	// TODO: 实现保存逻辑
	console.log("Save memo:", memoData);
	showEditor.value = false;
	await loadMemos();
};

const cancelEdit = () => {
	showEditor.value = false;
	currentEditingMemo.value = null;
};

const deleteMemo = async (memoId: string) => {
	if (confirm("确定要删除这个备忘录吗？")) {
		// TODO: 实现删除逻辑
		console.log("Delete memo:", memoId);
		await loadMemos();
	}
};

const togglePin = async (memoId: string) => {
	// TODO: 实现置顶切换逻辑
	console.log("Toggle pin:", memoId);
	await loadMemos();
};

const changePage = (page: number) => {
	if (page >= 1 && page <= totalPages.value) {
		currentPage.value = page;
		loadMemos();
	}
};

const loadMemos = async () => {
	loading.value = true;
	try {
    // 获取Memos
    const response = await useApi().get('/memos', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        search: searchQuery.value,
        tags: selectedTags.value.join(','),
        timeRange: selectedTimeRange.value
      }
    })
    console.log(response);
    
	} catch (error) {
		console.error("Failed to load memos:", error);
	} finally {
		loading.value = false;
	}
};

// 页面加载时获取数据
onMounted(() => {
	loadMemos();
});
</script>

<style scoped>
.dashboard {
	min-height: 100vh;
	background: #f9fafb;
}

.dashboard-container {
	display: flex;
	min-height: calc(100vh - 64px);
}

.dashboard-main {
	flex: 1;
	padding: 5rem 1.5rem 1.5rem;
	margin-left: 256px;
  transition: margin-left 0.3s ease;
}

.sidebar-collapsed .dashboard-main {
  margin-left: 64px;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
	margin-bottom: 2rem;
}

.stat-card {
	background: white;
	border-radius: 0.75rem;
	padding: 1.5rem;
	display: flex;
	align-items: center;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	border: 1px solid #e5e7eb;
}

.stat-icon {
	font-size: 2rem;
	margin-right: 1rem;
}

.stat-number {
	font-size: 2rem;
	font-weight: bold;
	color: #1f2937;
}

.stat-label {
	color: #6b7280;
	font-size: 0.9rem;
}

.toolbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1.5rem;
	padding: 1rem;
	background: white;
	border-radius: 0.75rem;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toolbar-left {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.search-box {
	display: flex;
	align-items: center;
	position: relative;
}

.search-input {
	width: 300px;
	padding: 0.5rem 1rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	font-size: 0.9rem;
}

.search-btn {
	position: absolute;
	right: 0.5rem;
	background: none;
	border: none;
	cursor: pointer;
	padding: 0.25rem;
}

.filter-dropdown {
	position: relative;
}

.filter-btn {
	padding: 0.5rem 1rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	background: white;
	cursor: pointer;
}

.filter-menu {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: white;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	padding: 1rem;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
	z-index: 10;
	min-width: 250px;
}

.filter-group {
	margin-bottom: 1rem;
}

.filter-group label {
	display: block;
	font-weight: 500;
	margin-bottom: 0.5rem;
}

.tag-filters {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.tag-filter {
	display: flex;
	align-items: center;
	font-size: 0.9rem;
}

.tag-filter input {
	margin-right: 0.25rem;
}

.toolbar-right {
	display: flex;
	gap: 0.5rem;
}

.btn {
	padding: 0.5rem 1rem;
	border-radius: 0.5rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s ease;
	border: none;
}

.btn-primary {
	background: #4338ca;
	color: white;
}

.btn-outline {
	background: white;
	color: #4338ca;
	border: 1px solid #4338ca;
}

.view-options {
	display: flex;
	gap: 0.5rem;
	margin-bottom: 1rem;
}

.view-btn {
	padding: 0.5rem 1rem;
	border: 1px solid #d1d5db;
	background: white;
	border-radius: 0.5rem;
	cursor: pointer;
}

.view-btn.active {
	background: #4338ca;
	color: white;
	border-color: #4338ca;
}

.memos-section {
	margin-bottom: 2rem;
}

.section-title {
	font-size: 1.2rem;
	font-weight: 600;
	margin-bottom: 1rem;
	color: #1f2937;
}

.loading-state,
.empty-state {
	text-align: center;
	padding: 3rem;
	background: white;
	border-radius: 0.75rem;
}

.loading-spinner {
	width: 32px;
	height: 32px;
	border: 3px solid #f3f4f6;
	border-top: 3px solid #4338ca;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin: 0 auto 1rem;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.empty-icon {
	font-size: 4rem;
	margin-bottom: 1rem;
}

.memos-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 1rem;
}

.memos-list {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.pagination {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 0.5rem;
	margin-top: 2rem;
}

.page-btn {
	padding: 0.5rem 1rem;
	border: 1px solid #d1d5db;
	background: white;
	border-radius: 0.5rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.page-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.page-btn.active {
	background: #4338ca;
	color: white;
	border-color: #4338ca;
}

.page-numbers {
	display: flex;
	gap: 0.25rem;
}

@media (max-width: 768px) {
	.dashboard-main {
		margin-left: 0;
		padding: 1rem;
	}

	.stats-grid {
		grid-template-columns: repeat(2, 1fr);
	}

	.toolbar {
		flex-direction: column;
		gap: 1rem;
	}

	.toolbar-left {
		width: 100%;
		justify-content: center;
	}

	.search-input {
		width: 100%;
	}
}
</style>
