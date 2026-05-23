import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: () => import('@/views/Welcome.vue'),
      meta: { seo: 'welcome' }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      children: [
        {
          path: '', // 默认渲染概览页
          name: 'overview',
          component: () => import('@/views/Overview.vue'),
          meta: { seo: 'overview' }
        },
        {
          path: 'archive', // 档案页路由
          name: 'archive',
          component: () => import('@/views/Archive.vue'),
          meta: { seo: 'archive' }
        },
        {
          path: 'wiki', // Wiki页路由
          name: 'wiki',
          component: () => import('@/views/wiki.vue'),
          meta: { seo: 'wiki' }
        },
        {
          path: 'gallery', // 图集页路由
          name: 'gallery',
          component: () => import('@/views/Gallery.vue'),
          meta: { seo: 'gallery' }
        },
        {
          path: 'ai', // AI娅娅页路由
          name: 'ai',
          component: () => import('@/views/AIChat.vue'),
          meta: { seo: 'ai' }
        }
      ]
    }
  ]
});

export default router;
