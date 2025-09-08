import { createStore } from 'vuex'
import agentsModule, { AgentsState } from './modules/agents'
import contactsModule, { ContactsState } from './modules/contacts'
import appointmentsModule, { AppointmentsState } from './modules/appointments'

export interface RootState {
  agents: AgentsState
  contacts: ContactsState
  appointments: AppointmentsState
}

const store = createStore<RootState>({
  modules: {
    agents: agentsModule,
    contacts: contactsModule,
    appointments: appointmentsModule
  }
})

export default store