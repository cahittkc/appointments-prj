

<template>
  <div class="relative">
    <LoadingOverlay v-if="isLoading" :is-loading="isLoading" />
    <div v-else class="p-4 fade-in" :class="{ 'fade-in-active': isPageLoaded }">
      <!-- Section filters and search box - Desktop -->
      <div class="hidden xl:flex items-center justify-between pb-8 border-b-2 border-b-gray-300 relative">
        <div class="flex items-center gap-x-5">
          <div class="flex items-center gap-x-2 p-4">
            <template v-for="(agent,index) in agents" :key="agent.id">
              <div v-if="index < 5" class="relative group -ml-3 first:ml-0">
                <div 
                  @click="filterObj.agent_ids.includes(agent.id) ? filterObj.agent_ids = filterObj.agent_ids.filter((id : any) => id !== agent.id) : filterObj.agent_ids.push(agent.id)"
                  class="group w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ring-2 ring-white relative"
                  :style="{ backgroundColor: agent.fields.color }"
                  :class="{'!ring-3 !ring-pink-500 transition-all': filterObj.agent_ids.includes(agent.id)}"
                  >
                  <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {{ agent.fields.agent_name }} {{ agent.fields.agent_surname }}
                  </div>
                  <span class="text-white">
                    {{ agent.fields.agent_name[0] }}{{ agent.fields.agent_surname[0] }}
                  </span>
                </div>
              </div>
            </template>
            <div v-if="agents.length > 5" class="relative group -ml-3">
              <div 
                @click="showAllAgents = !showAllAgents"
                class="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center cursor-pointer ring-2 ring-white agents-dropdown-trigger"
              >
                <span class="text-white font-medium">
                  +{{ agents.length - 5 }}
                </span>
              </div>
              <div v-if="showAllAgents" class="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-300 py-2 z-[100] agents-dropdown">
                <div v-for="agent in agents.slice(5)" :key="agent.id" @click="filterObj.agent_ids.includes(agent.id) ? filterObj.agent_ids = filterObj.agent_ids.filter((id : any) => id !== agent.id) : filterObj.agent_ids.push(agent.id)" class="flex items-center gap-x-3 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <div 
                    class="w-8 h-8 rounded-full flex items-center justify-center"
                    :style="{ backgroundColor: agent.fields.color }"
                  >
                    <span class="text-white text-sm">
                      {{ agent.fields.agent_name[0] }}{{ agent.fields.agent_surname[0] }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between flex-1">
                    <span class="text-sm text-gray-700">{{ agent.fields.agent_name }} {{ agent.fields.agent_surname }}</span>
                    <Check v-if="filterObj.agent_ids.includes(agent.id)" class="w-4 h-4 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-x-3">
            <select v-model="filterObj.status"  class="w-[150px] h-[42px] bg-white mt-[2px] border border-gray-300 rounded-lg text-xs px-3 focus:outline-none" name="" id="">
              <option :value="null">All Statuses</option>
              <option :value="'Cancelled'">Cancelled</option>
              <option :value="'Completed'">Completed</option>
              <option :value="'Upcoming'">Upcoming</option>
            </select>
          </div>

          <div class="flex items-center gap-x-1.5">
              <div class="relative">
                <VueDatePicker auto-apply :clearable="false" format="dd/MM/yyyy HH:mm" v-model="filterObj.startDate" @change="filterAppointments" class="w-[240px] text-xs before:content-['From'] before:absolute before:top-0.5 before:left-3 before:text-[11px] before:z-10 before:font-semibold before:text-gray-500" name="" id="" />
              </div>
              <div class="relative">
                <VueDatePicker auto-apply :clearable="false" format="dd/MM/yyyy HH:mm" v-model="filterObj.endDate" @change="filterAppointments" class="w-[240px] text-xs before:content-['To'] before:absolute before:top-0.5 before:left-3 before:text-[11px] before:z-10 before:font-semibold before:text-gray-500" name="" id="" />
              </div>
          </div>


        </div>
        <div class="flex items-center group w-[360px]">
          <input v-model="searchText" type="text" placeholder="Search..." class="w-full placeholder:text-center text-xs min-w-[220px] pl-10 pr-4 py-2.5 h-[42px] bg-white border border-gray-300 rounded-tl-lg rounded-bl-lg focus:outline-none" />
          <div class="px-3 py-2.5 bg-white h-[42px] flex items-center justify-center border-2 border-gray-300 transition-all rounded-tr-lg rounded-br-lg  group-focus-within:border-pink-500">
            <Search class="text--gray-500 w-4 h-4" />
          </div>
        </div>
      </div>

      <!-- Section filters and search box - Mobile & Tablet -->
      <div class="xl:hidden pb-6 border-b-2 border-b-gray-300">
        <!-- Search Bar -->
        <div class="mb-4">
          <div class="grid grid-cols-2 gap-3">
            <div class="flex items-center group w-full relative">
              <input v-model="searchText" type="text" placeholder="Search appointments..." class="w-full pl-4 pr-12 py-3 h-[48px] bg-white border border-gray-300 rounded-lg text-xs focus:outline-none" />
              <Search class="absolute right-3 text-gray-500 w-4 h-4 z-10" />
            </div>
            <div>
              <select v-model="filterObj.status" class="w-full h-[44px] text-xs bg-white border border-gray-300 rounded-lg  px-3 focus:outline-none focus:border-pink-500">
                <option :value="null">All Statuses</option>
                <option :value="'Cancelled'">Cancelled</option>
                <option :value="'Completed'">Completed</option>
                <option :value="'Upcoming'">Upcoming</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Filters Row -->
        <div class="space-y-3">
          <!-- Date Range -->
          <div class="grid grid-cols-2 gap-3">
            <div class="modal relative">
               <VueDatePicker auto-apply :clearable="false" format="dd/MM/yyyy HH:mm" v-model="filterObj.startDate" @change="filterAppointments" class="w-[240px] text-xs before:content-['From'] before:absolute before:top-0.5 before:left-3 before:text-[11px] before:z-10 before:font-semibold before:text-gray-500" name="" id="" />
            </div>
            <div class="modal relative">
              <VueDatePicker auto-apply :clearable="false" format="dd/MM/yyyy HH:mm" v-model="filterObj.endDate" @change="filterAppointments" class="w-[240px] text-xs before:content-['To'] before:absolute before:top-0.5 before:left-3 before:text-[11px] before:z-10 before:font-semibold before:text-gray-500" name="" id="" />
            </div>
          </div>

          <!-- Agents Filter -->
          <div>
            <div class="flex flex-wrap gap-1">
              <template v-for="agent in agents" :key="agent.id">
                <div 
                  @click="filterObj.agent_ids.includes(agent.id) ? filterObj.agent_ids = filterObj.agent_ids.filter((id : any) => id !== agent.id) : filterObj.agent_ids.push(agent.id)"
                  class="relative w-8 h-8 rounded-full cursor-pointer transition-all border-2"
                  :class="filterObj.agent_ids.includes(agent.id) ? 'border-pink-400 ring-2 ring-pink-200' : 'border-gray-300 hover:border-gray-400'"
                  :title="`${agent.fields.agent_name} ${agent.fields.agent_surname}`"
                >
                  <div 
                    class="w-full h-full rounded-full flex items-center justify-center text-xs text-white font-medium"
                    :style="{ backgroundColor: agent.fields.color }"
                  >
                    {{ agent.fields.agent_name[0] }}{{ agent.fields.agent_surname[0] }}
                  </div>
                  <Check v-if="filterObj.agent_ids.includes(agent.id)" class="absolute -top-1 -right-1 w-3 h-3 text-pink-600 bg-white rounded-full" />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Section new appoinment -->
      <!-- Desktop Header -->
      <div class="hidden lg:flex items-center justify-between pt-8 px-3">
        <span class="text-sm text-gray-600">{{ appointments.length }} Appointments found. </span>
        <div v-if="newAppointmentIds.length > 0" class="flex items-center gap-x-2 text-sm text-green-600 animate-pulse">
          <CheckCircle class="w-5 h-5" />
          New appointment added! The list will be sorted by date in 10 seconds.
        </div>
        <button @click="openCreateModal" class="px-4 cursor-pointer py-2 bg-pink-500 text-white flex items-center justify-between rounded-md gap-x-2.5">
          <CirclePlusIcon class="w-5 h-5 font-light" />
          <span>Create Appointment</span>
        </button>
      </div>

      <!-- Mobile/Tablet Header -->
      <div class="lg:hidden pt-6 px-3 space-y-3">
        <div v-if="newAppointmentIds.length > 0" class="flex items-center justify-center gap-x-2 text-sm text-green-600 animate-pulse">
          <CheckCircle class="w-5 h-5" />
          New appointment added! The list will be sorted by date in 10 seconds.
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-400">{{ filteredAppointments.length }} found</span>
          <button @click="openCreateModal" class="px-3 py-2 bg-pink-500 text-white flex items-center rounded-md gap-x-2">
            <CirclePlusIcon class="w-4 h-4" />
            <span class="text-sm">Create Appointment</span>
          </button>
        </div>
      </div>

      <!-- Section appointment list -->
      <div class="w-full overflow-hidden py-8 animate-fade-up" :class="{ 'animate-fade-up-active': isPageLoaded }">
          <!-- Loading State -->
          <div v-if="isFiltering" class="flex items-center justify-center py-8">
            <div class="flex items-center gap-3 text-pink-500 min-h-[calc(100vh-400px)]">
              <Loader2 class="w-6 h-6 animate-spin" />
              <span class="text-sm font-medium">Filtreleniyor...</span>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-if="!isFiltering && paginatedAppointments.length === 0" class="flex flex-col items-center justify-center py-8 md:py-16 px-4">
            <div class="mb-4 md:mb-6">
              <Vue3Lottie 
                :animationData="emptyCalendarAnimation" 
                :height="200" 
                :width="200" 
                class="md:!h-[300px] md:!w-[300px]"
                :loop="true" 
                :autoPlay="true"
              />
            </div>
            <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-2">No Appointments Found</h3>
            <p class="text-sm md:text-base text-gray-500 text-center mb-4 md:mb-6 max-w-sm md:max-w-md px-2">
              There are no appointments matching your current filters. Try adjusting your search criteria or create a new appointment.
            </p>
            <button @click="openCreateModal" class="px-4 py-2 md:px-6 md:py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-2 text-sm md:text-base">
              <CirclePlusIcon class="w-4 h-4 md:w-5 md:h-5" />
              <span>Create Appointment</span>
            </button>
          </div>
          
          <!-- Appointments List -->
          <div v-else-if="!isFiltering" class="grid gap-3 px-2 md:px-2 max-md:px-2">
            <div @click="selectAppointment(app)" v-for="(app,index) in paginatedAppointments" :key="app.id" :class="{'bg-[#f4fafa]': index % 2 === 0, 'animate-pulse border-green-500': newAppointmentIds.includes(app.id)}" class="cursor-pointer border border-gray-300 rounded-lg grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 max-md:gap-3 shadow-sm py-4 max-md:py-3">
                <div class="py-3 px-4 max-md:py-2 max-md:px-3 flex items-center">
                    <ContactInfo 
                      :contact-name="app.fields.contact_name"
                      :contact-surname="app.fields.contact_surname"
                      :contact-email="app.fields.contact_email"
                      :contact-phone="app.fields.contact_phone"
                    />
                </div>
                <div class="flex items-center w-full">
                    <div class="flex flex-col gap-y-2.5 max-md:gap-y-2 flex-1 items-start px-4 max-md:px-3 max-md:py-2">
                          <div class="text-sm max-md:text-xs font-medium text-gray-900 flex gap-x-2 items-center">
                            <House class="w-5 h-5 max-md:w-4 max-md:h-4 min-w-5 min-h-5 max-md:min-w-4 max-md:min-h-4 text-gray-500 flex-shrink-0" />
                            <span class="font-semibold text-black break-words line-clamp-2 max-md:line-clamp-3 leading-tight">{{ app.fields.appointment_address }}</span>
                          </div>
                    </div>
                </div>
                <div class="py-3 px-4 max-md:py-2 max-md:px-3 flex items-center w-full">
                    <AppointmentStatusDate 
                      :is_cancelled="app.fields.is_cancelled" 
                      :appointment_date="app.fields.appointment_date" 
                    />
                </div>
                <div class="py-3 px-4 max-md:py-2 max-md:px-3 flex items-center justify-center max-xl:justify-start w-full">
                    <div class="flex items-center gap-x-2 max-md:gap-x-1">
                      <template v-for="(agentId, index) in app.fields.agent_id" :key="agentId">
                        <div v-if="findAgent(agentId) && index < 2" class="relative group -ml-3 max-md:-ml-2 first:ml-0">
                          <div 
                              class="w-10 h-10 max-md:w-8 max-md:h-8 rounded-full flex items-center justify-center cursor-pointer ring-2 ring-white"
                              :style="{ backgroundColor: findAgent(agentId)?.fields?.color || '#gray-400' }"
                            >
                              <span class="text-white text-sm max-md:text-xs">
                                {{ findAgent(agentId)?.fields?.agent_name?.[0] || '?' }}{{ findAgent(agentId)?.fields?.agent_surname?.[0] || '?' }}
                              </span>
                          </div>
                        </div>
                      </template>
                      <div v-if="app.fields.agent_id?.length > 2" class="relative group -ml-3 max-md:-ml-2">
                        <div 
                          @click.stop="showAgentListForAppointment[app.id] = !showAgentListForAppointment[app.id]"
                          class="w-10 h-10 max-md:w-8 max-md:h-8 bg-gray-400 rounded-full flex items-center justify-center cursor-pointer ring-2 ring-white"
                        >
                          <span class="text-white font-medium text-sm max-md:text-xs">
                            +{{ app.fields.agent_id?.length - 2 }}
                          </span>
                        </div>
                        <div v-if="showAgentListForAppointment[app.id]" class="absolute top-full -left-[130px] max-md:-left-10 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-300 py-2 z-[100]" data-appointment-dropdown :data-appointment-id="app.id">
                          <div @click="(e) => {e.stopPropagation();}" v-for="agentId in app.fields.agent_id.slice(2)" :key="agentId" class="flex items-center gap-x-3 px-4 py-2 hover:bg-gray-50">
                            <div 
                              class="w-8 h-8 rounded-full flex items-center justify-center"
                              :style="{ backgroundColor: findAgent(agentId)?.fields?.color || '#gray-400' }"
                            >
                              <span class="text-white text-sm">
                                {{ findAgent(agentId)?.fields?.agent_name?.[0] || '?' }}{{ findAgent(agentId)?.fields?.agent_surname?.[0] || '?' }}
                              </span>
                            </div>
                            <span class="text-sm text-gray-700">{{ findAgent(agentId)?.fields?.agent_name || 'Unknown' }} {{ findAgent(agentId)?.fields?.agent_surname || 'Agent' }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
        </div>
      </div>


      <!-- Pagination controls -->
      <!-- Desktop Pagination -->
      <div class="hidden lg:flex items-center justify-end gap-x-2 mt-8 animate-fade-up" :class="{ 'animate-fade-up-active': isPageLoaded }" v-if="totalPages > 1">
        <button 
          @click="changePage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft class="w-6 h-6" />
        </button>
        
        <template v-for="page in displayedPages" :key="page">
          <template v-if="page === '...'">
            <span class="px-3 py-1">...</span>
          </template>
          <template v-else>
            <button 
              @click="changePage(page)"
              class="px-3 py-1 rounded-md cursor-pointer" 
              :class="currentPage === page ? 'border border-blue-300 text-blue-300' : 'bg-gray-100 text-gray-700'"
            >
              {{ page }}
            </button>
          </template>
        </template>

        <button 
          @click="changePage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRightIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile/Tablet Pagination -->
      <div class="lg:hidden flex items-center justify-center gap-x-1 mt-6 animate-fade-up" :class="{ 'animate-fade-up-active': isPageLoaded }" v-if="totalPages > 1">
        <button 
          @click="changePage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="p-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        
        <div class="flex items-center gap-x-1 mx-2">
          <template v-for="page in displayedPages.slice(0, 5)" :key="page">
            <template v-if="page === '...'">
              <span class="px-2 py-1 text-sm">...</span>
            </template>
            <template v-else>
              <button 
                @click="changePage(page)"
                class="px-2 py-1 rounded-md cursor-pointer text-sm min-w-[32px]" 
                :class="currentPage === page ? 'border border-pink-300 text-pink-600 bg-pink-50' : 'bg-gray-100 text-gray-700'"
              >
                {{ page }}
              </button>
            </template>
          </template>
        </div>

        <button 
          @click="changePage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          class="p-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>


  <!--Create Appoinment Modal-->
  <CreateAppointmentModal 
    :isOpen="createAppointmentModalShow" 
    @close="closeCreateAppointmentModal" 
    @appointment-created="handleAppointmentCreated"
  />


   <!--Update Appoinment Modal-->
  <UpdateAppointmentModal
    :is-open="updateModal"
    :selected-appointment="selectedAppointment"
    @close="closeUpdateModal"
    @appointment-updated="handleAppointmentUpdated"
    @select-related-appointment="selectAppointmentForRelated"
  />


</template>

<script lang="ts">
import { Agent, Appointment, Contact, editAppointmentForm } from '@/models'
import { useToast } from 'vue-toastification'
import { User, Mail, Phone, House, Search, Check, ChevronLeft, ChevronRightIcon, CirclePlusIcon, CalendarPlus2, ChevronDown, X, Loader2, UserPlus2, CheckCircle } from 'lucide-vue-next';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { Vue3Lottie } from 'vue3-lottie';
import Calendar from "../public/Calendar.json"
import LoadingOverlay from './components/LoadingOverlay.vue';
import AppointmentStatusDate from './components/AppointmentStatusDate.vue';
import ContactInfo from './components/ContactInfo.vue';
import CreateAppointmentModal from './components/CreateAppointmentModal.vue'
import UpdateAppointmentModal from './components/UpdateAppointmentModal.vue'
import moment from 'moment';
// Vuex store will be accessed via this.$store

const toast = useToast()

export default {
  name: 'App',
  components: {
    LoadingOverlay,
    AppointmentStatusDate,
    ContactInfo,
    CreateAppointmentModal,
    UpdateAppointmentModal,
    VueDatePicker,
    Vue3Lottie,
    User,
    Mail,
    Phone,
    House,
    Search,
    Check,
    ChevronLeft,
    ChevronRightIcon,
    CirclePlusIcon,
    CalendarPlus2,
    ChevronDown,
    X,
    Loader2,
    UserPlus2,
    CheckCircle
  },
  data() {
    return {
      emptyCalendarAnimation: Calendar,
      newAppointmentIds: [] as string[],
      showAllAgents: false,
      showAgentListForAppointment: {} as Record<string, boolean>,
      searchText: '',
      createAppointmentModalShow: false,
      selectedAppointment: {
        id: '',
        appointment_date: '',
        appointment_address: '',
        contact_id: [],
        agent_id: [],
        is_cancelled: false,
      } as editAppointmentForm,
      updateModal: false,
      currentPage: 1,
      itemsPerPage: 10,
      filterObj: {
        agent_ids : [] as string[],
        status: null as string | null,
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(9, 0, 0, 0),
        endDate: new Date().setHours(18, 0, 0, 0)
      },
      isPageLoaded: false,
      isFiltering: false
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
    isLoading() {
      return this.$store.state.agents.isLoading || this.$store.state.contacts.isLoading || this.$store.state.appointments.isLoading
    },
    // Computed property for filtered appointments
    filteredAppointments() {
      const { status, startDate, endDate, agent_ids } = this.filterObj
      const searchQuery = this.searchText.toLowerCase()
      
      // Optimize filtering process - apply all filters in a single pass
      return this.appointments.filter((app: Appointment) => {
        // Always show newly added appointments (for animation)
        if (this.newAppointmentIds.includes(app.id)) {
          return true
        }
        // Status filter
        if (status !== null && typeof status === 'string') {
          const currentStatus = this.appointmentStatus(app.fields.is_cancelled, app.fields.appointment_date)
          if (currentStatus.toLowerCase() !== status.toLowerCase()) {
            return false
          }
        }
        
        // Date range filter
        if (startDate && endDate) {
          const startMoment = moment(startDate)
          const endMoment = moment(endDate)
          const appointmentMoment = moment(app.fields.appointment_date)
          
          if (!appointmentMoment.isBetween(startMoment, endMoment, 'minute', '[]')) {
            return false
          }
        }
        
        // Agent filter
        if (agent_ids.length > 0) {
          if (!app.fields.agent_id || !Array.isArray(app.fields.agent_id) || 
              !app.fields.agent_id.some(agentId => agent_ids.includes(agentId))) {
            return false
          }
        }
        
        // Search text filter - only apply if 3 or more characters
        if (searchQuery && searchQuery.length >= 3) {
          const contactName = Array.isArray(app.fields.contact_name) && app.fields.contact_name.length > 0 ? 
                            app.fields.contact_name[0] : ''
          const contactSurname = Array.isArray(app.fields.contact_surname) && app.fields.contact_surname.length > 0 ? 
                               app.fields.contact_surname[0] : ''
          const contactEmail = Array.isArray(app.fields.contact_email) && app.fields.contact_email.length > 0 ? 
                             app.fields.contact_email[0] : ''
          const contactPhone = Array.isArray(app.fields.contact_phone) && app.fields.contact_phone.length > 0 ? 
                             app.fields.contact_phone[0].toString() : ''
          
          const matchesSearch = (
            // Search in address
            app.fields.appointment_address.toLowerCase().includes(searchQuery) ||
            // Search in customer name
            contactName.toLowerCase().includes(searchQuery) ||
            contactSurname.toLowerCase().includes(searchQuery) ||
            // Search in email
            contactEmail.toLowerCase().includes(searchQuery) ||
            // Search in phone number
            contactPhone.includes(searchQuery)
          )
          
          if (!matchesSearch) {
            return false
          }
        }
        
        // Passed all filters
        return true
      })
    },

    paginatedAppointments() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      // Now using filteredAppointments instead of appointments
      return this.filteredAppointments.slice(start, end)
    },

    totalPages() {
      // Now using filteredAppointments instead of appointments
      return Math.ceil(this.filteredAppointments.length / this.itemsPerPage)
    },
    displayedPages() {
      const total = this.totalPages
      const current = this.currentPage
      const delta = 2 // Number of pages to show on each side

      let pages: (number | string)[] = []

      // Always show first page
      pages.push(1)

      // Calculate range around current page
      const rangeStart = Math.max(2, current - delta)
      const rangeEnd = Math.min(total - 1, current + delta)

      // Add dots after 1 if needed
      if (rangeStart > 2) {
        pages.push('...')
      }

      // Add pages in range
      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i)
      }

      // Add dots before last page if needed
      if (rangeEnd < total - 1) {
        pages.push('...')
      }

      // Always show last page if there is more than one page
      if (total > 1) {
        pages.push(total)
      }

      return pages
    }
  },
  watch: {
    "filterObj" : {
      handler() {
        this.filterAppointments()
      },
      deep: true
    },
    "searchText": {
      handler(newVal) {
        // Only filter when search text is 3 characters or more, or when empty
        if (newVal.length >= 3 || newVal.length === 0) {
          this.filterAppointments()
        }
      },
      // Add debounce to filter after user finishes typing, not on every keystroke
      immediate: false
    },

  },
  methods: {
    selectAppointment(appointment: Appointment) {
      const currentStatus = this.appointmentStatus(appointment.fields.is_cancelled, appointment.fields.appointment_date)
      
      const appointmentData = {
        id: appointment.id,
        appointment_date: appointment.fields.appointment_date,
        appointment_address: appointment.fields.appointment_address,
        contact_id: Array.isArray(appointment.fields.contact_id) ? [...appointment.fields.contact_id] : [appointment.fields.contact_id],
        agent_id: Array.isArray(appointment.fields.agent_id) ? [...appointment.fields.agent_id].filter(id => id !== undefined && id !== null) : [appointment.fields.agent_id].filter(id => id !== undefined && id !== null),
        is_cancelled: currentStatus === 'Cancelled',
        status: currentStatus
      }
      
      this.selectedAppointment = appointmentData
      this.updateModal = true
    },
    selectAppointmentForRelated(relatedApp: Appointment){
      const currentStatus = this.appointmentStatus(relatedApp.fields.is_cancelled, relatedApp.fields.appointment_date)
      
      // In Completed status, is_cancelled should be false so "Completed" appears in selectbox
      let isCancelled = false
      if (currentStatus === 'Cancelled') {
        isCancelled = true
      } else if (currentStatus === 'Completed' || currentStatus === 'Upcoming') {
        isCancelled = false
      }
      
      this.selectedAppointment = {
        id: relatedApp.id,
        appointment_date: relatedApp.fields.appointment_date,
        appointment_address: relatedApp.fields.appointment_address,
        contact_id: relatedApp.fields.contact_id,
        agent_id: Array.isArray(relatedApp.fields.agent_id) ? [...relatedApp.fields.agent_id].filter(id => id !== undefined && id !== null) : [relatedApp.fields.agent_id].filter(id => id !== undefined && id !== null),
        is_cancelled: isCancelled,
        status: currentStatus
      }
      this.updateModal =false
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
        this.updateModal = true
      }, 300);
    },
    closeUpdateModal() {
      this.updateModal = false
    },
    getAgentName(agentId: string) {
      const agent = this.agents.find((a: Agent) => a.id === agentId)
      return agent ? `${agent.fields.agent_name} ${agent.fields.agent_surname}` : ''
    },
    closeCreateAppointmentModal() {
      this.createAppointmentModalShow = false
    },
    async handleAppointmentCreated(appointment: Appointment) {
      console.log('New appointment created:', appointment)
      // Add appointment through store action
      await this.$store.dispatch('appointments/addAppointment', appointment)
      this.newAppointmentIds = [appointment.id]
      console.log('New appointment IDs:', this.newAppointmentIds)
      
      this.closeCreateAppointmentModal()
      toast.success("Appointment created successfully")
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      
      // Run filtering process after 10 seconds
      setTimeout(() => {
        console.log('Processing appointment data and applying filters after 7 seconds')
        this.filterAppointments()
        this.newAppointmentIds = []
        console.log('Animation ended, data processed and filtered')
      }, 10000)
    },
    
    async handleAppointmentUpdated(appointment: Appointment) {
      // Update appointment through store action
      await this.$store.dispatch('appointments/updateAppointment', appointment)
      this.closeUpdateModal()
      toast.success("Appointment updated successfully")
    },
    openCreateModal() {
      this.createAppointmentModalShow = true
    },

    getContactName(contactId: string) {
      const contact = this.contacts.find((c: Contact) => c.id === contactId)
      if (!contact) return ''
      return `${contact.fields.contact_name} ${contact.fields.contact_surname}`
    },
    changePage(page: number | string) {
      if (typeof page === 'string') return;
      this.currentPage = page;
    },
    handleClickOutside(event: MouseEvent) {
      const dropdown = document.querySelector('.agents-dropdown')
      const trigger = document.querySelector('.agents-dropdown-trigger')
      
      if (dropdown && trigger && !dropdown.contains(event.target as Node) && !trigger.contains(event.target as Node)) {
        this.showAllAgents = false
      }
      
      // Handle appointment agent dropdowns
      const appointmentDropdowns = document.querySelectorAll('[data-appointment-dropdown]')
      appointmentDropdowns.forEach(dropdown => {
        const appointmentId = dropdown.getAttribute('data-appointment-id')
        if (appointmentId && !dropdown.contains(event.target as Node)) {
          this.showAgentListForAppointment[appointmentId] = false
        }
      })
    },
    async fetchAgents() {
      await this.$store.dispatch('agents/fetchAgents')
    },
    async fetchContacts() {
      await this.$store.dispatch('contacts/fetchContacts')
    },
    async fetchAppointments() {
      await this.$store.dispatch('appointments/fetchAppointments')
    },
    findAgent(agentId: string): Agent | undefined {
      return this.$store.getters['agents/getAgentById'](agentId)
    },
    findContact(contactId: string): Contact | undefined {
      return this.$store.getters['contacts/getContactById'](contactId)
    },
    getContactField(contactId: string, field: 'contact_name' | 'contact_surname' | 'contact_email' | 'contact_phone'): string {
      const contact = this.findContact(contactId)
      if (!contact?.fields?.[field]) return ''
      const value = Array.isArray(contact.fields[field]) ? contact.fields[field][0] : contact.fields[field]
      return String(value)
    },
    appointmentStatus(isCancelled : boolean | undefined, date : string) : string {
      if (isCancelled) return 'Cancelled'
      
      const appointmentDate = moment(date)
      const now = moment()
      
      if (appointmentDate.isAfter(now)) {
        return 'Upcoming'
      }
      
      return 'Completed'
    },
    async filterAppointments() {
      // Show loading indicator
      this.isFiltering = true
      
      // Reset page number
      this.currentPage = 1
      
      // Add a small delay to show the loading indicator
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Hide loading indicator
      this.isFiltering = false
    }
  },
  async created() {
    await this.fetchAgents()
    await this.fetchContacts()
    await this.fetchAppointments()
    
    // Animation for short delay
    setTimeout(() => {
      this.isPageLoaded = true
    }, 100)
    
    document.addEventListener('click', this.handleClickOutside)
  },
  unmounted() {
    document.removeEventListener('click', this.handleClickOutside)
  },
}
</script>

<style>
.dp__main {
  width: 200px !important;
}

.dp__input {
  font-size: 0.75rem !important;
  border: 1px solid #d1d5db !important;
  border-radius: 0.75rem !important;
  width: 200px !important;
  height: 44px !important;
  padding-top: 14px !important;
  position: relative !important;
}

.dp__input_icon {
  padding-top: 12px !important;
}

.modal .dp__main {
  width: 100% !important;
}

.modal .dp__input {
  font-size: 0.75rem !important;
  border: 1px solid #d1d5db !important;
  border-radius: 0.35rem !important;
  padding-top: 16px !important;
  width: 100% !important;
  height: 44px !important;
  position: relative !important;
}

.modal .dp__input_icon {
  padding-top: 16px !important;
}

/* Sayfa yükleme animasyonları */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-out;
}

.fade-in-active {
  opacity: 1;
  transform: translateY(0);
}

/* Üstten aşağı kayma animasyonu */
.animate-slide-down {
  opacity: 0;
  transform: translateY(-30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-slide-down-active {
  opacity: 1;
  transform: translateY(0);
}

/* Alttan yukarı fade animasyonu */
.animate-fade-up {
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
}

.animate-fade-up-active {
  opacity: 1;
  transform: translateY(0);
}

/* Container overflow kontrolü */
.overflow-hidden {
  overflow: hidden;
}
</style>
