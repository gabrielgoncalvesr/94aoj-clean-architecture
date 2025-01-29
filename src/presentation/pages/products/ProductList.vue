<template>
  <div class="products-container" ref="contentRef">
    <header class="page-header">
      <h2>{{ pageTitle }}</h2>
      <p class="category-description">{{ categoryDescription }}</p>
    </header>

    <div v-if="loading" class="loading-state">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <p>Carregando produtos...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)"></i>
      <p>{{ error }}</p>
      <Button label="Tentar novamente" @click="loadProducts" />
    </div>

    <div v-else class="products-grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="{
          id: product.id,
          name: product.title,
          description: product.description,
          price: getProductPrice(product),
          image: Array.isArray(product.image) ? product.image[0] : product.image
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../../components/ProductCard.vue'
import { MakeProducts } from '../../../main/factories/services/productsFactory'
import type { Product } from '../../../domain/models/product'

const route = useRoute()
const productsService = MakeProducts()
const contentRef = ref<HTMLElement | null>(null)

const loading = ref(false)
const error = ref<string>('')
const products = ref<Product[]>([])

const categoryTitles: Record<string, string> = {
  '/hamburgers': 'Hambúrgueres',
  '/sides': 'Acompanhamentos',
  '/desserts': 'Sobremesas',
  '/drinks': 'Bebidas'
}

const categoryDescriptions: Record<string, string> = {
  '/hamburgers': 'Nossos hambúrgueres artesanais são preparados com ingredientes frescos e de alta qualidade',
  '/sides': 'Acompanhamentos perfeitos para complementar seu hambúrguer',
  '/desserts': 'Sobremesas deliciosas para adoçar seu dia',
  '/drinks': 'Bebidas refrescantes para acompanhar seu pedido'
}

const pageTitle = computed(() => categoryTitles[route.path] || 'Produtos')
const categoryDescription = computed(() => categoryDescriptions[route.path] || '')

const getProductPrice = (product: Product): number => {
  if ('value' in product) {
    return product.value
  }
  if ('values' in product) {
    if ('single' in product.values) {
      return product.values.single
    }
    return product.values.small || 0
  }
  return 0
}

const updateScrollClass = () => {
  if (!contentRef.value) return
  
  const hasScroll = contentRef.value.scrollHeight > contentRef.value.clientHeight
  contentRef.value.classList.toggle('no-scroll', !hasScroll)
}

const loadProducts = async () => {
  loading.value = true
  error.value = ''
  
  try {
    switch (route.path) {
      case '/hamburgers':
        products.value = await productsService.getHamburgers()
        break
      case '/sides':
        products.value = await productsService.getAppetizers()
        break
      case '/desserts':
        products.value = await productsService.getDesserts()
        break
      case '/drinks':
        products.value = await productsService.getBeverages()
        break
      default:
        products.value = []
    }

    // Aguarda a renderização dos produtos
    await nextTick()
    updateScrollClass()
  } catch (err: any) {
    error.value = err.message || 'Erro ao carregar produtos'
  } finally {
    loading.value = false
  }
}

// Atualizar scroll quando a janela é redimensionada
window.addEventListener('resize', updateScrollClass)
onUnmounted(() => {
  window.removeEventListener('resize', updateScrollClass)
})

// Carregar produtos quando o componente é montado
onMounted(loadProducts)

// Recarregar produtos quando a rota muda
watch(() => route.path, loadProducts)
</script>

<style scoped>
.products-container {
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100%;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.category-description {
  font-size: 1rem;
  color: var(--text-color-secondary);
  margin: 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
  gap: 1rem;
  min-height: 400px;
}

.error-state {
  color: var(--red-500);
}
</style>
