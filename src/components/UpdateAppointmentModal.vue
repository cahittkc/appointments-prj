<template>
  <BaseModal :isOpen="isOpen" @close="$emit('close')">
    <template #title>
      <div class="flex items-center gap-x-1.5">
        <CalendarPlus2 class="w-5 h-5" />
        <span class="text-md font-semibold text-gray-500">Edit the Appointment</span>
      </div>
    </template>

    <template #content>
      <div class="flex flex-col gap-y-2.5">
        <div v-if="!addContactModalShow && selectedAppointment.contact_id.length === 0" @click="addContactModalShow = true" class="flex cursor-pointer bg-white gap-y-2 flex-1 items-center justify-center border border-dashed border-gray-300 rounded-lg p-4 min-h-[98px] relative">
          <UserPlus2 class="w-5 h-5 text-gray-500" />            
        </div>
        <div class="max-h-60 overflow-y-auto flex flex-col gap-y-2.5" >
          <template v-for="c in selectedAppointment.contact_id">
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
        <div class="-mt-5" v-if="v$ && v$.selectedAppointment && v$.selectedAppointment.contact_id && v$.selectedAppointment.contact_id.$errors && v$.selectedAppointment.contact_id.$errors.length > 0">
          <span class="text-[11px] text-red-500">At least one person must be added</span>
        </div>
        <AddContactModal 
          :is-open="addContactModalShow" 
          @close="addContactModalShow = false"
          :contacts="contacts"
          :selected-contact-ids="selectedAppointment.contact_id"
          @select-contact="addContact">
          <template #title>
            <div class="flex items-center gap-x-1.5">
              <UserPlus2 class="w-5 h-5" />
              <span class="text-md font-semibold text-gray-500">Add Contact</span>
            </div>
          </template>
          <template #body>
            <div class="flex flex-col gap-y-6 mt-6">
              <div class="relative">
                <div class="flex items-center group w-full">
                  <input v-model="searchContactQuery" type="text" placeholder="Search..." class="w-full pl-10 pr-4 py-2.5 h-[42px] bg-gray-50 border border-gray-300 rounded-tl-lg rounded-bl-lg focus:outline-none" />
                  <div class="px-3 py-2.5 bg-black h-[42px] flex items-center justify-center border border-gray-300 transition-all rounded-tr-lg rounded-br-lg">
                    <Search class="text-white w-4 h-4" />
                  </div>
                </div>
                <div v-if="searchContactQuery && availableContacts.length > 0" class="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  <div v-for="contact in availableContacts" :key="contact.id" @click="addContact(contact.id)" class="flex items-center gap-x-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <div class="flex flex-col text-left">
                      <span class="text-sm">{{ contact.fields.contact_name }} {{ contact.fields.contact_surname }}</span>
                      <span class="text-xs text-gray-500">{{ contact.fields.contact_email }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </AddContactModal>

        <div class="flex flex-col gap-y-0.5">
          <div :class="{'border-red-600': v$.selectedAppointment.appointment_address.$errors.length > 0}" v-if="!addContactModalShow" class="flex items-center h-[42px] bg-white border border-gray-300 rounded-sm w-full relative">
            <span v-if="selectedAppointment.appointment_address == ''" class="text-xs text-gray-500 absolute top-[11px] -translate-y-1/2 left-3">Address</span>
            <input :class="{'pt-4 !pl-10' : selectedAppointment.appointment_address == ''}" v-model="selectedAppointment.appointment_address" type="text"  class="w-full pl-4 pr-4 py-2.5 h-[42px] text-xs outline-0" />
            <X @click="selectedAppointment.appointment_address = ''" class="absolute right-3 top-2 cursor-pointer text-gray-500 w-4 h-4" />
          </div>
          <div v-for="error of v$.selectedAppointment.appointment_address.$errors" :key="error.$uid">
            <span v-if="v$.selectedAppointment.appointment_address.$errors" class="text-[11px] text-red-500"> Address is required </span>
          </div>
        </div>

        <AgentDropdown
          v-if="!addContactModalShow"
          :agents="agents"
          :selected-agent-ids="selectedAppointment.agent_id"
          :is-open="showAgentDropdown"
          :has-error="v$.selectedAppointment.agent_id.$errors.length > 0"
          @toggle-dropdown="() => showAgentDropdown = !showAgentDropdown"
          @toggle-agent="toggleAgent"
        />

        <div v-if="!addContactModalShow" class="modal relative">
          <VueDatePicker :teleport="true" auto-apply :clearable="false" :min-date="new Date()"  format="dd/MM/yyyy HH:mm" v-model="selectedAppointment.appointment_date" class="w-[240px] text-xs before:content-['Appointment_Date'] before:absolute before:top-0.5 before:left-3 before:text-[11px] before:z-10  before:text-gray-500" name="" id="" />
        </div>

        <div v-if="!addContactModalShow" class="flex items-center h-[42px] bg-white border border-gray-300 rounded-sm w-full relative">
          <select v-model="selectedAppointment.is_cancelled" class="w-full pl-4 pr-4 py-2.5 h-[42px] text-xs outline-0 bg-transparent appearance-none cursor-pointer">
            <template v-if="new Date(selectedAppointment.appointment_date) > new Date()">
              <option :value="false">Upcoming</option>
              <option :value="true">Cancelled</option>
            </template>
            <template v-else>
              <option :value="false">Completed</option>
              <option :value="true">Cancelled</option>
            </template>
          </select>
          <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
        </div>

        <!-- Related Appointments -->
        <div v-if="selectedAppointment.contact_id.length > 0 && !addContactModalShow" class="mt-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Related Appointments</h4>
          <div class="overflow-y-auto max-h-[188px] space-y-2">
            <template v-for="contactId in selectedAppointment.contact_id" :key="contactId">
              <div v-for="relatedApp in getContactOtherAppointments(contactId)" :key="relatedApp.id" @click="$emit('select-related-appointment', relatedApp)" class="flex sm:items-center max-sm:flex-col max-sm:gap-y-2 justify-between gap-4 p-4 bg-white rounded-lg border border-gray-300 cursor-pointer">
                <div class="flex flex-col gap-1 max-md:gap-y-3 flex-1">
                  <div class="text-sm font-medium text-gray-900 flex gap-x-2 items-center">
                    <House class="w-4 h-4 min-w-4 min-h-4 flex-shrink-0 text-gray-500" />
                    <span>{{ relatedApp.fields.appointment_address }}</span>
                  </div>
                  <AppointmentStatusDate 
                    :is_cancelled="relatedApp.fields.is_cancelled" 
                    :appointment_date="relatedApp.fields.appointment_date" 
                  />
                </div>
                <div class="flex items-center gap-x-2">
                  <template v-for="(agentId, index) in relatedApp.fields.agent_id" :key="agentId">
                    <div v-if="findAgent(agentId) && index < 1" class="relative group -ml-3 first:ml-0">
                      <div 
                        class="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ring-2 ring-white"
                        :style="{ backgroundColor: findAgent(agentId)?.fields?.color || '#gray-400' }"
                      >
                        <span class="text-white text-xs">
                          {{ findAgent(agentId)?.fields?.agent_name?.[0] || '?' }}{{ findAgent(agentId)?.fields?.agent_surname?.[0] || '?' }}
                        </span>
                      </div>
                    </div>
                  </template>
                  <div v-if="relatedApp.fields.agent_id?.length > 1" class="relative group -ml-3">
                    <div 
                      class="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center cursor-pointer ring-2 ring-white"
                    >
                      <span class="text-white font-medium text-xs">
                        +{{ relatedApp.fields.agent_id?.length - 1 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-x-2 mt-auto">
        <button  @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">Close</button>
        <button @click="updateAppointment" :disabled="updateIsLoading" class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-500 border border-transparent rounded-md shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed">
          <Loader2 v-if="updateIsLoading" class="w-4 h-4 mr-2 -ml-1 animate-spin" />
          Save
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script>
import { required, minLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { CalendarPlus2, Search, X, House, Loader2, UserPlus2, ChevronDown } from 'lucide-vue-next'
import ContactInfo from './ContactInfo.vue'
import AgentDropdown from './AgentDropdown.vue'
import BaseModal from './BaseModal.vue'
import AddContactModal from './AddContactModal.vue'
import AppointmentStatusDate from './AppointmentStatusDate.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import { apiService } from '../service/axiosService'

export default {
  name: 'UpdateAppointmentModal',
  setup () {
    return { v$: useVuelidate() }
  },
  components: {
    CalendarPlus2,
    Search,
    X,
    House,
    Loader2,
    UserPlus2,
    ChevronDown,
    ContactInfo,
    AgentDropdown,
    BaseModal,
    AddContactModal,
    AppointmentStatusDate,
    VueDatePicker
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    selectedAppointment: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'appointment-updated', 'select-related-appointment'],
  data() {
    return {
      searchContactQuery: '',
      updateIsLoading: false,
      showAgentDropdown: false,
      addContactModalShow: false
    }
  },
  computed: {
    agents() {
      return this.$store.state.agents.agents
    },
    contacts() {
      return this.$store.state.contacts.contacts
    },
    appointments() {
      return this.$store.state.appointments.appointments
    },
    availableContacts() {
      if (!this.searchContactQuery) return []
      
      const query = this.searchContactQuery.toLowerCase()
      return this.contacts.filter(contact => {
        const isAlreadySelected = this.selectedAppointment.contact_id.includes(contact.id)
        if (isAlreadySelected) return false
        
        const name = contact.fields.contact_name.toLowerCase()
        const surname = contact.fields.contact_surname.toLowerCase()
        const email = contact.fields.contact_email.toLowerCase()
        
        return name.includes(query) || surname.includes(query) || email.includes(query)
      })
    }
  },
  validations: {
    selectedAppointment: {
      id: { required },
      appointment_date: { required },
      appointment_address: { required },
      contact_id: { minLength: minLength(1), required },
      agent_id: { minLength: minLength(1), required },
      is_cancelled: {}
    }
  },
  watch: {
    isOpen(newVal) {
      if (!newVal) {
        this.searchContactQuery = ''
        this.addContactModalShow = false
        this.showAgentDropdown = false
        if (this.v$) {
          this.v$.$reset();
        }
      }
    }
  },
  methods: {
    getContactOtherAppointments(contactId) {
      return this.appointments.filter(app => {
        const appContactIds = Array.isArray(app.fields.contact_id) ? app.fields.contact_id : [app.fields.contact_id]
        return appContactIds.includes(contactId) && app.id !== this.selectedAppointment.id
      }).sort((a, b) => {
        const dateA = new Date(a.fields.appointment_date)
        const dateB = new Date(b.fields.appointment_date)
        return dateB.getTime() - dateA.getTime()
      })
    },
    addContact(contactId) {
      this.selectedAppointment.contact_id.push(contactId)
      this.addContactModalShow = false
    },
    removeContact(contactId) {
      this.selectedAppointment.contact_id = this.selectedAppointment.contact_id.filter(c => c !== contactId)
    },
    toggleAgent(agentId) {
      if (this.selectedAppointment.agent_id.includes(agentId)) {
        this.selectedAppointment.agent_id = this.selectedAppointment.agent_id.filter(id => id !== agentId)
      } else {
        this.selectedAppointment.agent_id.push(agentId)
      }
    },
    getContactField(contactId, field) {
      const contact = this.contacts.find(c => c.id === contactId)
      if (!contact || !contact.fields || !contact.fields[field]) return ''
      const value = Array.isArray(contact.fields[field]) ? contact.fields[field][0] : contact.fields[field]
      return String(value)
    },
    findAgent(agentId) {
      return this.agents.find(a => a.id === agentId)
    },
    async updateAppointment() {
      const valid = await this.v$.$validate()
      if (!valid) {
        return
      }
      
      this.updateIsLoading = true
      
      if (this.selectedAppointment.agent_id) {
        this.selectedAppointment.agent_id = this.selectedAppointment.agent_id.filter(id => id !== undefined && id !== null)
      }
      
      try {
        const records = [
          {
            id: this.selectedAppointment.id,
            fields: {
              appointment_date: this.selectedAppointment.appointment_date,
              appointment_address: this.selectedAppointment.appointment_address,
              contact_id: this.selectedAppointment.contact_id,
              agent_id: this.selectedAppointment.agent_id,
              is_cancelled: this.selectedAppointment.is_cancelled,
            }
          }
        ]

        const response = await apiService.patch(`/appointments`, { records })

        if (response.status === 200) {
          const updatedAppointment = response.data.records[0]
          this.$emit('appointment-updated', updatedAppointment)
        }
      } catch (error) {
        console.error('Error updating appointment:', error.response?.data || error.message)
        this.$toast.error("Appointment updated failed")
      } finally {
        this.updateIsLoading = false
      }
    }
  }
}
</script>