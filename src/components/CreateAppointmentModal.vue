<template>
  <BaseModal @close="$emit('close')" :isOpen="isOpen">
    <template #title>
      <div class="flex items-center gap-x-1.5">
        <CalendarPlus2 class="w-5 h-5" />
        <span class="text-md font-semibold text-gray-500">Create an Appointment</span>
      </div>
    </template>

    <template #content>
        <div class="flex flex-col gap-y-6 mt-6">
          <div class="relative">
            <div v-if="createAppointmentForm.contact_id.length === 0" class="flex flex-col gap-y-1">
              <div class="flex items-center group  w-full">
                <input :class="{'!border-red-600 border' :  v$.createAppointmentForm.contact_id && v$.createAppointmentForm.contact_id.$errors && v$.createAppointmentForm.contact_id.$errors.length > 0}" v-model="searchContactQuery" type="text" placeholder="Search..." class="w-full pl-10 pr-4 py-2.5 h-[42px] text-xs bg-white border border-gray-300 rounded-tl-lg rounded-bl-lg placeholder:text-center focus:outline-none" />
                <div class="px-3 py-2.5 bg-black h-[42px] flex items-center justify-center border border-gray-300 transition-all rounded-tr-lg rounded-br-lg">
                  <Search class="text-white w-4 h-4" />
                </div>
              </div>
              <div class="flex gap-x-1 items-center" v-if=" v$.createAppointmentForm.contact_id && v$.createAppointmentForm.contact_id.$errors && v$.createAppointmentForm.contact_id.$errors.length > 0">
                  <span class="text-[11px] text-red-500"> At least one contact is required </span>
              </div>
            </div>

            <!-- Selected Contacts -->
            <div class="max-h-60 overflow-y-auto flex flex-col gap-y-2.5" >
              <template v-for="c in createAppointmentForm.contact_id">
                <div class="flex flex-col gap-y-2 flex-1 items-start bg-white border border-gray-300 rounded-lg p-4 relative">
                    <ContactInfo 
                      :contact-name="getContactField(c, 'contact_name')"
                      :contact-surname="getContactField(c, 'contact_surname')"
                      :contact-email="getContactField(c, 'contact_email')"
                      :contact-phone="getContactField(c, 'contact_phone')"
                      container-class=""
                    />
                    <X @click="removeContact(c)" class="absolute right-2 top-2  text-gray-500 w-4 h-4 cursor-pointer" />                     
                </div>
              </template>
            </div>

            <!-- Search Results -->
            <div v-if="searchContactQuery && availableContacts.length > 0" class="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              <div v-for="contact in availableContacts" :key="contact.id" @click="selectContact(contact.id)" class="flex items-center gap-x-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                <div class="flex flex-col">
                  <span class="text-sm">{{ contact.fields.contact_name }} {{ contact.fields.contact_surname }}</span>
                  <span class="text-xs text-gray-500">{{ contact.fields.contact_email }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-y-1">
            <div :class="{'!border-red-600 border' : v$.createAppointmentForm.appointment_address.$errors.length > 0}" class="flex items-center h-[42px] bg-white border border-gray-300 rounded-sm w-full relative">
              <span v-if="createAppointmentForm.appointment_address === ''" class="text-xs text-gray-500 absolute top-[11px] -translate-y-1/2 left-3">Address</span>
              <input :class="{'!pl-4' : createAppointmentForm.appointment_address !== ''}" v-model="createAppointmentForm.appointment_address" type="text"  class="w-full pl-10 pr-4 py-2.5 h-[42px] text-xs outline-0 pt-4" />
              <House class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>
            <div class="flex gap-x-1 items-center" v-for="error of v$.createAppointmentForm.appointment_address.$errors" :key="error.$uid">
                <span v-if="v$.createAppointmentForm.appointment_address.$errors" class="text-[11px] text-red-500"> Address is required </span>
            </div>
          </div>
          <AgentDropdown
            :agents="agents"
            :selected-agent-ids="createAppointmentForm.agent_id"
            :is-open="showAgentDropdown"
            :has-error=" v$.createAppointmentForm.agent_id && v$.createAppointmentForm.agent_id.$errors && v$.createAppointmentForm.agent_id.$errors.length > 0"
            @toggle-dropdown="toggleAgentDropdown"
            @toggle-agent="toggleAgent"
          />

          <div class="modal relative">
            <VueDatePicker :teleport="true" auto-apply :clearable="false" :min-date="new Date()"  format="dd/MM/yyyy HH:mm" v-model="createAppointmentForm.appointment_date" class="w-[240px] text-xs before:content-['Appointment_Date'] before:absolute before:top-0.5 before:left-3 before:text-[11px] before:z-10  before:text-gray-500" name="" id="" />
          </div>
        </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-x-2">
        <button  @click="$emit('close')" class="px-4 py-2 text-sm font-medium  bg-black text-white border border-gray-300 rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">Cancel</button>
        <button @click="createAppointment" :disabled="createIsLoading" class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-500 border border-transparent rounded-md shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed">
          <Loader2 v-if="createIsLoading" class="w-4 h-4 mr-2 -ml-1 animate-spin" />
          Create
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script>
import { required, minLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import moment from 'moment'
import { CalendarPlus2, Search, X, House, Loader2 } from 'lucide-vue-next'
import ContactInfo from './ContactInfo.vue'
import AgentDropdown from './AgentDropdown.vue'
import BaseModal from './BaseModal.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import { apiService } from '../service/axiosService'

export default {
  name: 'CreateAppointmentModal',
  setup () {
    return { v$: useVuelidate() }
  },
  components: {
    CalendarPlus2,
    Search,
    X,
    House,
    Loader2,
    ContactInfo,
    AgentDropdown,
    BaseModal,
    VueDatePicker
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'appointment-created'],
  data() {
    return {
      searchContactQuery: '',
      createIsLoading: false,
      showAgentDropdown: false,
      createAppointmentForm: {
        appointment_date: new Date(),
        appointment_address: '',
        contact_id: [],
        agent_id: []
      }
    }
  },
  computed: {
    agents() {
      return this.$store.state.agents.agents
    },
    contacts() {
      return this.$store.state.contacts.contacts
    },
    availableContacts() {
      if (!this.searchContactQuery) return []
      
      const query = this.searchContactQuery.toLowerCase()
      return this.contacts.filter(contact => {
        const isAlreadySelected = this.createAppointmentForm.contact_id.includes(contact.id)
        if (isAlreadySelected) return false
        
        const name = contact.fields.contact_name.toLowerCase()
        const surname = contact.fields.contact_surname.toLowerCase()
        const email = contact.fields.contact_email.toLowerCase()
        
        return name.includes(query) || surname.includes(query) || email.includes(query)
      })
    }
  },
  validations: {
    createAppointmentForm: {
      appointment_date: { required },
      appointment_address: { required },
      contact_id: { required, minLength: minLength(1) },
      agent_id: { required, minLength: minLength(1) }
    }
  },
  watch: {
    isOpen(newVal) {
      if (!newVal) {
        // Reset form when modal is closed
        this.createAppointmentForm = {
          appointment_date: new Date(),
          appointment_address: '',
          contact_id: [],
          agent_id: []
        }
        this.searchContactQuery = ''
        if (this.v$) {
          this.v$.$reset()
        }
      }
    }
  },
  methods: {
    selectContact(contactId) {
      this.createAppointmentForm.contact_id.push(contactId)
      this.searchContactQuery = ''
    },
    removeContact(contactId) {
      const index = this.createAppointmentForm.contact_id.indexOf(contactId)
      if (index > -1) {
        this.createAppointmentForm.contact_id.splice(index, 1)
      }
    },
    getContactField(contactId, field) {
      const contact = this.contacts.find(c => c.id === contactId)
      if (!contact || !contact.fields || !contact.fields[field]) return ''
      const value = Array.isArray(contact.fields[field]) ? contact.fields[field][0] : contact.fields[field]
      return String(value)
    },
    toggleAgentDropdown() {
      this.showAgentDropdown = !this.showAgentDropdown
    },
    toggleAgent(agentId) {
      const index = this.createAppointmentForm.agent_id.indexOf(agentId)
      if (index === -1) {
        this.createAppointmentForm.agent_id.push(agentId)
      } else {
        this.createAppointmentForm.agent_id.splice(index, 1)
      }
    },
    async createAppointment() {
      const valid = await this.v$.$validate()
      if (!valid) {
        return
      }
      this.createIsLoading = true
      this.createAppointmentForm.appointment_date = moment(this.createAppointmentForm.appointment_date).toDate()
      let data = {
        fields: {
          appointment_date: this.createAppointmentForm.appointment_date,
          appointment_address: this.createAppointmentForm.appointment_address,
          contact_id: this.createAppointmentForm.contact_id,
          agent_id: this.createAppointmentForm.agent_id,
          is_cancelled: false,
        },
      }
      const records = [data]
      try {
        const response = await apiService.post('/appointments', {"records" : records})
        if (response.status === 200) {
          const newAppointment = response.data.records[0]
          this.$emit('appointment-created', newAppointment)
          this.createIsLoading = false
        }
      } catch (error) {
        console.error('Error creating appointment:', error)
        this.createIsLoading = false
      }
    }
  }
}
</script>