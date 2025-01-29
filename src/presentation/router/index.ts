import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/login/Login.vue'
import ProductList from '../pages/products/ProductList.vue'
import MainLayout from '../layouts/MainLayout.vue'
import Cart from '../pages/cart/Cart.vue'
import Checkout from '../pages/checkout/Checkout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/hamburgers'
      },
      {
        path: '/hamburgers',
        name: 'Hamburgers',
        component: ProductList,
      },
      {
        path: '/sides',
        name: 'Sides',
        component: ProductList,
      },
      {
        path: '/desserts',
        name: 'Desserts',
        component: ProductList,
      },
      {
        path: '/drinks',
        name: 'Drinks',
        component: ProductList,
      },
      {
        path: '/cart',
        name: 'cart',
        component: Cart,
      },
      {
        path: '/checkout',
        name: 'checkout',
        component: Checkout
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('burgerlivery:token')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
