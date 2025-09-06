<template>
  <div 
    :class="{'border-red-500' : hasError, 'border-gray-200' : !hasError}" 
    class="relative bg-gray-50 border rounded-sm" 
    @click.stop="toggleDropdown"
  >
    <div class="flex items-center h-[42px] w-full relative cursor-pointer max-w-[448px]">
      <span 
        v-if="selectedAgentIds.length === 0" 
        class="text-xs text-gray-500 absolute top-[11px] -translate-y-1/2 left-3"
      >
        {{ placeholder }}
      </span>
      <div 
        :class="{'!pl-4' : selectedAgentIds.length > 0}" 
        class="w-full pl-10 pr-8 py-2.5 h-[42px] pt-4 truncate text-xs"
      >
        {{ displayText }}
      </div>
      <ChevronDown class="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
    </div>

    <div v-if="hasError" class="px-3 pb-2">
      <span class="text-[11px] text-red-500 font-medium">{{ errorMessage }}</span>
    </div>

    <!-- Dropdown Menu -->
    <div 
      v-if="isOpen" 
      class="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto"
    >
      <div 
        v-for="agent in agents" 
        :key="agent.id" 
        @click.stop="toggleAgent(agent.id)" 
        class="flex items-center gap-x-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
      >
        <div 
          class="w-4 h-4 border rounded flex items-center justify-center" 
          :class="{ 'bg-black border-black': selectedAgentIds.includes(agent.id) }"
        >
          <div 
            v-if="selectedAgentIds.includes(agent.id)" 
            class="w-2 h-2 bg-white rounded-sm"
          ></div>
        </div>
        <span class="text-sm">{{ agent.fields.agent_name }} {{ agent.fields.agent_surname }}</span>
      </div>
    </div>

    <!-- Selected Agents -->
    <div v-if="selectedAgentIds.length > 0" class="flex flex-wrap gap-2 mt-3 p-2 bg-pink-50 rounded-lg border border-pink-100">
      <div class="text-xs font-medium text-pink-700 mb-1 w-full">Selected Agents:</div>
      <div 
        v-for="agentId in selectedAgentIds" 
        :key="agentId" 
        class="flex items-center gap-x-2 bg-white px-3 py-1.5 rounded-full border border-pink-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="w-2 h-2 bg-pink-500 rounded-full"></div>
        <span class="text-xs font-medium text-gray-700">{{ getAgentName(agentId) }}</span>
        <button 
          @click.stop="toggleAgent(agentId)" 
          class="text-pink-400 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors cursor-pointer"
        >
          <X class="w-3 h-3" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown, X } from 'lucide-vue-next'
import { computed } from 'vue'
import type { Agent } from '@/models'

interface Props {
  agents: Agent[]
  selectedAgentIds: string[]
  isOpen: boolean
  placeholder?: string
  hasError?: boolean
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Agents',
  hasError: false,
  errorMessage: 'At least one agent is required'
})

const emit = defineEmits<{
  (e: 'toggle-dropdown'): void
  (e: 'toggle-agent', agentId: string): void
}>()

const displayText = computed(() => {
  if (props.selectedAgentIds.length === 0) return ''
  return props.selectedAgentIds.map(id => getAgentName(id)).join(', ')
})

const getAgentName = (agentId: string): string => {
  const agent = props.agents.find(a => a.id === agentId)
  return agent ? `${agent.fields.agent_name} ${agent.fields.agent_surname}` : ''
}

const toggleDropdown = () => {
  emit('toggle-dropdown')
}

const toggleAgent = (agentId: string) => {
  emit('toggle-agent', agentId)
}
</script>