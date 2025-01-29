<template>
  <div class="confirmation-page">
    <div class="confirmation-card">
      <div class="success-icon">
        <i class="pi pi-check-circle"></i>
      </div>

      <h2>Pedido Confirmado!</h2>
      
      <div class="order-info">
        <div class="info-row">
          <span class="label">Número do Pedido:</span>
          <span class="value">#{{ orderDetails.orderNumber }}</span>
        </div>
        <div class="info-row">
          <span class="label">Data:</span>
          <span class="value">{{ formatDate(orderDetails.createdAt) }}</span>
        </div>
        <div class="info-row">
          <span class="label">Pagamento:</span>
          <span class="value">{{ orderDetails.details.paymentOption }}</span>
        </div>
        <div class="info-row total">
          <span>Total</span>
          <span>{{ formatTotal(orderDetails.details.items) }}</span>
        </div>
      </div>

      <div class="actions">
        <Button 
          class="new-order-button"
          @click="$router.push('/hamburgers')"
        >
          <i class="pi pi-shopping-cart"></i>
          Fazer Novo Pedido
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface OrderItem {
  title: string
  value: number
}

interface OrderDetails {
  orderNumber: number
  createdAt: string
  message: string
  details: {
    items: OrderItem[]
    paymentOption: string
  }
}

const props = defineProps<{
  orderDetails: OrderDetails
}>()

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

const formatTotal = (items: OrderItem[]) => {
  const total = items.reduce((acc, item) => acc + item.value, 0)
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(total)
}
</script>

<style scoped>
.confirmation-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--surface-50);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.confirmation-card {
  background: var(--surface-0);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
}

.success-icon {
  margin-bottom: 1.5rem;
}

.success-icon i {
  font-size: 4rem;
  color: var(--green-500);
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

h2 {
  color: var(--green-600);
  font-size: 2rem;
  margin: 0 0 2rem 0;
}

.order-info {
  background: var(--surface-50);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.info-row:not(:last-child) {
  border-bottom: 1px solid var(--surface-200);
}

.info-row.total {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-700);
  margin-top: 0.5rem;
  border-bottom: none;
}

.label {
  color: var(--text-color-secondary);
  font-weight: 500;
}

.value {
  color: var(--text-color);
  font-weight: 600;
}

.actions {
  margin-top: 2rem;
}

.new-order-button {
  background: var(--primary-500) !important;
  border: none !important;
  padding: 1rem 2rem !important;
  font-size: 1.125rem !important;
  font-weight: 600 !important;
  transition: transform 0.2s ease;
}

.new-order-button:hover {
  transform: scale(1.05);
}

.new-order-button i {
  margin-right: 0.5rem;
}

.new-order-button:enabled:hover {
  background: var(--primary-600) !important;
}

@media screen and (max-width: 480px) {
  .confirmation-page {
    padding: 1rem;
  }

  .confirmation-card {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .success-icon i {
    font-size: 3rem;
  }
}
</style>
