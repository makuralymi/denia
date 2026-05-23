import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: () => import('@/views/Welcome.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      children: [
        {
          path: '', // 默认渲染概览页
          name: 'overview',
          component: () => import('@/views/Overview.vue')
        },
        {
          path: 'archive', // 档案页路由
          name: 'archive',
          component: () => import('@/views/Archive.vue')
        },
        {
          path: 'wiki', // Wiki页路由
          name: 'wiki',
          component: () => import('@/views/wiki.vue')
        },
        {
          path: 'gallery', // 图集页路由
          name: 'gallery',
          component: () => import('@/views/Gallery.vue')
        },
        {
          path: 'ai', // AI娅娅页路由
          name: 'ai',
          component: () => import('@/views/AIChat.vue')
        }
      ]
    }
  ]
});

export default router;
