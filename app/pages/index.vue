<template>
  <div class="landing-page">
    <!-- 导航栏 -->
    <header class="header">
      <nav class="nav-container">
        <div class="nav-brand">
          <h1>📝 Meomo</h1>
        </div>
        <div class="nav-actions">
          <NuxtLink to="/login" class="btn btn-outline">登录</NuxtLink>
          <NuxtLink to="/register" class="btn btn-primary">注册</NuxtLink>
        </div>
      </nav>
    </header>

    <!-- 主要内容区 -->
    <main class="main-content">
      <!-- Hero 区域 -->
      <section class="hero">
        <div class="hero-container">
          <div class="hero-content">
            <h1 class="hero-title">
              随时随地记录你的想法
              <br>
              <span class="highlight">让创意不再丢失</span>
            </h1>
            <p class="hero-description">
              Meomo 是一个简洁而强大的备忘录应用，让你可以在任何有网络连接的地方访问你的备忘录—— 
              无论是在咖啡厅、图书馆还是办公室。
            </p>
            <div class="hero-actions">
              <NuxtLink to="/register" class="btn btn-primary btn-large">
                立即开始
              </NuxtLink>
              <button class="btn btn-outline btn-large" @click="scrollToFeatures">
                了解更多
              </button>
            </div>
          </div>
          <div class="hero-image">
            <div class="mock-interface">
              <div class="mock-header">
                <div class="mock-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div class="mock-content">
                <div class="mock-memo">
                  <div class="mock-memo-title">会议记录</div>
                  <div class="mock-memo-text">今天的产品讨论...</div>
                  <div class="mock-tags">
                    <span class="mock-tag">工作</span>
                    <span class="mock-tag">重要</span>
                  </div>
                </div>
                <div class="mock-memo">
                  <div class="mock-memo-title">购物清单</div>
                  <div class="mock-memo-text">牛奶、面包、鸡蛋...</div>
                  <div class="mock-tags">
                    <span class="mock-tag">生活</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 功能特性区域 -->
      <section id="features" class="features">
        <div class="container">
          <h2 class="section-title">为什么选择 Meomo？</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🌐</div>
              <h3>随时随地访问</h3>
              <p>只要有网络连接，就能在任何设备上访问你的备忘录</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🏷️</div>
              <h3>智能标签管理</h3>
              <p>通过标签系统轻松分类和查找你的备忘录</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📌</div>
              <h3>置顶重要内容</h3>
              <p>将重要的备忘录置顶，确保不会错过关键信息</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🎨</div>
              <h3>个性化颜色</h3>
              <p>为不同类型的备忘录设置颜色，提高识别效率</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔍</div>
              <h3>快速搜索</h3>
              <p>强大的搜索功能，快速找到你需要的内容</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">☁️</div>
              <h3>云端同步</h3>
              <p>数据实时同步，多设备无缝切换使用体验</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 使用场景区域 -->
      <section class="use-cases">
        <div class="container">
          <h2 class="section-title">适用场景</h2>
          <div class="use-cases-grid">
            <div class="use-case">
              <div class="use-case-image">☕</div>
              <h3>咖啡厅办公</h3>
              <p>在咖啡厅灵感迸发？立即记录下来，回到办公室继续完善</p>
            </div>
            <div class="use-case">
              <div class="use-case-image">📚</div>
              <h3>图书馆学习</h3>
              <p>学习笔记、读书心得，随时记录学习成果</p>
            </div>
            <div class="use-case">
              <div class="use-case-image">🏢</div>
              <h3>办公室工作</h3>
              <p>会议记录、项目进展、待办事项，工作效率倍增</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <p>&copy; 2025 Meomo. 让记录变得简单而美好。</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 定义组件名称
defineOptions({
  name: 'HomePage'
})

// 设置页面 meta
useHead({
  title: 'Meomo - 随时随地记录你的想法',
  meta: [
    { name: 'description', content: 'Meomo 是一个简洁而强大的备忘录应用，让你可以在任何有网络连接的地方访问你的备忘录。' },
    { name: 'keywords', content: '备忘录,笔记,云端同步,在线记录' }
  ]
})

// 滚动到功能区域
const scrollToFeatures = () => {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 100;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.nav-brand h1 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4338ca;
  margin: 0;
}

.nav-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: #4338ca;
  color: white;
}

.btn-primary:hover {
  background: #3730a3;
}

.btn-outline {
  background: transparent;
  color: #4338ca;
  border: 1px solid #4338ca;
}

.btn-outline:hover {
  background: #4338ca;
  color: white;
}

.btn-large {
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
}

.main-content {
  padding-top: 80px;
}

.hero {
  padding: 4rem 0 6rem;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.highlight {
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.mock-interface {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
}

.mock-header {
  background: #f3f4f6;
  padding: 1rem;
  display: flex;
  align-items: center;
}

.mock-dots {
  display: flex;
  gap: 0.5rem;
}

.mock-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d1d5db;
}

.mock-dots span:nth-child(1) { background: #ef4444; }
.mock-dots span:nth-child(2) { background: #f59e0b; }
.mock-dots span:nth-child(3) { background: #10b981; }

.mock-content {
  padding: 1.5rem;
}

.mock-memo {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 4px solid #4338ca;
}

.mock-memo:last-child {
  margin-bottom: 0;
}

.mock-memo-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.mock-memo-text {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.mock-tags {
  display: flex;
  gap: 0.5rem;
}

.mock-tag {
  background: #e0e7ff;
  color: #4338ca;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
}

.features, .use-cases {
  background: white;
  color: #1f2937;
  padding: 4rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  border-radius: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.6;
}

.use-cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.use-case {
  text-align: center;
  padding: 2rem;
}

.use-case-image {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.use-case h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.use-case p {
  color: #6b7280;
  line-height: 1.6;
}

.footer {
  background: #1f2937;
  padding: 2rem 0;
  text-align: center;
}

@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .nav-container {
    padding: 0 1rem;
  }
  
  .hero-actions {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
