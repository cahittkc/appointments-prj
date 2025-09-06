

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
                  :class="{'!ring-3 !ring-green-500 transition-all': filterObj.agent_ids.includes(agent.id)}"
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
              <div v-if="showAllAgents" class="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[100] agents-dropdown">
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
            <select v-model="filterObj.status"  class="w-[150px] h-[42px] bg-gray-50 border border-gray-200 rounded-lg text-xs px-3 focus:outline-none" name="" id="">
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


        </div>
        <div class="flex items-center group w-[300px]">
          <input @input="filterAppointments" v-model="searchText" type="text" placeholder="Search..." class="w-full min-w-[220px] pl-10 pr-4 py-2.5 h-[42px] bg-gray-50 border border-gray-200 rounded-tl-lg rounded-bl-lg focus:outline-none" />
          <div class="px-3 py-2.5 bg-gray-50 h-[42px] flex items-center justify-center border-2 border-gray-200 transition-all rounded-tr-lg rounded-br-lg  group-focus-within:border-pink-500">
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
              <input @keydown.enter="filterAppointments" v-model="searchText" type="text" placeholder="Search appointments..." class="w-full pl-4 pr-12 py-3 h-[48px] bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none text-sm" />
              <Search class="absolute right-3 text-gray-500 w-4 h-4 z-10" />
            </div>
            <div>
              <select v-model="filterObj.status" class="w-full h-[44px] text-xs bg-gray-50 border border-gray-200 rounded-lg  px-3 focus:outline-none focus:border-pink-500">
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
          <!-- Status Filter -->
          

          <!-- Date Range -->
          <div class="grid grid-cols-2 gap-3">
            <div class="modal">
               <VueDatePicker auto-apply :clearable="false" format="dd/MM/yyyy HH:mm" v-model="filterObj.startDate" @change="filterAppointments" class="w-[240px] text-xs before:content-['From'] before:absolute before:top-0.5 before:left-3 before:text-[11px] before:z-10 before:font-semibold before:text-gray-500" name="" id="" />
            </div>
            <div class="modal">
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
        <span class="text-sm text-gray-600">{{ withOutFilterAppointments.length }} Appointments found. </span>
        <div v-if="newAppointmentIds.length > 0" class="flex items-center gap-x-2 text-sm text-green-600 animate-pulse">
          <CheckCircle class="w-5 h-5" />
          New appointment added! The list will be sorted by date in 7 seconds.
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
          New appointment added! The list will be sorted by date in 7 seconds.
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-400">{{ withOutFilterAppointments.length }} found</span>
          <button @click="openCreateModal" class="px-3 py-2 bg-pink-500 text-white flex items-center rounded-md gap-x-2">
            <CirclePlusIcon class="w-4 h-4" />
            <span class="text-sm">New</span>
          </button>
        </div>
      </div>

      <!-- Section appointment list -->
      <div class="w-full overflow-hidden py-8 animate-fade-up" :class="{ 'animate-fade-up-active': isPageLoaded }">
          <!-- Empty State -->
          <div v-if="paginatedAppointments.length === 0" class="flex flex-col items-center justify-center py-8 md:py-16 px-4">
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
          <div v-else class="grid gap-3 px-2 md:px-2 max-md:px-2">
            <div @click="selectAppointment(app)" v-for="(app,index) in paginatedAppointments" :key="app.id" :class="{'bg-gray-100': index % 2 === 0, 'animate-pulse border-green-500': newAppointmentIds.includes(app.id)}" class="cursor-pointer border border-gray-200 rounded-lg grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 max-md:gap-3 shadow-sm py-4 max-md:py-3">
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
                        <div v-if="showAgentListForAppointment[app.id]" class="absolute top-full -left-[130px] max-md:left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[100]" data-appointment-dropdown :data-appointment-id="app.id">
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

            <div class="flex flex-col gap-y-1">
              <div class="flex items-center group w-full">
                <input :class="{'!border-red-600 border' : v$.createAppointmentForm.contact_id.$errors.length > 0}" v-model="searchContactQuery" type="text" placeholder="Search..." class="w-full pl-10 pr-4 py-2.5 h-[42px] bg-gray-50 border border-gray-200 rounded-tl-lg rounded-bl-lg focus:outline-none" />
                <div class="px-3 py-2.5 bg-black h-[42px] flex items-center justify-center border border-gray-200 transition-all rounded-tr-lg rounded-br-lg">
                  <Search class="text-white w-4 h-4" />
                </div>
              </div>
              <div class="flex gap-x-1 items-center" v-for="error of v$.createAppointmentForm.contact_id.$errors" :key="error.$uid">
                  <span v-if="v$.createAppointmentForm.contact_id.$errors" class="text-[11px] text-red-500"> At least one contact is required </span>
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


          <div class="flex flex-col gap-y-1">
            <div :class="{'!border-red-600 border' : v$.createAppointmentForm.appointment_address.$errors.length > 0}" class="flex items-center h-[42px] bg-gray-50 border border-gray-200 rounded-sm w-full relative">
              <span v-if="createAppointmentForm.appointment_address === ''" class="text-xs text-gray-500 absolute top-[11px] -translate-y-1/2 left-3">Address</span>
              <input :class="{'!pl-4' : createAppointmentForm.appointment_address !== ''}" v-model="createAppointmentForm.appointment_address" type="text"  class="w-full pl-10 pr-4 py-2.5 h-[42px] text-xs outline-0 pt-4" />
              <House class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>
            <div class="flex gap-x-1 items-center" v-for="error of v$.createAppointmentForm.appointment_address.$errors" :key="error.$uid">
                <span v-if="v$.createAppointmentForm.appointment_address.$errors" class="text-[11px] text-red-500"> Address is required </span>
            </div>
          </div>

          <AgentDropdown
            :agents="agents"
            :selected-agent-ids="createAppointmentForm.agent_id"
            :is-open="showAgentDropdown"
            :has-error="v$.createAppointmentForm.agent_id.$errors.length > 0"
            @toggle-dropdown="toggleAgentDropdown"
            @toggle-agent="toggleAgent"
          />

          <div class="modal relative">
            <VueDatePicker auto-apply :clearable="false" :min-date="new Date()"  format="dd/MM/yyyy HH:mm" v-model="createAppointmentForm.appointment_date" class="w-[240px] text-xs before:content-['Appointment_Date'] before:absolute before:top-0.5 before:left-3 before:text-[11px] before:z-10  before:text-gray-500" name="" id="" />
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


   <!--Update Appoinment Modal-->
  <BaseModal :isOpen="updateModal" @close="closeUpdateModal">
    <template #title>
      <div class="flex items-center gap-x-1.5">
        <CalendarPlus2 class="w-5 h-5" />
        <span class="text-md font-semibold text-gray-500">Edit the Appointment</span>
      </div>
    </template>

    <template #content>
      <div class="flex flex-col gap-y-2.5">
              <div v-if="!addContactModalShow && selectedAppointment.contact_id.length === 0" @click="addContactModalShow = true" class="flex cursor-pointer gap-y-2 flex-1 items-center justify-center border border-dashed border-gray-300 rounded-lg p-4 min-h-[110px] relative">
                  <UserPlus2 class="w-5 h-5 text-gray-300" />            
              </div>
              <UserPlus2 v-if="!addContactModalShow && selectedAppointment.contact_id.length > 0" @click="addContactModalShow = true"  class="w-5 h-5 text-gray-500 mb-2 cursor-pointer flex items-center justify-end ml-auto" />
              <div class="max-h-60 overflow-y-auto flex flex-col gap-y-2.5" >
                <template v-for="c in selectedAppointment.contact_id">
                  <div class="flex flex-col gap-y-2 flex-1 items-start border border-gray-300 rounded-lg p-4 relative">
                      <ContactInfo 
                        :contact-name="getContactField(c, 'contact_name')"
                        :contact-surname="getContactField(c, 'contact_surname')"
                        :contact-email="getContactField(c, 'contact_email')"
                        :contact-phone="getContactField(c, 'contact_phone')"
                        container-class=""
                      />
                      <X @click="removeContactFromUpdate(c)" class="absolute right-2 top-2  text-gray-500 w-4 h-4 cursor-pointer" />                     
                  </div>
                </template>
              </div>
              <div class="-mt-5" v-for="error of v$.selectedAppointment.contact_id.$errors" :key="error.$uid">
                <span v-if="v$.selectedAppointment.contact_id.$errors" class="text-[11px] text-red-500">   At least one person must be added  </span>
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
                      <div v-if="searchContactQuery && availableContacts.length > 0" class="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                        <div v-for="contact in availableContacts" :key="contact.id" @click="addContactToUpdate(contact.id)" class="flex items-center gap-x-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <div class="flex flex-col text-left">
                            <span class="text-sm">{{ contact.fields.contact_name }} {{ contact.fields.contact_surname }}</span>
                            <span class="text-xs text-gray-500">{{ contact.fields.contact_email }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </AddContactModal>
              <div class="flex flex-col gap-y-0.5">
                <div :class="{'border-red-600': v$.selectedAppointment.appointment_address.$errors.length > 0}" v-if="!addContactModalShow" class="flex items-center h-[42px] bg-white border border-gray-200 rounded-sm w-full relative">
                  <span v-if="selectedAppointment.appointment_address == ''" class="text-xs text-gray-500 absolute top-[11px] -translate-y-1/2 left-3">Address</span>
                  <input :class="{'pt-4 !pl-10' : selectedAppointment.appointment_address == ''}" v-model="selectedAppointment.appointment_address" type="text"  class="w-full pl-4 pr-4 py-2.5 h-[42px] text-xs outline-0" />
                  <X @click="selectedAppointment.appointment_address = ''" class="absolute right-3 top-2 cursor-pointer text-gray-500 w-4 h-4" />
                </div>
                <div v-for="error of v$.selectedAppointment.appointment_address.$errors" :key="error.$uid">
                  <span v-if="v$.selectedAppointment.appointment_address.$errors" class="text-[11px] text-red-500"> Address is required </span>
                </div>
              </div>

              <AgentDropdown
                v-if="!addContactModalShow"
                :agents="agents"
                :selected-agent-ids="selectedAppointment.agent_id"
                :is-open="showAgentDropdown"
                :has-error="v$.selectedAppointment.agent_id.$errors.length > 0"
                @toggle-dropdown="() => showAgentDropdown = !showAgentDropdown"
                @toggle-agent="toggleAgentInUpdate"
              />

              <div v-if="!addContactModalShow" class="modal relative">
                <VueDatePicker auto-apply :clearable="false" :min-date="new Date()"  format="dd/MM/yyyy HH:mm" v-model="selectedAppointment.appointment_date" class="w-[240px] text-xs before:content-['Appointment_Date'] before:absolute before:top-0.5 before:left-3 before:text-[11px] before:z-10  before:text-gray-500" name="" id="" />
              </div>

              <div v-if="!addContactModalShow" class="flex items-center h-[42px] bg-white border border-gray-200 rounded-sm w-full relative">
                <select v-model="selectedAppointment.is_cancelled" class="w-full pl-4 pr-4 py-2.5 h-[42px] text-xs outline-0 bg-transparent appearance-none cursor-pointer">
                  <template v-if="new Date(selectedAppointment.appointment_date) > new Date()">
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

              <!-- Related Appointments -->
              <div v-if="selectedAppointment.contact_id.length > 0 && !addContactModalShow" class="mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Related Appointments</h4>
                <div class="overflow-y-auto max-h-[188px] space-y-2">
                  <template v-for="contactId in selectedAppointment.contact_id" :key="contactId">
                    <div v-for="relatedApp in getContactOtherAppointments(contactId)" :key="relatedApp.id" @click="selectAppointmentForRelated(relatedApp)" class="flex items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200 cursor-pointer">
                      <div class="flex flex-col gap-1 flex-1">
                        <div class="text-sm font-medium text-gray-900 flex gap-x-2 items-center">
                          <House class="w-4 h-4 min-w-4 min-h-4 flex-shrink-0 text-gray-500" />
                          <span>{{ relatedApp.fields.appointment_address }}</span>
                        </div>
                        <AppointmentStatusDate 
                          :is_cancelled="relatedApp.fields.is_cancelled" 
                          :appointment_date="relatedApp.fields.appointment_date" 
                        />
                      </div>
                      <div class="flex items-center gap-x-2">
                        <template v-for="(agentId, index) in relatedApp.fields.agent_id" :key="agentId">
                          <div v-if="findAgent(agentId) && index < 1" class="relative group -ml-3 first:ml-0">
                            <div 
                              class="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ring-2 ring-white"
                              :style="{ backgroundColor: findAgent(agentId)?.fields?.color || '#gray-400' }"
                            >
                              <span class="text-white text-xs">
                                {{ findAgent(agentId)?.fields?.agent_name?.[0] || '?' }}{{ findAgent(agentId)?.fields?.agent_surname?.[0] || '?' }}
                              </span>
                            </div>
                          </div>
                        </template>
                        <div v-if="relatedApp.fields.agent_id?.length > 1" class="relative group -ml-3">
                          <div 
                            class="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center cursor-pointer ring-2 ring-white"
                          >
                            <span class="text-white font-medium text-xs">
                              +{{ relatedApp.fields.agent_id?.length - 1 }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>

              

        </div>
    </template>


    <template #footer>
      <div class="flex justify-end gap-x-2">
        <button  @click="closeUpdateModal" class="px-4 py-2 text-sm font-medium text-black  border border-gray-300 rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">Close</button>
        <button @click="updateAppointment" :disabled="updateIsLoading" class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-500 border border-transparent rounded-md shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed">
          <Loader2 v-if="updateIsLoading" class="w-4 h-4 mr-2 -ml-1 animate-spin" />
          Save
        </button>
      </div>
    </template>


  </BaseModal>


</template>

<script lang="ts">
import { Agent, Appointment, Contact, CreateAppointmentForm, editAppointmentForm } from '@/models'
import { apiService } from '@/service/axiosService'
import { useToast } from 'vue-toastification'
import { User, Mail, Phone, House, Search, Check, ChevronLeft, ChevronRightIcon, CirclePlusIcon, CalendarPlus2, ChevronDown, X, Loader2, UserPlus2, CheckCircle } from 'lucide-vue-next';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { Vue3Lottie } from 'vue3-lottie';
import Calendar from "../public/Calendar.json"
import BaseModal from './components/BaseModal.vue';
import LoadingOverlay from './components/LoadingOverlay.vue';
import AddContactModal from './components/AddContactModal.vue';
import AppointmentStatusDate from './components/AppointmentStatusDate.vue';
import ContactInfo from './components/ContactInfo.vue';
import AgentDropdown from './components/AgentDropdown.vue';
import { useVuelidate } from '@vuelidate/core'
import { minLength , requiredIf } from '@vuelidate/validators'
import moment from 'moment';

const toast = useToast()

export default {
  name: 'App',
  setup () {
    return { v$: useVuelidate() }
  },
  components: {
    BaseModal,
    LoadingOverlay,
    AddContactModal,
    AppointmentStatusDate,
    ContactInfo,
    AgentDropdown,
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
      withOutFilterAppointments: [] as Appointment[],
      appointments: [] as Appointment[],
      agents: [] as Agent[],
      contacts: [] as Contact[],
      showAllAgents: false,
      showAgentListForAppointment: {} as Record<string, boolean>,
      searchText: '',
      isLoading: false,
      createIsLoading: false,
      createAppointmentModalShow: false,
      searchContactQuery: '',
      showAgentDropdown: false,
      addContactModalShow: false,
      updateIsLoading: false,
      selectedAppointment: {
        id: '',
        appointment_date: '',
        appointment_address: '',
        contact_id: [],
        agent_id: [],
        is_cancelled: false,
      } as editAppointmentForm,
      updateModal: false,
      createAppointmentForm: {
        appointment_date: new Date(),
        appointment_address: "",
        contact_id: [],
        agent_id: [],
        is_cancelled: false,
      } as CreateAppointmentForm,
      currentPage: 1,
      itemsPerPage: 10,
      filterObj: {
        agent_ids : [] as string[],
        status: null,
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(9, 0, 0, 0),
        endDate: new Date().setHours(18, 0, 0, 0)
      },
      isPageLoaded: false
    }
  },
  validations() {
    return {
      createAppointmentForm: {
        appointment_date: {required : requiredIf(() => this.createAppointmentModalShow)},
        appointment_address: {required : requiredIf(() => this.createAppointmentModalShow)},
        contact_id: {minLength : minLength(1), required : requiredIf(() => this.createAppointmentModalShow)},
        agent_id: {minLength : minLength(1), required : requiredIf(() => this.createAppointmentModalShow)},
        is_cancelled: {},
      },
      selectedAppointment: {
        id: {required : requiredIf(() => this.updateModal)},
        appointment_date: {required : requiredIf(() => this.updateModal)},
        appointment_address: {required : requiredIf(() => this.updateModal)},
        contact_id: {minLength : minLength(1), required : requiredIf(() => this.updateModal)},
        agent_id: {minLength : minLength(1), required : requiredIf(() => this.updateModal)},
        is_cancelled: {},
      }  
    }
  },
  computed: {
    availableContacts() {
      const contactIds = Array.isArray(this.selectedAppointment.contact_id) ? this.selectedAppointment.contact_id : [this.selectedAppointment.contact_id]
      return this.contacts.filter(contact => !contactIds.includes(contact.id))
    },
    paginatedAppointments() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.appointments.slice(start, end)
    },
    filteredContacts() {
      if (!this.searchContactQuery) return []
      const query = this.searchContactQuery.toLowerCase()
      return this.contacts.filter(contact => {
        // Skip if already selected
        if (this.createAppointmentForm.contact_id.includes(contact.id)) return false
        
        return (
          contact.fields.contact_name.toLowerCase().includes(query) ||
          contact.fields.contact_surname.toLowerCase().includes(query) ||
          contact.fields.contact_email.toLowerCase().includes(query)
        )
      })
    },
    totalPages() {
      return Math.ceil(this.appointments.length / this.itemsPerPage)
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
      handler(newVal) {
        this.filterAppointments()
      },
      deep: true
    },
    createAppointmentModalShow(newVal) {
      if (!newVal) {
        this.searchContactQuery = ''
        this.showAgentDropdown = false
        this.createAppointmentForm = {
          appointment_date: new Date(),
          appointment_address: "",
          contact_id: [],
          agent_id: [],
          is_cancelled: false,
        }
      }
    }
  },
  methods: {
    getContactOtherAppointments(contactId: string) {
      return this.withOutFilterAppointments.filter(app => {
        const appContactIds = Array.isArray(app.fields.contact_id) ? app.fields.contact_id : [app.fields.contact_id]
        return appContactIds.includes(contactId) && app.id !== this.selectedAppointment.id
      }).sort((a, b) => {
        const dateA = new Date(a.fields.appointment_date)
        const dateB = new Date(b.fields.appointment_date)
        return dateB.getTime() - dateA.getTime() // Yeniden eskiye sıralama
      })
    },
    addContactToUpdate(contactId: string) {
      this.selectedAppointment.contact_id.push(contactId)
      this.addContactModalShow = false
    },
    toggleUpdateModal() {
      this.isLoading = true
      this.updateModal = false
      setTimeout(() => {
        this.updateModal = true
        this.isLoading = false
      }, 300);
    },
    selectAppointment(appointment: Appointment) {
      const currentStatus = this.appointmentStatus(appointment.fields.is_cancelled, appointment.fields.appointment_date)
      
      this.selectedAppointment = {
        id: appointment.id,
        appointment_date: appointment.fields.appointment_date,
        appointment_address: appointment.fields.appointment_address,
        contact_id: appointment.fields.contact_id,
        agent_id: Array.isArray(appointment.fields.agent_id) ? [...appointment.fields.agent_id].filter(id => id !== undefined && id !== null) : [appointment.fields.agent_id].filter(id => id !== undefined && id !== null),
        is_cancelled: currentStatus === 'Cancelled',
        status: currentStatus
      }
      this.updateModal = true
    },
    selectAppointmentForRelated(relatedApp: Appointment){
      const currentStatus = this.appointmentStatus(relatedApp.fields.is_cancelled, relatedApp.fields.appointment_date)
      
      // Completed durumunda is_cancelled false olmalı ki selectbox'ta "Completed" görünsün
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
      this.searchContactQuery = ''
      this.v$.$reset();
      this.updateModal = false
    },
    async updateAppointment() {
      const valid = await this.v$.$validate()
      console.log(this.v$.$errors);
      
      console.log(valid);
      
      if (!valid) {
        return
      }
      this.updateIsLoading = true
      if(this.selectedAppointment.agent_id) {
        this.selectedAppointment.agent_id = this.selectedAppointment.agent_id.filter(id => id !== undefined && id !== null)
      }
      try {
        const records = [
          {
            id: this.selectedAppointment.id,
            fields: {
              appointment_date: this.selectedAppointment.appointment_date,
              appointment_address: this.selectedAppointment.appointment_address,
              contact_id: this.selectedAppointment.contact_id,
              agent_id: this.selectedAppointment.agent_id,
              is_cancelled: this.selectedAppointment.is_cancelled,
            }
          }
        ]

        // Airtable update çağrısı
        const response = await apiService.patch(`/appointments`, { records })

        if (response.status === 200) {
          const updatedAppointment = this.processAppointmentData(response.data.records)[0]
          const index = this.appointments.findIndex(a => a.id === updatedAppointment.id)
          const withoutFilterIndex = this.withOutFilterAppointments.findIndex(a => a.id === updatedAppointment.id)
          
          if (index !== -1) {
            this.appointments[index] = updatedAppointment
          }
          
          if (withoutFilterIndex !== -1) {
            this.withOutFilterAppointments[withoutFilterIndex] = updatedAppointment
          }
          
          this.closeUpdateModal()
          toast.success("Appointment updated successfully")
        }
      } catch (error : any) {
        console.error('Error updating appointment:', error.response?.data || error.message)
        toast.error("Appointment updated failed")
      } finally {
        this.updateIsLoading = false
      }
    },
    openCreateModal() {
      this.createAppointmentModalShow = true
    },
    removeContactFromUpdate(contactId: string) {
      this.selectedAppointment.contact_id = this.selectedAppointment.contact_id.filter(c => c !== contactId)
    },
    toggleAgentInUpdate(agentId: string) {
      if (this.selectedAppointment.agent_id.includes(agentId)) {
        this.selectedAppointment.agent_id = this.selectedAppointment.agent_id.filter(id => id !== agentId)
      } else {
        this.selectedAppointment.agent_id.push(agentId)
      }
    },
    getAgentName(agentId: string) {
      const agent = this.agents.find(a => a.id === agentId)
      return agent ? `${agent.fields.agent_name} ${agent.fields.agent_surname}` : ''
    },
    closeCreateAppointmentModal() {
      this.v$.$reset();
      this.createAppointmentModalShow = false
    },
    async createAppointment() {
      const valid = await this.v$.$validate()
      if (!valid) {
        return
      }
      this.createIsLoading = true
      this.createAppointmentForm.appointment_date = moment(this.createAppointmentForm.appointment_date).toDate()
      let data = {
        fields: {
          appointment_date: this.createAppointmentForm.appointment_date,
          appointment_address: this.createAppointmentForm.appointment_address,
          contact_id: this.createAppointmentForm.contact_id,
          agent_id: this.createAppointmentForm.agent_id,
          is_cancelled: false,
        },
      }
      const records = [data]
      try {
        const response = await apiService.post('/appointments', {"records" : records})
        if (response.status === 200) {
          const newAppointment = response.data.records[0]
          this.appointments.unshift(newAppointment)
          this.withOutFilterAppointments.unshift(newAppointment)
          
          this.createIsLoading = false
          this.closeCreateAppointmentModal()
          toast.success("Appointment created successfully")
          
          this.newAppointmentIds = [newAppointment.id]
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
          setTimeout(() => {
            this.appointments = this.processAppointmentData(this.appointments)
            this.withOutFilterAppointments = this.processAppointmentData(this.withOutFilterAppointments)
            this.newAppointmentIds = []
          }, 7000)
        }
      } catch (error) {
        toast.error("Appointment created failed")
      } finally {
        this.createIsLoading = false
      }
    },
    toggleAgentDropdown() {
      this.showAgentDropdown = !this.showAgentDropdown
    },
    toggleAgent(agentId: string) {
      const index = this.createAppointmentForm.agent_id.indexOf(agentId)
      if (index === -1) {
        this.createAppointmentForm.agent_id.push(agentId)
      } else {
        this.createAppointmentForm.agent_id.splice(index, 1)
      }
    },
    processAppointmentData(records: any[]) {
      const sortedData = records.sort((a, b) => {
        return moment(b.fields.appointment_date).diff(moment(a.fields.appointment_date))
      })

      return sortedData.map(e => ({
        ...e,
        fields: {
          ...e.fields,
          status: this.appointmentStatus(e.fields.is_cancelled !== undefined ? e.fields.is_cancelled : undefined, e.fields.appointment_date)
        }
      }))
    },
    getContactName(contactId: string) {
      const contact = this.contacts.find(c => c.id === contactId)
      if (!contact) return ''
      return `${contact.fields.contact_name} ${contact.fields.contact_surname}`
    },
    selectContact(contactId: string) {
      if (!this.createAppointmentForm.contact_id.includes(contactId)) {
        this.createAppointmentForm.contact_id.push(contactId)
      }
      this.searchContactQuery = ''
    },
    removeContact(contactId: string) {
      this.createAppointmentForm.contact_id = this.createAppointmentForm.contact_id.filter(id => id !== contactId)
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
    async getAgents() {
      this.isLoading = true
      try {
        const res = await apiService.get<{ records: Agent[] }>('/agents')
        if(res.status === 200){
          this.agents = res.data.records
        }
      } catch (error) {
        console.error('Error fetching agents:', error)
      } finally {
        this.isLoading = false
      }
    },
    async getContacts() {
      this.isLoading = true
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

        this.contacts = allRecords
      } catch (error) {
        console.error('Error fetching contacts:', error)
      } finally {
        this.isLoading = false
      }
    },
    async getAllAppointments() {
      this.isLoading = true
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

        this.appointments = allRecords
        this.withOutFilterAppointments = allRecords
        this.appointments = this.processAppointmentData(this.appointments)
        this.withOutFilterAppointments = this.processAppointmentData(this.withOutFilterAppointments)
      } catch (error) {
        console.error('Error fetching appointments:', error)
      } finally {
        this.isLoading = false
      }
    },
    findAgent(agentId: string): Agent | undefined {
      return this.agents.find(agent => agent.id === agentId)
    },
    findContact(contactId: string): Contact | undefined {
      return this.contacts.find(contact => contact.id === contactId)
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
    filterAppointments() {
      const { status, startDate, endDate } = this.filterObj
      let filteredData = [...this.withOutFilterAppointments]

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
      if (this.filterObj.agent_ids.length > 0) {
        filteredData = filteredData.filter(app => {
          return app.fields.agent_id && Array.isArray(app.fields.agent_id) && app.fields.agent_id.some(agentId => this.filterObj.agent_ids.includes(agentId))
        })
      }

      // Filter by search text
      if (this.searchText && this.searchText.length >= 3) {
        const searchQuery = this.searchText.toLowerCase()
        filteredData = filteredData.filter(app => {
          const contactName = Array.isArray(app.fields.contact_name) && app.fields.contact_name.length > 0 ? app.fields.contact_name[0] : ''
          const contactSurname = Array.isArray(app.fields.contact_surname) && app.fields.contact_surname.length > 0 ? app.fields.contact_surname[0] : ''
          const contactEmail = Array.isArray(app.fields.contact_email) && app.fields.contact_email.length > 0 ? app.fields.contact_email[0] : ''
          const contactPhone = Array.isArray(app.fields.contact_phone) && app.fields.contact_phone.length > 0 ? app.fields.contact_phone[0].toString() : ''

          return (
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
        })
      }

      this.appointments = filteredData
      // Reset to first page when filters change
      this.currentPage = 1
    }
  },
  async created() {
    await this.getAgents()
    await this.getContacts()
    await this.getAllAppointments()
    this.filterAppointments()
    
    // animation for short delay
    setTimeout(() => {
      this.isPageLoaded = true
    }, 100)
    
    document.addEventListener('click', this.handleClickOutside)
    document.addEventListener('click', (e) => {
      if (this.showAgentDropdown) {
        this.showAgentDropdown = false
      }
    })
  },
  unmounted() {
    document.removeEventListener('click', this.handleClickOutside)
    document.removeEventListener('click', () => {})
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
