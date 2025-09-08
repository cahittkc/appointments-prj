import { Contact } from '@/models'
import { apiService } from '@/service/axiosService'

export interface ContactsState {
  contacts: Contact[]
  isLoading: boolean
  error: string | null
}

const contactsModule = {
  namespaced: true,
  
  state: (): ContactsState => ({
    contacts: [],
    isLoading: false,
    error: null
  }),

  mutations: {
    SET_LOADING(state: ContactsState, loading: boolean) {
      state.isLoading = loading
    },
    SET_ERROR(state: ContactsState, error: string | null) {
      state.error = error
    },
    SET_CONTACTS(state: ContactsState, contacts: Contact[]) {
      state.contacts = contacts
    },
    ADD_CONTACT(state: ContactsState, contact: Contact) {
      state.contacts.unshift(contact)
    }
  },

  actions: {
    async fetchContacts({ commit }: any) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        let allRecords: Contact[] = []
        let offset: string | undefined
        
        do {
          const res: { 
            status: number;
            data: { 
              records: Contact[]; 
              offset?: string;
            };
          } = await apiService.get<{ records: Contact[], offset?: string }>('/contacts', {
            params: offset !== undefined ? { offset } : {}
          })

          if (res.status === 200) {
            allRecords = [...allRecords, ...res.data.records]
            offset = res.data.offset
          } else {
            break
          }
        } while (offset !== undefined)

        commit('SET_CONTACTS', allRecords)
      } catch (error) {
        console.error('Error fetching contacts:', error)
        commit('SET_ERROR', 'Failed to fetch contacts')
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createContact({ commit }: any, contactData: any) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const response = await apiService.post('/contacts', { records: [contactData] })
        if (response.status === 200) {
          const newContact = response.data.records[0]
          commit('ADD_CONTACT', newContact)
          return newContact
        }
      } catch (error) {
        console.error('Error creating contact:', error)
        commit('SET_ERROR', 'Failed to create contact')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },

  getters: {
    getContactById: (state: ContactsState) => (id: string) => {
      return state.contacts.find((contact: Contact) => contact.id === id)
    },
    getAllContacts: (state: ContactsState) => state.contacts,
    getFilteredContacts: (state: ContactsState) => (searchQuery: string) => {
      if (!searchQuery) return state.contacts
      const query = searchQuery.toLowerCase()
      return state.contacts.filter((contact: Contact) => {
        const name = contact.fields.contact_name?.toLowerCase() || ''
        const surname = contact.fields.contact_surname?.toLowerCase() || ''
        const email = contact.fields.contact_email?.toLowerCase() || ''
        const phone = contact.fields.contact_phone?.toString().toLowerCase() || ''
        return name.includes(query) || surname.includes(query) || email.includes(query) || phone.includes(query)
      })
    },
    isLoading: (state: ContactsState) => state.isLoading,
    error: (state: ContactsState) => state.error
  }
}

export default contactsModule