<template>
  <div class="app">
    <Toast />
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

// Inicializa o serviço de toast
useToast()

// App root component
</script>

<style>
.app {
  min-height: 100vh;
  background-color: var(--surface-ground);
}

/* Estilos para o Toast */
.p-toast {
  z-index: 1000;
}

.p-toast .p-toast-message {
  margin: 0 1rem 1rem 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 8px;
}

.p-toast .p-toast-message .p-toast-message-content {
  padding: 1rem;
  border-width: 0;
}

.p-toast .p-toast-message .p-toast-message-content .p-toast-message-text {
  margin: 0 0 0 1rem;
}

.p-toast .p-toast-message .p-toast-message-content .p-toast-message-icon {
  font-size: 1.5rem;
}

.p-toast .p-toast-message .p-toast-message-content .p-toast-summary {
  font-weight: 600;
}

.p-toast .p-toast-message .p-toast-message-content .p-toast-detail {
  margin: 0.5rem 0 0 0;
}

.p-toast .p-toast-message.p-toast-message-success {
  background: var(--green-50);
  border: solid 1px var(--green-200);
  color: var(--green-700);
}

.p-toast .p-toast-message.p-toast-message-info {
  background: var(--blue-50);
  border: solid 1px var(--blue-200);
  color: var(--blue-700);
}

.p-toast .p-toast-message.p-toast-message-warn {
  background: var(--yellow-50);
  border: solid 1px var(--yellow-200);
  color: var(--yellow-700);
}

.p-toast .p-toast-message.p-toast-message-error {
  background: var(--red-50);
  border: solid 1px var(--red-200);
  color: var(--red-700);
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: var(--font-family);
}

#app {
  height: 100%;
}
</style>
