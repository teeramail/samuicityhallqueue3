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
    path: '/regispress01/:idshow',  
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

  {
    path: '/mysamui',
    name: 'mysamui',
    component: () => import(/* webpackChunkName: "mysamui" */ '../views/mysamui.vue')
  },


  {
    path: '/mixlandshow',
    name: 'mixlandshow',
    component: () => import(/* webpackChunkName: "mixlandshow" */ '../views/mixlandshow.vue')
  },

  {
    path: '/ontv',
    name: 'ontv',
    component: () => import(/* webpackChunkName: "about" */ '../views/OnTv.vue')
  },

  {
    path: '/ontv2',
    name: 'ontv2',
    component: () => import(/* webpackChunkName: "about" */ '../views/OnTv2.vue')
  },

  {
    path: '/test',
    name: 'test',
    component: () => import(/* webpackChunkName: "test" */ '../views/test.vue')
  },

  {
    path: '/payboard',
    name: 'payboard',
    component: () => import(/* webpackChunkName: "payboard" */ '../views/PayBoard.vue')
  },


]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
