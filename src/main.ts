import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import BaseModal from './components/BaseModal.vue'


const app = createApp(App)
app.component('VueDatePicker', VueDatePicker)
app.component('BaseModal', BaseModal)



app.mount('#app')
