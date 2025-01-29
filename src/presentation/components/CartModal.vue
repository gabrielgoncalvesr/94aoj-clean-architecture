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
          <img :src="item.image" :alt="item.name" class="item-image" />
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p class="item-quantity">{{ item.quantity }}x {{ item.name }}</p>
          </div>
          <div class="item-actions">
            <span class="item-price">{{ formatPrice(item.price * item.quantity) }}</span>
            <Button 
              class="p-button-text p-button-danger" 
              @click="removeItem(item)"
            >
              Remove
            </Button>
          </div>
        </div>
      </div>

      <!-- Cart Summary -->
      <div class="cart-summary">
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

        <Button 
          class="checkout-button"
          @click="checkout"
          :loading="loading"
        >
          Checkout
        </Button>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'

interface CartItem {
  id: number
  name: string
  image: string
  price: number
  quantity: number
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const loading = ref(false)

// Mock data
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

const removeItem = (item: CartItem) => {
  const index = cartItems.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    cartItems.value.splice(index, 1)
  }
}

const checkout = async () => {
  loading.value = true
  try {
    // Implementar lógica de checkout
    await new Promise(resolve => setTimeout(resolve, 1000))
    cartItems.value = []
    emit('update:modelValue', false)
  } finally {
    loading.value = false
  }
}
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

.item-quantity {
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

.item-price {
  font-weight: 600;
  color: var(--primary-700);
}

.cart-summary {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-200);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-color-secondary);
}

.summary-row.total {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-200);
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
