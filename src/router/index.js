import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'page',
    component: () => import('@/views/page.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/signup.vue'),
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/app/home.vue'),
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/app/search.vue'),
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('@/views/app/map.vue'),
  },
  {
    path: '/tickets',
    name: 'tickets',
    component: () => import('@/views/app/tickets.vue'),
  },
  {
    path: '/chats',
    name: 'chats',
    component: () => import('@/views/app/chats.vue'),
  },
  {
    path: '/users/:user_id',
    name: 'profile',
    component: () => import('@/views/user.vue'),
  },  
  {
    path: '/users/:user_id/edit',
    name: 'edit_user',
    component: () => import('@/views/edit_user.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/settings.vue'),
  }, 
  {
    path: '/admin/events/create', 
    name: 'createEvent', 
    component: () => import('@/views/admin/createEvent.vue'), 
  },
  {
    path: '/admin/events',
    name: 'adminEvents',
    component: () => import('@/views/admin/events.vue'),
  },
  {
    path: '/admin/users',
    name: 'adminUsers',
    component: () => import('@/views/admin/users.vue'),
  },
  {
    path: '/events/:event_id',
    name: 'event',
    component: () => import('@/views/event.vue'),
  },
  
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
