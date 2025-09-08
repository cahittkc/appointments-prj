import { Appointment } from '@/models'
import { apiService } from '@/service/axiosService'
import moment from 'moment'

export interface AppointmentsState {
  appointments: Appointment[]
  isLoading: boolean
  error: string | null
}

const appointmentsModule = {
  namespaced: true,
  
  state: (): AppointmentsState => ({
    appointments: [],
    isLoading: false,
    error: null
  }),

  mutations: {
    SET_LOADING(state: AppointmentsState, loading: boolean) {
      state.isLoading = loading
    },
    SET_ERROR(state: AppointmentsState, error: string | null) {
      state.error = error
    },
    SET_APPOINTMENTS(state: AppointmentsState, appointments: Appointment[]) {
      state.appointments = appointments
    },
    ADD_APPOINTMENT(state: AppointmentsState, appointment: Appointment) {
      state.appointments.unshift(appointment)
    },
    UPDATE_APPOINTMENT(state: AppointmentsState, updatedAppointment: Appointment) {
      const index = state.appointments.findIndex(app => app.id === updatedAppointment.id)
      if (index !== -1) {
        state.appointments.splice(index, 1, updatedAppointment)
      }
    }
  },

  actions: {
    async fetchAppointments({ commit, rootState }: any) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        let allRecords: Appointment[] = []
        let offset: string | undefined
        
        do {
          const res: { 
            status: number;
            data: { 
              records: Appointment[]; 
              offset?: string;
            };
          } = await apiService.get<{ records: Appointment[], offset?: string }>('/appointments', {
            params: offset !== undefined ? { offset } : {}
          })

          if (res.status === 200) {
            allRecords = [...allRecords, ...res.data.records]
            offset = res.data.offset
          } else {
            break
          }
        } while (offset !== undefined)

        commit('SET_APPOINTMENTS', allRecords)
        
        // Process appointment data after fetching
        const processedData = processAppointmentData(allRecords)
        commit('SET_APPOINTMENTS', processedData)
      } catch (error) {
        console.error('Error fetching appointments:', error)
        commit('SET_ERROR', 'Failed to fetch appointments')
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createAppointment({ commit }: any, appointmentData: any) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const response = await apiService.post('/appointments', { records: [appointmentData] })
        if (response.status === 200) {
          const newAppointment = response.data.records[0]
          commit('ADD_APPOINTMENT', newAppointment)
          return newAppointment
        }
      } catch (error) {
        console.error('Error creating appointment:', error)
        commit('SET_ERROR', 'Failed to create appointment')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateAppointment({ commit }: any, appointment: Appointment) {
      commit('UPDATE_APPOINTMENT', appointment)
    },

    async addAppointment({ commit }: any, appointment: Appointment) {
      commit('ADD_APPOINTMENT', appointment)
    },

    async updateAppointmentAPI({ commit }: any, { appointmentId, appointmentData }: { appointmentId: string, appointmentData: any }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const response = await apiService.patch(`/appointments/${appointmentId}`, appointmentData)
        if (response.status === 200) {
          const updatedAppointment = response.data
          commit('UPDATE_APPOINTMENT', updatedAppointment)
          return updatedAppointment
        }
      } catch (error) {
        console.error('Error updating appointment:', error)
        commit('SET_ERROR', 'Failed to update appointment')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },

  getters: {
    getAppointmentById: (state: AppointmentsState) => (id: string) => {
      return state.appointments.find((appointment: Appointment) => appointment.id === id)
    },
    getAllAppointments: (state: AppointmentsState) => state.appointments,
    getContactOtherAppointments: (state: AppointmentsState) => (contactId: string, excludeId?: string) => {
      return state.appointments.filter((app: Appointment) => {
        const contactIds = Array.isArray(app.fields.contact_id) ? app.fields.contact_id : [app.fields.contact_id]
        return contactIds.includes(contactId) && app.id !== excludeId
      })
    },
    getFilteredAppointments: (state: AppointmentsState) => (filters: {
      searchText?: string;
      selectedAgent?: string;
      selectedStatus?: string;
      selectedDate?: string;
    }) => {
      let filtered = [...state.appointments]

      // Search text filter
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase()
        filtered = filtered.filter((appointment: Appointment) => {
          const contactName = appointment.fields.contact_name?.[0]?.toLowerCase() || ''
          const contactSurname = appointment.fields.contact_surname?.[0]?.toLowerCase() || ''
          const agentName = appointment.fields.agent_name?.[0]?.toLowerCase() || ''
          const agentSurname = appointment.fields.agent_surname?.[0]?.toLowerCase() || ''
          const address = appointment.fields.appointment_address?.toLowerCase() || ''
          
          return contactName.includes(searchLower) ||
                 contactSurname.includes(searchLower) ||
                 agentName.includes(searchLower) ||
                 agentSurname.includes(searchLower) ||
                 address.includes(searchLower)
        })
      }

      // Agent filter
      if (filters.selectedAgent) {
        filtered = filtered.filter((appointment: Appointment) => {
          const agentIds = Array.isArray(appointment.fields.agent_id) 
            ? appointment.fields.agent_id 
            : [appointment.fields.agent_id]
          return agentIds.includes(filters.selectedAgent!)
        })
      }

      // Status filter
      if (filters.selectedStatus) {
        filtered = filtered.filter((appointment: Appointment) => {
          return appointment.fields.status === filters.selectedStatus
        })
      }

      // Date filter
      if (filters.selectedDate) {
        filtered = filtered.filter((appointment: Appointment) => {
          const appointmentDate = new Date(appointment.fields.appointment_date).toDateString()
          const filterDate = new Date(filters.selectedDate!).toDateString()
          return appointmentDate === filterDate
        })
      }

      return filtered
    },
    isLoading: (state: AppointmentsState) => state.isLoading,
    error: (state: AppointmentsState) => state.error
  }
}

// Helper functions
function appointmentStatus(isCancelled: boolean | undefined, appointmentDate: string): string {
  if (isCancelled) return 'Cancelled'
  
  const now = moment()
  const appDate = moment(appointmentDate)
  
  if (appDate.isBefore(now, 'day')) {
    return 'Completed'
  } else {
    return 'Upcoming'
  }
}

function processAppointmentData(records: any[]) {
  const sortedData = records.sort((a, b) => {
    return moment(b.fields.appointment_date).diff(moment(a.fields.appointment_date))
  })

  return sortedData.map(e => ({
    ...e,
    fields: {
      ...e.fields,
      status: appointmentStatus(e.fields.is_cancelled !== undefined ? e.fields.is_cancelled : undefined, e.fields.appointment_date)
    }
  }))
}

export default appointmentsModule