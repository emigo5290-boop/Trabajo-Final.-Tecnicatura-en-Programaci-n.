<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useApp } from "../application/context.js";
import { sortReservations } from "../domain/availability.js";
import { fechaCorta } from "../domain/date.js";
import StatusBadge from "../components/StatusBadge.vue";
import ReservationDetail from "../components/ReservationDetail.vue";
import AppModal from "../components/AppModal.vue";
import ReportDialog from "../components/ReportDialog.vue";
const props = defineProps({ requests: Boolean }),
  app = useApp(),
  route = useRoute(),
  state = ref(
    ["pendiente", "aprobada", "rechazada"].includes(route.query.estado)
      ? route.query.estado
      : "pendiente",
  ),
  selectedId = ref(null),
  pending = ref(null),
  report = ref(false),
  error = ref("");
const records = computed(() =>
  sortReservations(
    app.reservations.value.filter(
      (r) => !props.requests || r.estado === state.value,
    ),
  ),
);
const selected = computed(() =>
  app.reservations.value.find((r) => r.id === selectedId.value),
);
const labels = {
  pendiente: "Pendientes",
  aprobada: "Aprobadas",
  rechazada: "Rechazadas",
};
function decide(id, value) {
  error.value = "";
  try {
    app.booking.decide(id, value);
    app.notify("Solicitud actualizada.");
  } catch (e) {
    error.value = e.message;
  } finally {
    pending.value = null;
  }
}
</script>
<template>
  <div v-if="requests" class="tabs">
    <button
      v-for="(label, value) in labels"
      :key="value"
      :aria-pressed="state === value"
      @click="state = value"
    >
      {{ label }} ({{
        app.reservations.value.filter((r) => r.estado === value).length
      }})
    </button>
  </div>
  <div v-else class="barra">
    <p>{{ records.length }} reservas registradas</p>
    <button class="btn btn-primary" @click="report = true">
      Generar informe PDF
    </button>
  </div>
  <p v-if="error" class="err" role="alert">{{ error }}</p>
  <div class="stack">
    <article v-for="r in records" :key="r.id" class="tarjeta-sol">
      <div class="cab-sol">
        <h2>{{ r.cliente.nombre }} {{ r.cliente.apellido }}</h2>
        <StatusBadge :status="r.estado" />
      </div>
      <p>
        {{ fechaCorta(r.fecha) }} · {{ r.inicio }} – {{ r.fin }} ·
        {{ r.actividad }}
      </p>
      <div class="actions">
        <button class="btn btn-sec btn-chico" @click="selectedId = r.id">
          Ver solicitud y nota</button
        ><button class="btn btn-sec btn-chico" @click="app.pdf.note(r)">
          Descargar PDF</button
        ><template v-if="r.estado === 'pendiente'"
          ><button
            class="btn btn-primary btn-chico"
            @click="decide(r.id, 'aprobada')"
          >
            Aprobar</button
          ><button
            class="btn btn-peligro btn-chico"
            @click="
              pending = { r, state: 'rechazada', label: 'Rechazar solicitud' }
            "
          >
            Rechazar
          </button></template
        ><button
          v-if="!requests && ['pendiente', 'aprobada'].includes(r.estado)"
          class="btn btn-peligro btn-chico"
          @click="
            pending = { r, state: 'cancelada', label: 'Cancelar reserva' }
          "
        >
          Cancelar
        </button>
      </div>
    </article>
    <p v-if="!records.length" class="bloque">
      No hay solicitudes para mostrar.
    </p>
  </div>
  <ReservationDetail
    v-if="selected"
    :reservation="selected"
    @close="selectedId = null"
  /><ReportDialog v-if="report" @close="report = false" /><AppModal
    v-if="pending"
    :title="pending.label"
    @close="pending = null"
    ><p>
      {{ pending.label }} de {{ pending.r.cliente.nombre }}
      {{ pending.r.cliente.apellido }} del {{ fechaCorta(pending.r.fecha) }}. El
      horario quedará disponible.
    </p>
    <template #actions
      ><button class="btn btn-sec" @click="pending = null">Volver</button
      ><button
        class="btn btn-peligro"
        @click="decide(pending.r.id, pending.state)"
      >
        {{ pending.label }}
      </button></template
    ></AppModal
  >
</template>
