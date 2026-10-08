<script setup>
import { ref } from "vue";
import { iso } from "../domain/date.js";
import AvailabilityCalendar from "../components/AvailabilityCalendar.vue";
import ReservationDetail from "../components/ReservationDetail.vue";
const day = ref(iso(new Date())),
  selected = ref(null);
</script>
<template>
  <AvailabilityCalendar
    v-model="day"
    admin
    @detail="selected = $event"
  /><ReservationDetail
    v-if="selected"
    :reservation="selected"
    @close="selected = null"
  />
</template>
