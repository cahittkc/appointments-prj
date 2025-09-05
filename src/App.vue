

<template>
  <div class="relative">
    <LoadingOverlay v-if="isLoading" :is-loading="isLoading" />
    <div v-else class="p-4">
      <!-- Section filters and search box -->
      <div class="flex items-center justify-between pb-8 border-b-2 border-b-gray-300">
        <div class="flex items-center gap-x-5">
          <div class="flex items-center gap-x-2 p-4">
            <template v-for="(agent,index) in agents" :key="agent.id">
              <div v-if="index < 5" class="relative group -ml-3 first:ml-0">
                <div 
                  @click="selectedAgentIds.includes(agent.id) ? selectedAgentIds = selectedAgentIds.filter((id : any) => id !== agent.id) : selectedAgentIds.push(agent.id)"
                  class="group w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ring-2 ring-white relative"
                  :style="{ backgroundColor: agent.fields.color }"
                  :class="{'!ring-2 !ring-green-500 transition-all': selectedAgentIds.includes(agent.id)}"
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
              <div v-if="showAllAgents" class="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 agents-dropdown">
                <div v-for="agent in agents.slice(5)" :key="agent.id" @click="selectedAgentIds.includes(agent.id) ? selectedAgentIds = selectedAgentIds.filter((id : any) => id !== agent.id) : selectedAgentIds.push(agent.id)" class="flex items-center gap-x-3 px-4 py-2 hover:bg-gray-50 cursor-pointer">
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
                    <Check v-if="selectedAgentIds.includes(agent.id)" class="w-4 h-4 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-x-3">
            <select v-model="filterObj.status"  class="w-[150px] h-[42px] bg-gray-50 border border-gray-200 rounded-lg px-4 focus:outline-none" name="" id="">
              <option :value="null">All Statuses</option>
              <option :value="'Cancelled'">Cancelled</option>
              <option :value="'Completed'">Completed</option>
              <option :value="'Upcoming'">Upcoming</option>
            </select>
          </div>

          <div class="flex items-center gap-x-1.5">
              <VueDatePicker auto-apply :clearable="false" format="dd/MM/yyyy HH:mm" v-model="filterObj.startDate" @change="filterAppointments" class="w-[240px] text-xs before:content-['From'] before:absolute before:top-0.5 before:left-3 before:text-[11px] before:z-10 before:font-semibold before:text-gray-500" name="" id="" />
              <VueDatePicker auto-apply :clearable="false" format="dd/MM/yyyy HH:mm" v-model="filterObj.endDate" @change="filterAppointments" class="w-[240px] text-xs before:content-['To'] before:absolute before:top-0.5 before:left-3 before:text-[11px] before:z-10 before:font-semibold before:text-gray-500" name="" id="" />
          </div>

          <div>
            <button @click="filterAppointments" class="">Filter</button>
          </div>


        </div>
        <div class="flex items-center group w-[300px]">
          <input v-model="searchText" type="text" placeholder="Search..." class="w-full pl-10 pr-4 py-2.5 h-[42px] bg-gray-50 border border-gray-200 rounded-tl-lg rounded-bl-lg focus:outline-none" />
          <div class="px-3 py-2.5 bg-gray-50 h-[42px] flex items-center justify-center border border-gray-200 transition-all rounded-tr-lg rounded-br-lg  group-focus-within:border-pink-500">
            <Search class="text--gray-500 w-4 h-4" />
          </div>
        </div>
      </div>

      <!-- Section new appoinment -->
      <div class="flex items-center justify-between pt-8 px-3">
        <span class="text-sm text-gray-400">{{ withOutFilterAppointments.length }} Appointments found. </span>
        <button @click="openCreateModal" class="px-4 py-2 bg-pink-500 text-white flex items-center justify-between rounded-md gap-x-2.5">
          <CirclePlusIcon class="w-5 h-5 font-light" />
          <span>Create  Appointment</span>
        </button>
      </div>

      <!-- Section appointment list -->
      <div class="w-full overflow-x-auto py-8">
        <div class="grid gap-2">
            <div @click="selectAppointment(app)" v-for="(app,index) in paginatedAppointments" :key="app.id" :class="{'bg-gray-100': index % 2 === 0}" class="cursor-pointer border border-gray-200 rounded-lg grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 shadow-sm hover:shadow py-4">
                <div class="py-3 px-4 flex items-center">
                    <div class="flex flex-col gap-y-2.5 flex-1 items-start pl-16 max-xl:pl-8">
                        <div class="text-sm font-medium text-gray-900 flex gap-x-2 items-center">
                            <User class="w-5 h-5 text-gray-500" />
                            <span>{{ Array.isArray(app.fields.contact_name) ? app.fields.contact_name[0] : app.fields.contact_name }} {{ Array.isArray(app.fields.contact_surname) ? app.fields.contact_surname[0] : app.fields.contact_surname }}</span>
                        </div>
                        <div class="text-sm text-gray-500 flex items-center gap-x-2">
                            <Mail class="w-5 h-5 text-gray-500" />
                            <span>{{ Array.isArray(app.fields.contact_email) ? app.fields.contact_email[0] : app.fields.contact_email }}</span>
                        </div>
                        <div class="text-sm text-gray-500 flex items-center gap-x-2">
                            <Phone class="w-5 h-5 text-gray-500" />
                            <span>{{ Array.isArray(app.fields.contact_phone) ? app.fields.contact_phone[0] : app.fields.contact_phone }}</span>
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


      <!-- Pagination controls -->
      <div class="flex items-center justify-end gap-x-2 mt-8" v-if="totalPages > 1">
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
    </div>
  </div>


  <!--Create Appoinment Modal-->
  <BaseModal @close="createAppointmentModalShow = false" :isOpen="createAppointmentModalShow">
    <template #title>
      <div class="flex items-center gap-x-1.5">
        <CalendarPlus2 class="w-5 h-5" />
        <span class="text-md font-semibold text-gray-500">Create an Appointment</span>
      </div>
    </template>

    <template #content>
        <div class="flex flex-col gap-y-6 mt-6">
          <div class="relative">
            <div class="flex items-center group w-full">
              <input v-model="searchContactQuery" type="text" placeholder="Search..." class="w-full pl-10 pr-4 py-2.5 h-[42px] bg-gray-50 border border-gray-200 rounded-tl-lg rounded-bl-lg focus:outline-none" />
              <div class="px-3 py-2.5 bg-black h-[42px] flex items-center justify-center border border-gray-200 transition-all rounded-tr-lg rounded-br-lg">
                <Search class="text-white w-4 h-4" />
              </div>
            </div>

            <!-- Selected Contacts -->
            <div v-if="createAppointmentForm.contact_id.length > 0" class="flex flex-wrap gap-2 mt-2">
              <div v-for="contactId in createAppointmentForm.contact_id" :key="contactId" class="flex items-center gap-x-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
                <span>{{ getContactName(contactId) }}</span>
                <X class="w-3 h-3 cursor-pointer" @click="removeContact(contactId)" />
              </div>
            </div>

            <!-- Search Results -->
            <div v-if="searchContactQuery && filteredContacts.length > 0" class="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              <div v-for="contact in filteredContacts" :key="contact.id" @click="selectContact(contact.id)" class="flex items-center gap-x-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                <div class="flex flex-col">
                  <span class="text-sm">{{ contact.fields.contact_name }} {{ contact.fields.contact_surname }}</span>
                  <span class="text-xs text-gray-500">{{ contact.fields.contact_email }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center h-[42px] bg-gray-50 border border-gray-200 rounded-sm w-full relative">
            <span class="text-xs text-gray-500 absolute top-[11px] -translate-y-1/2 left-3">Address</span>
            <input v-model="createAppointmentForm.appointment_address" type="text"  class="w-full pl-10 pr-4 py-2.5 h-[42px] text-xs outline-0 pt-4" />
            <House class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>

          <div class="relative" @click.stop="toggleAgentDropdown">
              <div class="flex items-center h-[42px] bg-gray-50 border border-gray-200 rounded-sm w-full relative cursor-pointer max-w-[448px]">
                <span class="text-xs text-gray-500 absolute top-[11px] -translate-y-1/2 left-3">Agents</span>
                <div class="w-full pl-10 pr-8 py-2.5 h-[42px] pt-4 truncate text-xs">
                  {{ createAppointmentForm.agent_id.length ? createAppointmentForm.agent_id.map(id => getAgentName(id)).join(', ') : '' }}
                </div>
                <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              </div>

              <!-- Dropdown Menu -->
              <div v-if="showAgentDropdown" class="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
                <div v-for="agent in agents" :key="agent.id" @click.stop="toggleAgent(agent.id)" class="flex items-center gap-x-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <div class="w-4 h-4 border rounded flex items-center justify-center" :class="{ 'bg-black border-black': createAppointmentForm.agent_id.includes(agent.id) }">
                    <div v-if="createAppointmentForm.agent_id.includes(agent.id)" class="w-2 h-2 bg-white rounded-sm"></div>
                  </div>
                  <span class="text-sm">{{ agent.fields.agent_name }} {{ agent.fields.agent_surname }}</span>
                </div>
              </div>

              <!-- Selected Agents -->
              <div v-if="createAppointmentForm.agent_id.length > 0" class="flex flex-wrap gap-2 mt-2">
                <div v-for="agentId in createAppointmentForm.agent_id" :key="agentId" class="flex items-center gap-x-1 bg-gray-100 px-2 py-1 rounded-lg">
                  <span class="text-xs">{{ getAgentName(agentId) }}</span>
                  <button @click.stop="toggleAgent(agentId)" class="text-gray-500 hover:text-gray-700 cursor-pointer">
                    <X class="w-3 h-3" />
                  </button>
                </div>
              </div>
          </div>

          <div class="modal relative">
            <VueDatePicker auto-apply :clearable="false" :min-date="new Date()" :min-time="new Date()" format="dd/MM/yyyy HH:mm" v-model="createAppointmentForm.appointment_date" class="w-[240px] text-xs before:content-['Appointment_Date'] before:absolute before:top-0.5 before:left-3 before:text-[11px] before:z-10  before:text-gray-500" name="" id="" />
          </div>


        </div>
    </template>


    <template #footer>
      <div class="flex justify-end gap-x-2">
        <button  @click="closeCreateAppointmentModal" class="px-4 py-2 text-sm font-medium  bg-black text-white border border-gray-300 rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">Cancel</button>
        <button @click="createAppointment" :disabled="createIsLoading" class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-500 border border-transparent rounded-md shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed">
          <Loader2 v-if="createIsLoading" class="w-4 h-4 mr-2 -ml-1 animate-spin" />
          Create
        </button>
      </div>
    </template>


  </BaseModal>



  <BaseModal :isOpen="updateModal" @close="closeUpdateModal">
    <template #title>
      <div class="flex items-center gap-x-1.5">
        <CalendarPlus2 class="w-5 h-5" />
        <span class="text-md font-semibold text-gray-500">Edit the Appointment</span>
      </div>
    </template>

    <template #content>
      <div class="flex flex-col gap-y-2.5">
              <UserPlus2 v-if="!addContactModalShow" @click="addContactModalShow = true"  class="w-5 h-5 text-gray-500 mb-2 cursor-pointer flex items-center justify-end ml-auto" />
              <div class="max-h-60 overflow-y-auto flex flex-col gap-y-2.5" >
                <template v-for="c in selectedAppointment.contact_id">
                  <div class="flex flex-col gap-y-2 flex-1 items-start border border-gray-300 rounded-lg p-4 relative">
                      <div class="text-sm font-medium text-gray-900 flex gap-x-2 items-center">
                          <User class="w-5 h-5 text-gray-500" />
                          <span>{{ getContactField(c, 'contact_name') }} {{ getContactField(c, 'contact_surname') }}</span>
                      </div>
                      <div class="text-sm text-gray-500 flex items-center gap-x-2">
                          <Mail class="w-5 h-5 text-gray-500" />
                          <span>{{ getContactField(c, 'contact_email') }}</span>
                      </div>
                      <div class="text-sm text-gray-500 flex items-center gap-x-2">
                          <Phone class="w-5 h-5 text-gray-500" />
                          <span>{{ getContactField(c, 'contact_phone') }}</span>
                      </div>
                      <X @click="removeContactFromUpdate(c)" class="absolute right-2 top-2  text-gray-500 w-4 h-4 cursor-pointer" />
                  </div>
                </template>
              </div>
              <AddContactModal 
                :is-open="addContactModalShow" 
                @close="addContactModalShow = false"
                :contacts="contacts"
                :selected-contact-ids="selectedAppointment.contact_id"
                @select-contact="addContactToUpdate">
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
                        <input v-model="searchContactQuery" type="text" placeholder="Search..." class="w-full pl-10 pr-4 py-2.5 h-[42px] bg-gray-50 border border-gray-200 rounded-tl-lg rounded-bl-lg focus:outline-none" />
                        <div class="px-3 py-2.5 bg-black h-[42px] flex items-center justify-center border border-gray-200 transition-all rounded-tr-lg rounded-br-lg">
                          <Search class="text-white w-4 h-4" />
                        </div>
                      </div>

                      <!-- Search Results -->
                      <div v-if="searchContactQuery && availableContacts.length > 0" class="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                        <div v-for="contact in availableContacts" :key="contact.id" @click="addContactToUpdate(contact.id)" class="flex items-center gap-x-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <div class="flex flex-col">
                            <span class="text-sm">{{ contact.fields.contact_name }} {{ contact.fields.contact_surname }}</span>
                            <span class="text-xs text-gray-500">{{ contact.fields.contact_email }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>



              </AddContactModal>
              <div v-if="!addContactModalShow" class="flex items-center h-[42px] bg-gray-50 border border-gray-200 rounded-sm w-full relative">
                  <input v-model="selectedAppointment.appointment_address" type="text" class="w-full pl-10 pr-8 py-2.5 h-[42px] text-xs outline-0" />
                  <House class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <X @click="selectedAppointment.appointment_address = ''" class="absolute right-2 top-2 text-gray-500 z-10 w-4 h-4 cursor-pointer" />
              </div>

              <div v-if="!addContactModalShow" class="relative" @click.stop="toggleAgentDropdown">
                <div class="flex items-center h-[42px] bg-gray-50 border border-gray-200 rounded-sm  relative cursor-pointer max-w-[448px]">
                  <span class="text-xs text-gray-500 absolute top-[11px] -translate-y-1/2 left-3">Agents</span>
                  <div class="w-[calc(100%-50px)] pl-10 pr-8 py-2.5 h-[42px] pt-5 text-xs">
                    <div class="truncate w-full">
                      {{ selectedAppointment.agent_id.length ? selectedAppointment.agent_id.map(id => getAgentName(id)).join(', ') : '' }}
                    </div>
                  </div>
                  <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                </div>

                <!-- Dropdown Menu -->
                <div  v-if="showAgentDropdown && !addContactModalShow" class="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
                  <div v-for="agent in agents" :key="agent.id" @click.stop="toggleAgentInUpdate(agent.id)" class="flex items-center gap-x-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <div class="w-4 h-4 border rounded flex items-center justify-center" :class="{ 'bg-black border-black': selectedAppointment.agent_id.includes(agent.id) }">
                      <div v-if="selectedAppointment.agent_id.includes(agent.id)" class="w-2 h-2 bg-white rounded-sm"></div>
                    </div>
                    <span class="text-sm">{{ agent.fields.agent_name }} {{ agent.fields.agent_surname }}</span>
                  </div>
                </div>
              </div>

              <div v-if="!addContactModalShow" class="modal relative">
                <VueDatePicker auto-apply :clearable="false" :min-date="new Date()" :min-time="new Date()" format="dd/MM/yyyy HH:mm" v-model="selectedAppointment.appointment_date" class="w-[240px] text-xs before:content-['Appointment_Date'] before:absolute before:top-0.5 before:left-3 before:text-[11px] before:z-10  before:text-gray-500" name="" id="" />
              </div>

              <div v-if="!addContactModalShow" class="flex items-center h-[42px] bg-gray-50 border border-gray-200 rounded-sm w-full relative">
                <select v-model="selectedAppointment.is_cancelled" class="w-full pl-4 pr-4 py-2.5 h-[42px] text-xs outline-0 bg-transparent appearance-none cursor-pointer">
                  <template v-if="moment(selectedAppointment.appointment_date).isAfter(moment())">
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


      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-x-2">
        <button @click="closeUpdateModal" class="px-4 py-2 text-sm font-medium bg-black text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">Cancel</button>
        <button @click="updateAppointment" :disabled="updateIsLoading" class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-500 border border-transparent rounded-md shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed">
          <Loader2 v-if="updateIsLoading" class="w-4 h-4 mr-2 -ml-1 animate-spin" />
          Update
        </button>
      </div>
    </template>

  </BaseModal>







</template>


<script setup lang="ts">
import { Agent, Appointment, Contact, CreateAppointmentForm, editAppointmentForm } from '@/models'
import { apiService } from '@/service/axiosService'
import { onMounted, onUnmounted, ref, watch, computed } from 'vue';
import { User, Mail, Phone, House, Clock, Search, Check, ChevronLeft, ChevronRightIcon, Plus, CirclePlusIcon, CalendarPlus2, ChevronDown, X, Loader2, UserPlus2 } from 'lucide-vue-next';
import LoadingOverlay from './components/LoadingOverlay.vue';
import AddContactModal from './components/AddContactModal.vue';
import moment from 'moment';

const withOutFilterAppointments = ref<Appointment[]>([])
const appointments = ref<Appointment[]>([])
const agents = ref<Agent[]>([])
const contacts = ref<Contact[]>([])
const selectedAgentIds = ref<string[]>([])
const showAllAgents = ref<boolean>(false)
const searchText = ref<string>('')
const isLoading = ref<boolean>(false)
const createIsLoading = ref<boolean>(false)
const createAppointmentModalShow = ref<boolean>(false)
const searchContactQuery = ref('')
const showAgentDropdown = ref<boolean>(false)
const addContactModalShow = ref<boolean>(false)
const updateIsLoading = ref<boolean>(false)



const availableContacts = computed(() => {
  const contactIds = Array.isArray(selectedAppointment.value.contact_id) ? selectedAppointment.value.contact_id : [selectedAppointment.value.contact_id]
  return contacts.value.filter(contact => !contactIds.includes(contact.id))
})

const addContactToUpdate = (contactId: string) => {
  selectedAppointment.value.contact_id.push(contactId)
  addContactModalShow.value = false
}

const selectedAppointment = ref<editAppointmentForm>({
  id: '',
  appointment_date: '',
  appointment_address: '',
  contact_id: [],
  agent_id: [],
  is_cancelled: false,
})
const updateModal = ref<boolean>(false)

const createAppointmentForm = ref<CreateAppointmentForm>({
    appointment_date: new Date(),
    appointment_address: "",
    contact_id: [],
    agent_id: [],
    is_cancelled: false,
})

// Pagination states
const currentPage = ref<number>(1)
const itemsPerPage = ref<number>(10)

// Computed property for paginated appointments
const paginatedAppointments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return appointments.value.slice(start, end)
})



const selectAppointment = (appointment: Appointment) => {
  const currentStatus = appointmentStatus(appointment.fields.is_cancelled, appointment.fields.appointment_date)
  selectedAppointment.value = {
    id: appointment.id,
    appointment_date: appointment.fields.appointment_date,
    appointment_address: appointment.fields.appointment_address,
    contact_id: appointment.fields.contact_id,
    agent_id: appointment.fields.agent_id,
    is_cancelled: currentStatus === 'Cancelled',
    status: currentStatus
  }
  updateModal.value = true
}

const closeUpdateModal = () => {
  updateModal.value = false
}

const updateAppointment = async () => {
  updateIsLoading.value = true
  try {
    const records = [
      {
        id: selectedAppointment.value.id,
        fields: {
          appointment_date: selectedAppointment.value.appointment_date,
          appointment_address: selectedAppointment.value.appointment_address,
          contact_id: selectedAppointment.value.contact_id,
          agent_id: selectedAppointment.value.agent_id,
          is_cancelled: selectedAppointment.value.is_cancelled,
        }
      }
    ]

    // Airtable update çağrısı
    const response = await apiService.patch(`/appointments`, { records })

    if (response.status === 200) {
      closeUpdateModal()
      getAllAppointments()
    }
  } catch (error : any) {
    console.error('Error updating appointment:', error.response?.data || error.message)
  } finally {
    updateIsLoading.value = false
  }
}



const openCreateModal = () => {
  createAppointmentModalShow.value = true
}

const removeContactFromUpdate = (contactId: string) => {
  selectedAppointment.value.contact_id = selectedAppointment.value.contact_id.filter(c => c !== contactId)
}

const toggleAgentInUpdate = (agentId: string) => {
  if (selectedAppointment.value.agent_id.includes(agentId)) {
    selectedAppointment.value.agent_id = selectedAppointment.value.agent_id.filter(id => id !== agentId)
  } else {
    selectedAppointment.value.agent_id.push(agentId)
  }
}

const getAgentName = (agentId: string) => {
  const agent = agents.value.find(a => a.id === agentId)
  return agent ? `${agent.fields.agent_name} ${agent.fields.agent_surname}` : ''
}


watch(createAppointmentModalShow, (newVal) => {
  if (!newVal) {
    searchContactQuery.value = ''
    selectedAgentIds.value = []
    showAgentDropdown.value = false
    createAppointmentForm.value = {
      appointment_date: new Date(),
      appointment_address: "",
      contact_id: [],
      agent_id: [],
      is_cancelled: false,
    }
  }
})

const closeCreateAppointmentModal = () => {
  createAppointmentModalShow.value = false
}


const createAppointment = async () => {
  createIsLoading.value = true
  createAppointmentForm.value.appointment_date = moment(createAppointmentForm.value.appointment_date).toDate()
  let data = {
    fields: {
      appointment_date: createAppointmentForm.value.appointment_date,
      appointment_address: createAppointmentForm.value.appointment_address,
      contact_id: createAppointmentForm.value.contact_id,
      agent_id: createAppointmentForm.value.agent_id,
      is_cancelled: false,
    },
  }
  const records = [data]
  try {
    const response = await apiService.post('/appointments', {"records" : records})
    if (response.status === 200) {
      createIsLoading.value = false
      closeCreateAppointmentModal()
      getAllAppointments()
    }
  } catch (error) {
    console.error('Error creating appointment:', error)
  } finally {
    createIsLoading.value = false
  }
}

const toggleAgentDropdown = () => {
  showAgentDropdown.value = !showAgentDropdown.value
}

const toggleAgent = (agentId: string) => {
  const index = createAppointmentForm.value.agent_id.indexOf(agentId)
  if (index === -1) {
    createAppointmentForm.value.agent_id.push(agentId)
  } else {
    createAppointmentForm.value.agent_id.splice(index, 1)
  }
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (showAgentDropdown.value) {
      showAgentDropdown.value = false
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', () => {})
})

const filteredContacts = computed(() => {
  if (!searchContactQuery.value) return []
  const query = searchContactQuery.value.toLowerCase()
  return contacts.value.filter(contact => {
    // Skip if already selected
    if (createAppointmentForm.value.contact_id.includes(contact.id)) return false
    
    return (
      contact.fields.contact_name.toLowerCase().includes(query) ||
      contact.fields.contact_surname.toLowerCase().includes(query) ||
      contact.fields.contact_email.toLowerCase().includes(query)
    )
  })
})

const getContactName = (contactId: string) => {
  const contact = contacts.value.find(c => c.id === contactId)
  if (!contact) return ''
  return `${contact.fields.contact_name} ${contact.fields.contact_surname}`
}

const selectContact = (contactId: string) => {
  if (!createAppointmentForm.value.contact_id.includes(contactId)) {
    createAppointmentForm.value.contact_id.push(contactId)
  }
  searchContactQuery.value = ''
}

const removeContact = (contactId: string) => {
  createAppointmentForm.value.contact_id = createAppointmentForm.value.contact_id.filter(id => id !== contactId)
}

// Total pages computed property
const totalPages = computed(() => Math.ceil(appointments.value.length / itemsPerPage.value))

// Displayed pages computed property
const displayedPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 3 // Number of pages to show on each side

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
})

// Function to change page
const changePage = (page: number | string) => {
  if (typeof page === 'string') return;
  currentPage.value = page;
}

const handleClickOutside = (event: MouseEvent) => {
  const dropdown = document.querySelector('.agents-dropdown')
  const trigger = document.querySelector('.agents-dropdown-trigger')
  
  if (dropdown && trigger && !dropdown.contains(event.target as Node) && !trigger.contains(event.target as Node)) {
    showAllAgents.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const filterObj = ref({
  status: null,
  startDate: new Date().setHours(9, 0, 0, 0),
  endDate: new Date().setHours(18, 0, 0, 0)
})


const getAgents = async () => {
  isLoading.value = true
  try {
    const res = await apiService.get<{ records: Agent[] }>('/agents')
    if(res.status === 200){
      agents.value = res.data.records
    }
  } catch (error) {
    console.error('Error fetching agents:', error)
  } finally {
    isLoading.value = false
  }
}


const getContacts = async () => {
  isLoading.value = true
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

    contacts.value = allRecords
  } catch (error) {
    console.error('Error fetching contacts:', error)
  } finally {
    isLoading.value = false
  }
}


const getAllAppointments = async () => {
  isLoading.value = true
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

    const sortedData = allRecords.sort((a, b) => {
      return moment(b.fields.appointment_date).diff(moment(a.fields.appointment_date))
    })

    appointments.value = sortedData.map(e => ({
      ...e,
      fields: {
        ...e.fields,
        status: appointmentStatus(e.fields.is_cancelled !== undefined ? e.fields.is_cancelled : undefined, e.fields.appointment_date)
      }
    }))
    
    withOutFilterAppointments.value = sortedData.map(e => ({
      ...e,
      fields: {
        ...e.fields,
        status: appointmentStatus(e.fields.is_cancelled !== undefined ? e.fields.is_cancelled : undefined, e.fields.appointment_date)
      }
    }))
  } catch (error) {
    console.error('Error fetching appointments:', error)
  } finally {
    isLoading.value = false
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
  const minutes = Math.floor(duration.asMinutes() % 60)
  
  if (days > 0) {
    return `${days} days`
  }
  if (hours > 0) {
    return `${hours} hours`
  }
  return `${minutes} min`
}

const findAgent = (agentId: string): Agent | undefined => {
  return agents.value.find(agent => agent.id === agentId)
}


const findContact = (contactId: string): Contact | undefined => {
  return contacts.value.find(contact => contact.id === contactId)
}

const getContactField = (contactId: string, field: 'contact_name' | 'contact_surname' | 'contact_email' | 'contact_phone'): string => {
  const contact = findContact(contactId)
  if (!contact?.fields?.[field]) return ''
  const value = Array.isArray(contact.fields[field]) ? contact.fields[field][0] : contact.fields[field]
  return String(value)
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


const filterAppointments = () => {
  console.log(searchText);
  
  const { status, startDate, endDate } = filterObj.value
  let filteredData = [...withOutFilterAppointments.value]

  // Filter by status
  if (status !== null) {
    filteredData = filteredData.filter(app => app.fields.status === status)
  }

  // Filter by date range
  if (startDate && endDate) {
    const startMoment = moment(startDate)
    const endMoment = moment(endDate)
    
    filteredData = filteredData.filter(app => {
      const appointmentMoment = moment(app.fields.appointment_date)
      return appointmentMoment.isBetween(startMoment, endMoment, 'minute', '[]')
    })
  }

  // Filter by selected agents
  if (selectedAgentIds.value.length > 0) {
    filteredData = filteredData.filter(app => {
      return app.fields.agent_id.some(agentId => selectedAgentIds.value.includes(agentId))
    })
  }

  // Filter by search text
  if (searchText.value && searchText.value.length >= 3) {
    const searchQuery = searchText.value.toLowerCase()
    filteredData = filteredData.filter(app => {
      return (
        // Search in address
        app.fields.appointment_address.toLowerCase().includes(searchQuery) ||
        // Search in customer name
        app.fields.contact_name[0].toLowerCase().includes(searchQuery) ||
        app.fields.contact_surname[0].toLowerCase().includes(searchQuery) ||
        // Search in email
        app.fields.contact_email[0].toLowerCase().includes(searchQuery) ||
        // Search in phone number
        app.fields.contact_phone[0].toString().includes(searchQuery)
      )
    })
  }

  appointments.value = filteredData
  // Reset to first page when filters change
  currentPage.value = 1
}







onMounted(async () => {
  await getAgents()
  await getContacts()
  await getAllAppointments()
})


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





</style>
