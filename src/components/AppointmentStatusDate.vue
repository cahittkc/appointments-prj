<template>
  <div class="flex items-center justify-between gap-x-2.5 bg-pink-500 p-2 py-1 rounded-full flex-1 max-w-[330px]  min-w-[279px]">
    <div class="bg-white py-1 px-3 text-sm rounded-full flex items-center justify-between gap-x-3 gap-y-0.5 flex-wrap">
      <span :class="getStatusColor(appointmentStatus(is_cancelled !== undefined ? is_cancelled : undefined, appointment_date))" class="white-space-nowrap text-xs flex items-center justify-center">{{ appointmentStatus(is_cancelled !== undefined ? is_cancelled : undefined, appointment_date) }}</span>
      <span v-if="appointmentStatus(is_cancelled !== undefined ? is_cancelled : undefined, appointment_date) === 'Upcoming'" class="white-space-nowrap text-xs flex items-center justify-center">{{ getTimeRemaining(is_cancelled !== undefined ? is_cancelled : undefined, appointment_date) }}</span>
    </div>
    <div class="text-white flex gap-0.5 items-center justify-between gap-x-2">
      <span>
        <Clock class="w-4 h-4 text-white" />
      </span>
      <span class="text-xs text-nowrap"> 
        {{ formatDateToFullDate(appointment_date) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock } from 'lucide-vue-next';
import { formatDateToFullDate, getTimeRemaining, appointmentStatus, getStatusColor } from '../utils/dateUtils';

interface Props {
  is_cancelled?: boolean;
  appointment_date: string;
}

defineProps<Props>();
</script>