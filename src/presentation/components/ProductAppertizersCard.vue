<template>
  <div class="product-card">
    <div class="product-image">
      <img v-if="product.image && !hasImageError" :src="product.image" :alt="product.name" @error="handleImageError" />
      <div v-else class="image-placeholder">
        <i class="fas fa-image"></i>
        <span>Imagem não disponível</span>
      </div>
    </div>

    <div class="product-content">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>

      <div class="product-footer">
        <span class="product-price">{{ formatPrice(product.price_small) }}</span>
        <Button class="add-to-cart" @click="addToCart('small')" :loading="loading">
          <i class="pi pi-shopping-cart"></i>
          Pequeno
        </Button>
      </div>

      <div class="product-footer">
        <span class="product-price">{{ formatPrice(product.price_large) }}</span>
        <Button class="add-to-cart" @click="addToCart('large')" :loading="loading">
          <i class="pi pi-shopping-cart"></i>
          Grande
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

interface ProductProps {
  id: string | number
  name: string
  description: string
  price_large: number
  price_small: number
  image: string | null
}

const props = defineProps<{
  product: ProductProps
}>()

const router = useRouter()
const toast = useToast()
const loading = ref(false)
const hasImageError = ref(false)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

const handleImageError = () => {
  hasImageError.value = true
}

const addToCart = async (size: 'large' | 'small') => {
  loading.value = true
  try {
    const cartItem = {
      id: props.product.id,
      name: props.product.name + (size === 'large' ? ' (Grande)' : ' (Pequeno)'),
      price: size === 'large' ? props.product.price_large : props.product.price_small,
      quantity: 1,
      image: props.product.image
    }

    const currentCart = localStorage.getItem('burgerlivery:cart')
    let cart = currentCart ? JSON.parse(currentCart) : []

    const existingItem = cart.find((item: any) => 
      item.id === cartItem.id && item.name === cartItem.name
    )

    if (existingItem) {
      existingItem.quantity++
    } else {
      cart.push(cartItem)
    }

    localStorage.setItem('burgerlivery:cart', JSON.stringify(cart))

    toast.add({
      severity: 'success',
      summary: 'Item adicionado',
      detail: `${cartItem.name} foi adicionado ao carrinho`,
      life: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.product-card {
  background: var(--surface-0);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: var(--surface-100);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, var(--surface-100), var(--surface-200));
  color: var(--surface-600);
  gap: 0.75rem;
  padding: 1rem;
  text-align: center;
}

.image-placeholder i {
  font-size: 3rem;
  opacity: 0.7;
}

.image-placeholder span {
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.9;
  max-width: 150px;
  line-height: 1.4;
}

.product-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.product-description {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
  flex: 1;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  gap: 10px;
  /* Adiciona espaço entre os botões */
}

.product-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  /* Adiciona espaço vertical entre os botões */
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-700);
}

.add-to-cart {
  background-color: var(--primary-500) !important;
  border: none !important;
  padding: 0.75rem 1.5rem !important;
}

.add-to-cart:enabled:hover {
  background-color: var(--primary-600) !important;
}

.add-to-cart i {
  margin-right: 0.5rem;
}
</style>
