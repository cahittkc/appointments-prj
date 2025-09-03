

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
      <div class="flex items-center group w-[400px]">
        <input type="text" placeholder="Search..." class="w-full pl-10 pr-4 py-2.5 h-[42px] bg-gray-50 border border-gray-200 rounded-tl-lg rounded-bl-lg focus:outline-none" />
        <div class="px-3 py-2.5 bg-gray-50 h-[42px] flex items-center justify-center border border-gray-200 transition-all rounded-tr-lg rounded-br-lg  group-focus-within:border-pink-500">
          <Search class="text--gray-500 w-5 h-5" />
        </div>
      </div>
    </div>


    <!-- Section appointment list -->
    <div class="w-full overflow-x-auto">
      <div class="grid gap-2">
           <div v-for="(app,index) in appointments" :key="app.id" :class="{'bg-gray-100': index % 2 === 0}" class="cursor-pointer border border-gray-200 rounded-lg grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 shadow-sm hover:shadow py-4">
              <div class="py-3 px-4 flex items-center">
                  <div class="flex flex-col gap-y-2.5 flex-1 items-start pl-16 max-xl:pl-8">
                       <div class="text-sm font-medium text-gray-900 flex gap-x-2 items-center">
                          <User class="w-5 h-5 text-gray-500" />
                          <span>{{ app.fields.contact_name[0] }} {{ app.fields.contact_surname[0] }}</span>
                       </div>
                       <div class="text-sm text-gray-500 flex items-center gap-x-2">
                          <Mail class="w-5 h-5 text-gray-500" />
                          <span>{{ app.fields.contact_email[0] }}</span>
                       </div>
                       <div class="text-sm text-gray-500 flex items-center gap-x-2">
                          <Phone class="w-5 h-5 text-gray-500" />
                          <span>{{ app.fields.contact_phone[0] }}</span>
                       </div>
                  </div>
              </div>
              <div class="flex items-center w-full">
                   <div class="flex flex-col gap-y-2.5 flex-1 items-start pl-8 max-md:pl-12">
                        <div class="text-sm font-medium text-gray-900 flex gap-x-2 items-center">
                           <House class="w-5 h-5 min-w-5 min-h-5 text-gray-500" />
                           <span class="font-semibold text-black ">{{ app.fields.appointment_address }}</span>
                        </div>
                   </div>
               </div>
               <div class="py-3 px-4 flex items-center w-full">
                   <div class="flex items-center justify-between gap-x-2.5 bg-pink-500 p-2 rounded-full flex-1 ml-8 max-w-[400px] max-xl:max-w-[300px]">
                         <div class="bg-white  py-1 px-3 text-sm rounded-full flex items-center justify-between gap-x-3 flex-nowrap">
                           <span :class="getStatusColor(appointmentStatus(app.fields.is_cancelled !== undefined ? app.fields.is_cancelled : undefined, app.fields.appointment_date))" class="white-space-nowrap text-sm">{{ appointmentStatus(app.fields.is_cancelled !== undefined ? app.fields.is_cancelled : undefined, app.fields.appointment_date) }}</span>
                           <span v-if="appointmentStatus(app.fields.is_cancelled !== undefined ? app.fields.is_cancelled : undefined, app.fields.appointment_date) === 'Upcoming'" class="white-space-nowrap text-sm">{{ getTimeRemaining(app.fields.is_cancelled !== undefined ? app.fields.is_cancelled : undefined, app.fields.appointment_date) }}</span>
                         </div>
                         <div class="text-white  flex items-center justify-between gap-x-2">
                           <span>
                             <Clock class="w-4 h-4 text-white" />
                           </span>
                           <span class="white-space-nowrap text-sm"> 
                             {{ formatDateToFullDate(app.fields.appointment_date) }}
                           </span>
                         </div>
                   </div>
               </div>
               <div class="py-3 px-4 flex items-center justify-center max-xl:justify-start w-full">
                   <div class="flex items-center gap-x-2 p-4 max-md:pl-8">
                     <template v-for="(agentId, index) in app.fields.agent_id" :key="agentId">
                       <div v-if="findAgent(agentId) && index < 2" class="relative group -ml-3 first:ml-0">
                         <div 
                            class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ring-2 ring-white"
                            :style="{ backgroundColor: findAgent(agentId)?.fields?.color || '#gray-400' }"
                          >
                            <span class="text-white">
                              {{ findAgent(agentId)?.fields?.agent_name?.[0] || '?' }}{{ findAgent(agentId)?.fields?.agent_surname?.[0] || '?' }}
                            </span>
                         </div>
                       </div>
                     </template>
                     <div v-if="app.fields.agent_id?.length > 2" class="relative group -ml-3">
                       <div 
                         class="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center cursor-pointer ring-2 ring-white"
                       >
                         <span class="text-white font-medium">
                           +{{ app.fields.agent_id?.length - 2 }}
                         </span>
                       </div>
                     </div>
                   </div>
                </div>
            </div>
      </div>
    </div>


    







  </div>
</template>


<script setup lang="ts">
import { Agent, Appointment } from '@/models'
import { apiService } from '@/service/axiosService'
import { onMounted, ref } from 'vue';
import { User, Mail, Phone, House, Clock, Search } from 'lucide-vue-next';
import moment from 'moment';


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
      const sortedData = res.data.records.sort((a, b) => {
        return moment(b.fields.appointment_date).diff(moment(a.fields.appointment_date))
      })

      appointments.value = sortedData.map(e => ({
        ...e,
        fields: {
          ...e.fields,
          status: appointmentStatus(e.fields.is_cancelled !== undefined ? e.fields.is_cancelled : undefined, e.fields.appointment_date)
        }
      }))
    }
}


const formatDateToFullDate = (date : string) : string => {
  return moment(date).format('DD/MM/YYYY HH:mm')
}


const getTimeRemaining = (isCancelled: boolean | undefined, date: string): string => {
  if (isCancelled) return ''

  const appointmentDate = moment(date)
  const now = moment()
  
  if (!appointmentDate.isAfter(now)) return ''
  
  const duration = moment.duration(appointmentDate.diff(now))
  
  const days = Math.floor(duration.asDays())
  const hours = Math.floor(duration.asHours() % 24)
  
  if (days > 0) {
    return `${days} days`
  }
  return `${hours} hours`
}

const findAgent = (agentId: string): Agent | undefined => {
  return agents.value.find(agent => agent.id === agentId)
}

const appointmentStatus = (isCancelled : boolean | undefined, date : string) : string => {
  if (isCancelled) return 'Cancelled'
  
  const appointmentDate = moment(date)
  const now = moment()
  
  if (appointmentDate.isAfter(now)) {
    return 'Upcoming'
  }
  
  return 'Completed'
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Cancelled':
      return 'text-red-400'
    case 'Upcoming':
      return 'text-yellow-400'
    case 'Completed':
      return 'text-green-500'
    default:
      return 'text-gray-600'
  }
}


onMounted(async () => {
  await getAgents()
  await getAllAppointments()
})


</script>

<style scoped>

</style>
