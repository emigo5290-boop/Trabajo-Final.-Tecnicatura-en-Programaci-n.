<script setup>
import { computed, ref } from "vue";
import { useApp } from "../application/context.js";
import { iso, mins, fechaCorta } from "../domain/date.js";
import { sortReservations } from "../domain/availability.js";
import ActivityCard from "../components/ActivityCard.vue";
import ActivityEditor from "../components/ActivityEditor.vue";
import AppModal from "../components/AppModal.vue";
const app = useApp(),
  editing = ref(null),
  removing = ref(null),
  error = ref("");
const activities = computed(() =>
  [...app.activities.value].sort((a, b) =>
    (a.fecha + a.inicio).localeCompare(b.fecha + b.inicio),
  ),
);
const confirmed = computed(() =>
  sortReservations(
    app.reservations.value.filter(
      (r) =>
        r.estado === "aprobada" &&
        (r.fecha > iso(app.clock.value) ||
          (r.fecha === iso(app.clock.value) &&
            mins(r.fin) >
              app.clock.value.getHours() * 60 + app.clock.value.getMinutes())),
    ),
  ).map(({ id, fecha, inicio, fin, actividad }) => ({
    id,
    fecha,
    inicio,
    fin,
    actividad,
  })),
);
function remove() {
  try {
    app.content.removeActivity(removing.value.id);
    removing.value = null;
    app.notify("Actividad eliminada.");
  } catch (e) {
    error.value = e.message;
  }
}
</script>
<template>
  <div class="actions">
    <button class="btn btn-primary" @click="editing = {}">
      Agregar nueva actividad
    </button>
  </div>
  <section class="stack">
    <h2>Actividades publicadas</h2>
    <ActivityCard
      v-for="a in activities"
      :key="a.id"
      :activity="a"
      editable
      @edit="editing = $event"
      @remove="removing = $event"
    />
    <p v-if="!activities.length" class="bloque">
      Todavía no hay actividades publicadas.
    </p>
    <div class="bloque">
      <h2>Reservas confirmadas</h2>
      <ul class="lista">
        <li v-for="r in confirmed" :key="r.id" class="fila">
          <div>
            <strong>{{ r.actividad }}</strong
            ><small
              >{{ fechaCorta(r.fecha) }} · {{ r.inicio }} – {{ r.fin }}</small
            >
          </div>
        </li>
      </ul>
      <p v-if="!confirmed.length">No hay reservas confirmadas próximas.</p>
    </div>
  </section>
  <ActivityEditor
    v-if="editing"
    :activity="editing"
    @close="editing = null"
  /><AppModal
    v-if="removing"
    title="Eliminar actividad"
    @close="removing = null"
    ><p>Se eliminará «{{ removing.titulo }}» y su flyer.</p>
    <p class="err" role="alert">{{ error }}</p>
    <template #actions
      ><button class="btn btn-sec" @click="removing = null">Volver</button
      ><button class="btn btn-peligro" @click="remove">
        Eliminar
      </button></template
    ></AppModal
  >
</template>
