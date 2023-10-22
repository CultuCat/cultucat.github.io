import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'page',
    component: () => import('../views/page.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue'),
  },
  {
    path: '/',
    component: () => import('../layouts/Default.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('../views/home.vue'),
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('../views/search.vue'),
      },
      {
        path: 'map',
        name: 'map',
        component: () => import('../views/map.vue'),
      },
      {
        path: 'tickets',
        name: 'tickets',
        component: () => import('../views/tickets.vue'),
      },
      {
        path: 'chats',
        name: 'chats',
        component: () => import('../views/chats.vue'),
      },
      {
        path: 'users/:user_id',
        name: 'profile',
        component: () => import('../views/user.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../views/settings.vue'),
      },
      {
        path: 'events/create', 
        name: 'createEvent', 
        component: () => import('../views/CreateEvent.vue'), 
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('../layouts/Default.vue'),
    children: [
      {
        path: 'home',
        name: 'adminHome',
        component: () => import('../views/admin/home.vue'),
      },
      {
        path: 'events',
        name: 'adminEvents',
        component: () => import('../views/admin/events.vue'),
      },
      {
        path: 'users',
        name: 'adminUsers',
        component: () => import('../views/admin/users.vue'),
      },
    ],
  },
  {
    path: '/events/:event_id',
    name: 'event',
    component: () => import('../views/event.vue'),
  },
  {
    path: '/tickets/:ticket_id',
    name: 'ticket',
    component: () => import('../views/ticket.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
