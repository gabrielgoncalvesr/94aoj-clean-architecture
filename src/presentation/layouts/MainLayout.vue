<template>
  <div class="layout-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo-container">
        <img src="/burger-logo.svg" alt="Burgerlivery" class="logo-icon" />
      </div>
      
      <nav class="nav-menu">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: currentRoute === item.path }"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </router-link>

        <div class="nav-menu-spacer"></div>
        
        <a @click="handleLogout" class="nav-item logout-item">
          <i class="pi pi-sign-out"></i>
          <span>Sair</span>
        </a>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <header class="header">
        <div class="header-right">
          <div class="header-actions">
            <Button 
              class="cart-button p-button-text" 
              @click="router.push('/cart')"
            >
              <i class="pi pi-shopping-cart"></i>
            </Button>

            <div class="user-badge">
              {{ userInitial }}
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="content">
        <router-view></router-view>
      </main>

      <!-- Cart Modal -->
      <CartModal v-model="showCart" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CartModal from '../components/CartModal.vue'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const cartItemCount = ref(3) // Mock data
const showCart = ref(false)

const handleLogout = () => {
  localStorage.removeItem('burgerlivery:user')
  localStorage.removeItem('burgerlivery:cart')
  localStorage.removeItem('burgerlivery:token')
  
  toast.add({
    severity: 'success',
    summary: 'Logout realizado',
    detail: 'Você foi desconectado com sucesso',
    life: 3000
  })
  
  router.push('/login')
}

const menuItems = [
  { label: 'Hambúrgueres', path: '/hamburgers', icon: 'fas fa-hamburger' },
  { label: 'Acompanhamentos', path: '/sides', icon: 'fas fa-drumstick-bite' },
  { label: 'Sobremesas', path: '/desserts', icon: 'fas fa-ice-cream' },
  { label: 'Bebidas', path: '/drinks', icon: 'fas fa-beer' }
]

const currentRoute = computed(() => route.path)

const userInitial = computed(() => {
  const userData = localStorage.getItem('burgerlivery:user')
  if (userData) {
    const { email } = JSON.parse(userData)
    return email.charAt(0).toUpperCase()
  }
  return '?'
})
</script>

<style>
.layout-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background-color: var(--surface-0);
  border-right: 1px solid var(--surface-200);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.logo-container {
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid var(--surface-200);
}

.logo-icon {
  width: 48px;
  height: 48px;
}

.nav-menu {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.nav-menu-spacer {
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: var(--surface-100);
}

.nav-item.active {
  background-color: var(--primary-50);
  color: var(--primary-700);
}

.nav-item i {
  font-size: 1.5rem;
  color: var(--primary-500);
  width: 32px;
  text-align: center;
}

.nav-item span {
  margin-left: 0.75rem;
  font-weight: 500;
}

.logout-item {
  margin-top: auto;
  color: var(--red-600);
  cursor: pointer;
}

.logout-item i {
  color: var(--red-600) !important;
}

.logout-item:hover {
  background-color: var(--red-50);
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.header {
  padding: 1rem;
  background-color: var(--surface-0);
  border-bottom: 1px solid var(--surface-200);
}

.header-right {
  display: flex;
  justify-content: flex-end;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-button {
  position: relative;
  padding: 0.5rem !important;
  min-width: 2.5rem;
  height: 2.5rem;
}

.cart-button i {
  font-size: 1.25rem;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.user-badge {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--primary-100);
  color: var(--primary-700);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
}

/* Content */
.content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--primary-200) transparent;
  height: calc(100vh - 80px); /* Altura total menos a altura do header */
}

/* Estilização do scrollbar para Chrome/Safari */
.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-track {
  background: transparent;
}

.content::-webkit-scrollbar-thumb {
  background-color: var(--primary-200);
  border-radius: 20px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.content::-webkit-scrollbar-thumb:hover {
  background-color: var(--primary-300);
}

/* Esconde o scrollbar quando não é necessário */
.content.no-scroll {
  overflow: hidden;
}
</style>
