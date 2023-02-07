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
    path: '/buttonavigate',
    name: 'buttonavigate',
    component: () => import(/* webpackChunkName: "buttonavigate" */ '../views/buttonavigate.vue')
  },

  {
    path: '/playsound',
    name: 'playsound',
    component: () => import(/* webpackChunkName: "playsound" */ '../views/playsound.vue')
  },

  {
    path: '/mixlandshow/:idshow',
    name: 'mixlandshow',
    component: () => import(/* webpackChunkName: "mixlandshow" */ '../views/mixlandshow.vue')
  },

  {
    path: '/ontvsound',
    name: 'ontvsound',
    component: () => import(/* webpackChunkName: "ontvsound" */ '../views/ontvsound.vue')
  },

  {
    path: '/ontv',
    name: 'ontv',
    component: () => import(/* webpackChunkName: "about" */ '../views/OnTv.vue')
  },

  {
    path: '/mysamui',
    name: 'mysamui',
    component: () => import(/* webpackChunkName: "mysamui" */ '../views/mysamui.vue')
  },

  {
    path: '/test',
    name: 'test',
    component: () => import(/* webpackChunkName: "test" */ '../views/test.vue')
  },
  {
    path: '/test2',
    name: 'test2',
    component: () => import(/* webpackChunkName: "test2" */ '../views/test2.vue')
  },
  {
    path: '/test3',
    name: 'test3',
    component: () => import(/* webpackChunkName: "test3" */ '../views/test3.vue')
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
