<script setup>
import { ref } from "vue";
import { iso } from "../domain/date.js";
import { useApp } from "../application/context.js";
import AppModal from "./AppModal.vue";
import FormField from "./FormField.vue";
const emit = defineEmits(["close"]),
  app = useApp(),
  date = ref(iso(new Date())),
  period = ref("dia");
function generate() {
  app.pdf.report(period.value, date.value, app.reservations.value);
  emit("close");
}
</script>
<template>
  <AppModal title="Generar informe PDF" @close="emit('close')"
    ><form @submit.prevent="generate">
      <div class="campo">
        <label for="period">Período</label
        ><select id="period" v-model="period">
          <option value="dia">Día</option>
          <option value="semana">Semana (lunes a domingo)</option>
          <option value="mes">Mes completo</option>
        </select>
      </div>
      <FormField
        v-model="date"
        name="report-date"
        label="Fecha"
        type="date"
        required
      />
      <p class="ayuda">
        Incluye solicitudes pendientes y reservas aprobadas o canceladas.
        Excluye las rechazadas.
      </p>
      <div class="actions">
        <button class="btn btn-primary">Descargar informe</button>
      </div>
    </form></AppModal
  >
</template>
