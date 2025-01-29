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
          <img :src="item.image" :alt="item.name" class="item-image" />
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
          </div>
          <div class="item-actions">
            <span class="item-price">{{ formatPrice(item.price * item.quantity) }}</span>
          </div>
        </div>
      </div>

      <!-- Cart Summary -->
      <div class="cart-summary">
        <div class="summary-content">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="summary-row">
            <span>Delivery Fee</span>
            <span>{{ formatPrice(deliveryFee) }}</span>
          </div>
          <div class="summary-row">
            <span>Tax</span>
            <span>{{ formatPrice(tax) }}</span>
          </div>
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
        <Button>
          Ver Cardápio
        </Button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface CartItem {
  id: number
  name: string
  image: string
  price: number
  quantity: number
}

const router = useRouter()
const cartItems = ref<CartItem[]>([
  {
    id: 1,
    name: 'Cheeseburger',
    image: 'https://files.menudino.com/cardapios/37486/212.jpg',
    price: 25.90,
    quantity: 1
  },
  {
    id: 2,
    name: 'French Fries',
    image: 'https://www.allrecipes.com/thmb/k8Zmp_7R0fsY7kVpjvWVw_BgSCA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/219634-chef-johns-french-fries-DDMFS-4x3-338dec7976fc4d75bb3e2c18ff6a5958.jpg',
    price: 12.90,
    quantity: 1
  },
  {
    id: 3,
    name: 'Coke',
    image: 'https://www.coca-cola.com/content/dam/onexp/br/pt/brands/coca-cola/brazil_coca-cola_original_355ml_can.png',
    price: 7.90,
    quantity: 1
  }
])

const deliveryFee = 8.00
const taxRate = 0.05

const subtotal = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + (item.price * item.quantity), 0)
})

const tax = computed(() => subtotal.value * taxRate)
const total = computed(() => subtotal.value + deliveryFee + tax.value)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

const updateQuantity = (item: CartItem, quantity: number) => {
  const index = cartItems.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    if (quantity <= 0) {
      cartItems.value.splice(index, 1)
    } else {
      cartItems.value[index].quantity = quantity
    }
    // Atualiza o localStorage
    localStorage.setItem('burgerlivery:cart', JSON.stringify(cartItems.value))
  }
}

const goToCheckout = () => {
  // Verifica se o usuário está logado
  const token = localStorage.getItem('burgerlivery:token')
  if (!token) {
    router.push('/login')
    return
  }
  
  router.push('/checkout')
}

// Carrega itens do carrinho ao montar o componente
onMounted(() => {
  const cartData = localStorage.getItem('burgerlivery:cart')
  if (cartData) {
    cartItems.value = JSON.parse(cartData)
  }
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
  gap: 1rem;
  padding: 1rem;
  background: var(--surface-0);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
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

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-color-secondary);
  margin-bottom: 1rem;
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

  .item-image {
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
