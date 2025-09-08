import { Store } from 'vuex'
import { Agent, Contact, Appointment } from '@/models'

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    agents: {
      agents: Agent[]
      isLoading: boolean
      error: string | null
    }
    contacts: {
      contacts: Contact[]
      isLoading: boolean
      error: string | null
    }
    appointments: {
      appointments: Appointment[]
      isLoading: boolean
      error: string | null
    }
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}