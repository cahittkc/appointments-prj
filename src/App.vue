

<template>
  <div class="p-4">

    <!-- Section filters and search box -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-x-5">
        <div class="flex items-center gap-x-2 p-4">
          <template v-for="(agent,index) in agents" :key="agent.id">
            <div v-if="index < 5" class="relative group -ml-3 first:ml-0">
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ring-2 ring-white"
                :style="{ backgroundColor: agent.fields.color }"
              >
                <span class="text-white">
                  {{ agent.fields.agent_name[0] }}{{ agent.fields.agent_surname[0] }}
                </span>
              </div>
            </div>
          </template>
          <div v-if="agents.length > 5" class="relative group -ml-3">
            <div 
              class="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center cursor-pointer ring-2 ring-white"
            >
              <span class="text-white font-medium">
                +{{ agents.length - 5 }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div>
        search yeri
      </div>
    </div>


    <!-- Section appointment list -->
    <div class="w-full overflow-x-auto">
      <table>
        
      </table>
    </div>


    







  </div>
</template>


<script setup lang="ts">
import { Agent, Appointment } from '@/models'
import { apiService } from '@/service/axiosService'
import { onMounted, ref } from 'vue';


const appointments = ref<Appointment[]>([])
const agents = ref<Agent[]>([])


const getAgents = async () => {
  const res = await apiService.get<{ records: Agent[] }>('/agents')
  if(res.status === 200){
    agents.value = res.data.records
  }
}


const getAllAppointments = async () => {
  const res = await apiService.get<{ records: Appointment[] }>('/appointments')
  if(res.status === 200){
    appointments.value = res.data.records
  }
}


onMounted(async () => {
  await getAgents()
  // await getAllAppointments()
})


</script>

<style scoped>

</style>
