<template>
  <OrderConfirmation 
    v-if="orderConfirmation"
    :orderDetails="orderConfirmation"
  />
  
  <div v-else class="checkout-page">
    <div class="checkout-header">
      <Button class="back-button p-button-text" @click="$router.back()">
        <i class="pi pi-arrow-left"></i>
        Voltar para o carrinho
      </Button>
      <h2>Finalizar Pedido</h2>
    </div>

    <div class="checkout-content">
      <div class="payment-section">
        <h3>Forma de Pagamento</h3>
        <div class="payment-options">
          <div v-for="option in paymentOptions" :key="option.id" class="payment-option">
            <RadioButton 
              :value="option"
              v-model="selectedPayment"
              :inputId="'payment_' + option.id"
            />
            <label :for="'payment_' + option.id">{{ option.text }}</label>
          </div>
        </div>
      </div>

      <div class="cart-summary">
        <div class="summary-content">
          <div class="summary-row total">
            <span>Total</span>
            <span>{{ formatPrice(total) }}</span>
          </div>
        </div>
      </div>

      <Button 
        class="submit-button"
        @click="submitOrder"
        :loading="loading"
        :disabled="!selectedPayment"
      >
        <i class="pi pi-check-circle"></i>
        Confirmar Pedido
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import RadioButton from 'primevue/radiobutton'
import axios from 'axios'
import OrderConfirmation from './OrderConfirmation.vue'

interface CartItem {
  id: number
  name: string
  image: string
  price: number
  quantity: number
}

interface PaymentOption {
  id: string
  value: number
  text: string
}

interface OrderConfirmation {
  orderNumber: number
  createdAt: string
  message: string
  details: {
    items: Array<{
      title: string
      value: number
    }>
    paymentOption: string
  }
}

const router = useRouter()
const loading = ref(false)
const selectedPayment = ref<PaymentOption | null>(null)
const paymentOptions = ref<PaymentOption[]>([])
const cartItems = ref<CartItem[]>([])
const orderConfirmation = ref<OrderConfirmation | null>(null)

const total = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + (item.price * item.quantity), 0)
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

const loadPaymentOptions = async () => {
  loading.value = true
  try {
    const response = await axios.get('https://burgerlivery-api.vercel.app/payment/options')
    paymentOptions.value = response.data
  } catch (error) {
    console.error('Erro ao carregar opções de pagamento:', error)
  } finally {
    loading.value = false
  }
}

const submitOrder = async () => {
  if (!selectedPayment.value) return

  loading.value = true
  try {
    const token = localStorage.getItem('burgerlivery:token')
    if (!token) {
      router.push('/login')
      return
    }

    const orderData = {
      items: cartItems.value.map(item => ({
        title: item.name,
        value: item.price * item.quantity
      })),
      paymentOption: selectedPayment.value.text
    }

    const response = await axios.post('https://burgerlivery-api.vercel.app/order/create-order', orderData, {
      headers: {
        Authorization: token
      }
    })

    // Limpa o carrinho do localStorage
    localStorage.removeItem('burgerlivery:cart')
    
    // Mostra a confirmação do pedido
    orderConfirmation.value = response.data
  } catch (error) {
    console.error('Erro ao enviar pedido:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Carrega itens do carrinho do localStorage
  const cartData = localStorage.getItem('burgerlivery:cart')
  if (cartData) {
    cartItems.value = JSON.parse(cartData)
  }
  
  loadPaymentOptions()
})
</script>

<style scoped>
.checkout-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.checkout-header {
  margin-bottom: 2rem;
}

.back-button {
  margin-bottom: 1rem;
}

.back-button i {
  margin-right: 0.5rem;
}

h2 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.payment-section {
  background: var(--surface-0);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.payment-option:hover {
  background: var(--surface-100);
}

.payment-option label {
  cursor: pointer;
  font-size: 1rem;
}

.cart-summary {
  background: var(--surface-0);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.summary-content {
  padding: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: var(--text-color-secondary);
}

.summary-row.total {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  margin-top: 1rem;
  margin-bottom: 0;
}

.submit-button {
  width: 100%;
  background: var(--primary-500) !important;
  border: none !important;
  padding: 1rem !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.submit-button i {
  margin-right: 0.5rem;
}

.submit-button:enabled:hover {
  background: var(--primary-600) !important;
}

@media screen and (max-width: 768px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }

  .checkout-page {
    padding: 1rem;
  }
}
</style>
