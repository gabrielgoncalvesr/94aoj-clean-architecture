<template>
  <Dialog 
    :visible="modelValue"
    @update:visible="$emit('update:modelValue', $event)"
    modal
    :header="'Your Cart'"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
  >
    <div class="cart-content">
      <!-- Cart Items -->
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <div class="item-image">
            <img v-if="item.image" :src="item.image" :alt="item.name" />
            <div v-else class="image-placeholder">
              <i class="pi pi-image"></i>
            </div>
          </div>
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <div class="item-price">{{ formatPrice(item.price) }}</div>
            <div class="item-actions">
              <InputNumber 
                v-model="item.quantity" 
                :min="1" 
                showButtons 
                @input="updateQuantity(item, $event)"
                class="quantity-input"
              />
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
          </div>
        </div>
      </div>

      <!-- Cart Summary -->
      <div class="cart-summary">
        <div class="total">
          <span>Total</span>
          <span>{{ formatPrice(total) }}</span>
        </div>
        <Button 
          class="checkout-button" 
          @click="checkout"
          :loading="loading"
          :disabled="cartItems.length === 0"
        >
          Finalizar Pedido
        </Button>
        <Button 
          class="continue-shopping-button"
          @click="continueShopping"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'

interface CartItem {
  id: number | string
  name: string
  image: string | null
  price: number
  quantity: number
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const router = useRouter()
const toast = useToast()
const loading = ref(false)

// Mock data
const cartItems = ref<CartItem[]>([])

const total = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
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

const checkout = async () => {
  if (cartItems.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Carrinho vazio',
      detail: 'Adicione itens ao carrinho antes de prosseguir',
      life: 3000
    })
    return
  }

  loading.value = true
  try {
    emit('update:modelValue', false)
    router.push('/cart')
  } finally {
    loading.value = false
  }
}

const continueShopping = () => {
  emit('update:modelValue', false)
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
.cart-content {
  display: flex;
  flex-direction: column;
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
  background: var(--surface-50);
  border-radius: 8px;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
}

.item-price {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.remove-button {
  color: var(--red-500);
}

.remove-button:hover {
  color: var(--red-600);
  background: var(--red-50);
}

.cart-summary {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-200);
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-color-secondary);
}

.total span:last-child {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
}

.checkout-button {
  margin-top: 1rem;
  width: 100%;
  background: var(--primary-500) !important;
  border: none !important;
  padding: 1rem !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.checkout-button:enabled:hover {
  background: var(--primary-600) !important;
}

.continue-shopping-button {
  margin-top: 1rem;
  width: 100%;
  background: var(--surface-50) !important;
  border: none !important;
  padding: 1rem !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.continue-shopping-button:enabled:hover {
  background: var(--surface-100) !important;
}

@media screen and (max-width: 640px) {
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-image {
    width: 100%;
    height: 120px;
  }

  .item-actions {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
