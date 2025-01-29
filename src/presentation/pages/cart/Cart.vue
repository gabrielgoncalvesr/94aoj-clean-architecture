<template>
  <div class="cart-page">
    <Button class="back-button p-button-text" @click="$router.back()">
      <i class="pi pi-arrow-left"></i>
      Voltar
    </Button>
    
    <h2>Seu Carrinho</h2>
    
    <div class="cart-container" v-if="cartItems.length > 0">
      <!-- Cart Items -->
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <div class="item-image-container">
            <img 
              v-if="item.image" 
              :src="item.image" 
              :alt="item.name" 
              class="item-image" 
              @error="item.image = null"
            />
            <div v-else class="image-placeholder">
              <i class="pi pi-image"></i>
              <span>Imagem não disponível</span>
            </div>
          </div>
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <div class="quantity-control">
              <Button 
                class="p-button-text" 
                @click="updateQuantity(item, item.quantity - 1)"
                :disabled="item.quantity <= 1"
              >
                <i class="pi pi-minus"></i>
              </Button>
              <span class="quantity">{{ item.quantity }}</span>
              <Button 
                class="p-button-text" 
                @click="updateQuantity(item, item.quantity + 1)"
              >
                <i class="pi pi-plus"></i>
              </Button>
            </div>
            <Button 
              icon="pi pi-trash" 
              severity="danger" 
              text 
              rounded 
              @click="removeItem(item)"
              class="remove-button"
              aria-label="Remover item"
            />
          </div>
          <div class="item-actions">
            <span class="item-price">{{ formatPrice(item.price * item.quantity) }}</span>
          </div>
        </div>
      </div>

      <!-- Cart Summary -->
      <div class="cart-summary">
        <div class="summary-content">
          <div class="summary-row total">
            <span>Total</span>
            <span>{{ formatPrice(total) }}</span>
          </div>
        </div>

        <Button 
          class="checkout-button"
          @click="goToCheckout"
        >
          <i class="pi pi-check-circle"></i>
          Finalizar Pedido
        </Button>
      </div>
    </div>

    <div v-else class="empty-cart">
      <i class="pi pi-shopping-cart"></i>
      <h3>Seu carrinho está vazio</h3>
      <p>Adicione alguns itens ao seu carrinho para vê-los aqui</p>
      <router-link to="/hamburgers">
        <Button @click="continueShopping">
          Ver Cardápio
        </Button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

interface CartItem {
  id: number | string
  name: string
  image: string | null
  price: number
  quantity: number
}

const router = useRouter()
const toast = useToast()
const cartItems = ref<CartItem[]>([])

const total = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + (item.price * item.quantity), 0)
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

const loadCartItems = () => {
  const currentCart = localStorage.getItem('burgerlivery:cart')
  if (currentCart) {
    cartItems.value = JSON.parse(currentCart)
  }
}

const removeItem = (item: CartItem) => {
  cartItems.value = cartItems.value.filter(i => !(i.id === item.id && i.name === item.name))
  localStorage.setItem('burgerlivery:cart', JSON.stringify(cartItems.value))
  
  toast.add({
    severity: 'info',
    summary: 'Item removido',
    detail: `${item.name} foi removido do carrinho`,
    life: 3000
  })
}

const updateQuantity = (item: CartItem, newQuantity: number) => {
  if (newQuantity < 1) {
    removeItem(item)
    return
  }

  const oldQuantity = item.quantity
  item.quantity = newQuantity
  localStorage.setItem('burgerlivery:cart', JSON.stringify(cartItems.value))

  if (newQuantity > oldQuantity) {
    toast.add({
      severity: 'success',
      summary: 'Quantidade aumentada',
      detail: `Quantidade de ${item.name} aumentada para ${newQuantity}`,
      life: 3000
    })
  } else {
    toast.add({
      severity: 'info',
      summary: 'Quantidade reduzida',
      detail: `Quantidade de ${item.name} reduzida para ${newQuantity}`,
      life: 3000
    })
  }
}

const goToCheckout = () => {
  if (cartItems.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Carrinho vazio',
      detail: 'Adicione itens ao carrinho antes de prosseguir',
      life: 3000
    })
    return
  }

  router.push('/checkout')
}

const continueShopping = () => {
  router.push('/hamburgers')
}

// Carregar itens quando o componente é montado
onMounted(() => {
  loadCartItems()
})

// Recarregar itens quando o localStorage é atualizado em outras abas/janelas
window.addEventListener('storage', (e) => {
  if (e.key === 'burgerlivery:cart') {
    loadCartItems()
  }
})

onUnmounted(() => {
  window.removeEventListener('storage', loadCartItems)
})
</script>

<style scoped>
.cart-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.back-button {
  padding: 0.5rem !important;
  margin-bottom: 1rem;
}

.back-button i {
  margin-right: 0.5rem;
}

h2 {
  margin: 0 0 2rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
}

.cart-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.item-image-container {
  width: 100px;
  height: 100px;
  margin-right: 1rem;
  overflow: hidden;
  border-radius: 8px;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  color: #6c757d;
  font-size: 0.875rem;
  text-align: center;
}

.image-placeholder i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.quantity-control button {
  width: 2rem !important;
  height: 2rem !important;
  padding: 0 !important;
}

.quantity {
  font-size: 1rem;
  font-weight: 600;
  min-width: 1.5rem;
  text-align: center;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.item-price {
  font-weight: 600;
  color: var(--primary-700);
  font-size: 1.125rem;
}

.remove-button {
  color: var(--red-500);
}

.remove-button:hover {
  color: var(--red-600);
  background: var(--red-50);
}

.cart-summary {
  background: var(--surface-0);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 2rem;
  height: fit-content;
  display: flex;
  flex-direction: column;
}

.summary-content {
  margin-bottom: 2rem;
}

.summary-row.total {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-200);
  margin-bottom: 0;
}

.checkout-button {
  background: var(--primary-500) !important;
  border: none !important;
  padding: 1rem !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.checkout-button i {
  margin-right: 0.5rem;
  font-size: 1.125rem;
}

.checkout-button:enabled:hover {
  background: var(--primary-600) !important;
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--surface-0);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.empty-cart i {
  font-size: 4rem;
  color: var(--surface-400);
  margin-bottom: 1.5rem;
}

.empty-cart h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.empty-cart p {
  color: var(--text-color-secondary);
  margin: 0 0 2rem 0;
}

@media screen and (max-width: 768px) {
  .cart-container {
    grid-template-columns: 1fr;
  }

  .cart-page {
    padding: 1rem;
  }

  .cart-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-image-container {
    width: 100%;
    height: 200px;
  }

  .item-actions {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
}
</style>
