// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
    ],
    
  },

  {
    path: '/regispress',
    name: 'regispress',    component: () => import(/* webpackChunkName: "about" */ '../views/regispress.vue')
  },
  {
    path: '/regispress01',
    name: 'regispress01',    component: () => import(/* webpackChunkName: "about" */ '../views/regispress01.vue')
  },

  {
    path: '/onboardshow',
    name: 'onboardshow',    component: () => import(/* webpackChunkName: "about" */ '../views/onboardshow.vue')
  },

  {
    path: '/onboardland',
    name: 'onboardland',    component: () => import(/* webpackChunkName: "about" */ '../views/onboardland.vue')
  },



  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },


]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
