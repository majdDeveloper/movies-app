import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/style/scss/main.scss'
import '@fortawesome/fontawesome-free/css/all.css'
createApp(App).use(store).use(router).mount('#app')
