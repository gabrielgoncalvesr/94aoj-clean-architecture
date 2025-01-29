import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import router from './presentation/router'
import ToastService from 'primevue/toastservice'

// PrimeVue Components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Divider from 'primevue/divider'
import Dialog from 'primevue/dialog'

// Styles
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './assets/global.css'

const app = createApp(App)

// Use plugins
app.use(PrimeVue, { ripple: true })
app.use(router)
app.use(ToastService)

// Register components
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Divider', Divider)
app.component('Dialog', Dialog)

app.mount('#app')
