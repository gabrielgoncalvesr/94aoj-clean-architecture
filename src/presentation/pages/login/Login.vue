<template>
  <div class="split-screen">
    <!-- Left side - Login Form -->
    <div class="left-side">
      <div class="login-content">
        <div class="logo-section">
          <img src="/burger-logo.svg" alt="Logo" class="logo" />
          <h1 class="brand-name">Burgerlivery</h1>
          <p class="brand-slogan">Sabor artesanal em cada mordida</p>
        </div>

        <form @submit.prevent="login" class="login-form">
          <div class="form-group">
            <label for="email">E-mail</label>
            <InputText 
              id="email" 
              v-model="email" 
              name="email"
              type="email"
              placeholder="seu@email.com"
              @input="changeValue"
              :class="{ 'p-invalid': fieldError }"
            />
            <small class="error-text" v-if="fieldError">{{ fieldError }}</small>
          </div>

          <div class="form-group">
            <label for="password">Senha</label>
            <Password
              id="password"
              v-model="password"
              name="password"
              placeholder="••••••••"
              :feedback="false"
              toggleMask
              @input="changeValue"
              :class="{ 'p-invalid': fieldError }"
              :pt="{
                input: { class: 'w-full' },
                showIcon: { class: 'password-icon' },
                hideIcon: { class: 'password-icon' }
              }"
            />
          </div>

          <Button 
            type="submit" 
            :loading="loading"
            :disabled="!valid || loading"
            :label="loading ? 'Entrando...' : 'Entrar'"
          />
        </form>
      </div>
    </div>

    <!-- Right side - Image -->
    <div class="right-side">
      <div class="content-overlay">
        <h2>Bem-vindo ao sabor artesanal</h2>
        <p>Os melhores hambúrgueres gourmet da cidade</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">   
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { MakeAuthentication } from '../../../main/factories/services/authenticationFactory'

const router = useRouter()
const authentication = MakeAuthentication()

const email = ref<string>('')
const password = ref<string>('')
const fieldError = ref<string>('')
const valid = ref<boolean>(true)
const loading = ref<boolean>(false)

const validateEmail = (value: string): string => {
  if (!value) {
    return 'E-mail é obrigatório'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'E-mail inválido'
  }
  return ''
}

const validatePassword = (value: string): string => {
  if (!value) {
    return 'Senha é obrigatória'
  }
  if (value.length < 6) {
    return 'Senha deve ter no mínimo 6 caracteres'
  }
  return ''
}

const changeValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  if (target.name === 'email') {
    fieldError.value = validateEmail(value)
  } else if (target.name === 'password') {
    fieldError.value = validatePassword(value)
  }

  valid.value = !fieldError.value
}

const login = async () => {
  if (loading.value) return
  
  // Validação antes de enviar
  const emailError = validateEmail(email.value)
  const passwordError = validatePassword(password.value)
  
  if (emailError || passwordError) {
    fieldError.value = emailError || passwordError
    valid.value = false
    return
  }

  loading.value = true
  fieldError.value = ''
  
  try {
    console.log('Iniciando login...')
    const response = await authentication.auth({
      login: email.value,
      password: password.value
    })
    console.log('Resposta do login:', response)

    if (!response?.token) {
      throw new Error('Token não recebido do servidor')
    }

    // Salvar token e dados do usuário
    localStorage.setItem('burgerlivery:token', response.token)
    localStorage.setItem('burgerlivery:user', JSON.stringify({
      name: response.userName,
      email: response.email
    }))

    console.log('Login realizado com sucesso, redirecionando...')
    // Redirecionar para a página inicial
    await router.push('/')
  } catch (error: any) {
    console.error('Erro no login:', error)
    fieldError.value = error?.message || 'Erro ao realizar login'
    valid.value = false
  } finally {
    loading.value = false
  }
}
</script>

<style>
.split-screen {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.left-side {
  flex: 0 0 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 2rem;
}

.right-side {
  flex: 0 0 50%;
  background: url('https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop') center/cover no-repeat;
  position: relative;
}

.login-content {
  width: 100%;
  max-width: 400px;
  padding: 0 1rem;
}

.logo-section {
  text-align: center;
  margin-bottom: 3rem;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 1rem;
}

.brand-name {
  color: var(--primary-color);
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
}

.brand-slogan {
  color: var(--text-color-secondary);
  font-size: 1.1rem;
  margin: 0.5rem 0 0;
  font-style: italic;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--text-color);
}

.error-text {
  color: var(--red-500);
  font-size: 0.875rem;
}

:deep(.password-icon) {
  color: var(--primary-color);
  margin-top: -0.5rem;
}

.content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 2rem;
}

.content-overlay h2 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.content-overlay p {
  font-size: 1.5rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .split-screen {
    flex-direction: column;
  }

  .left-side {
    flex: none;
    min-height: 100vh;
    width: 100%;
    padding: 1rem;
  }

  .right-side {
    flex: none;
    width: 100%;
    height: 30vh;
    min-height: 250px;
  }

  .login-content {
    padding: 2rem 0;
  }
}
</style>
