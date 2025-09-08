import { Agent } from '@/models'
import { apiService } from '@/service/axiosService'

export interface AgentsState {
  agents: Agent[]
  isLoading: boolean
  error: string | null
}

const agentsModule = {
  namespaced: true,
  
  state: (): AgentsState => ({
    agents: [],
    isLoading: false,
    error: null
  }),

  mutations: {
    SET_LOADING(state: AgentsState, loading: boolean) {
      state.isLoading = loading
    },
    SET_ERROR(state: AgentsState, error: string | null) {
      state.error = error
    },
    SET_AGENTS(state: AgentsState, agents: Agent[]) {
      state.agents = agents
    }
  },

  actions: {
    async fetchAgents({ commit }: any) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const res = await apiService.get<{ records: Agent[] }>('/agents')
        if (res.status === 200) {
          commit('SET_AGENTS', res.data.records)
        }
      } catch (error) {
        console.error('Error fetching agents:', error)
        commit('SET_ERROR', 'Failed to fetch agents')
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },

  getters: {
    getAgentById: (state: AgentsState) => (id: string) => {
      return state.agents.find((agent: Agent) => agent.id === id)
    },
    getAllAgents: (state: AgentsState) => state.agents,
    isLoading: (state: AgentsState) => state.isLoading,
    error: (state: AgentsState) => state.error
  }
}

export default agentsModule