<script setup>
import { computed } from "vue";
import { useApp } from "../application/context.js";
import { iso, fechaCorta } from "../domain/date.js";
import { sortReservations } from "../domain/availability.js";
import CourtStatus from "../components/CourtStatus.vue";
const app = useApp();
const today = computed(() => iso(app.clock.value));
const upcoming = computed(() =>
  sortReservations(
    app.reservations.value.filter(
      (r) => r.estado === "aprobada" && r.fecha >= today.value,
    ),
  ),
);
const states = {
  pendiente: "Pendientes",
  aprobada: "Aprobadas",
  rechazada: "Rechazadas",
};
</script>
<template>
  <CourtStatus
    :admin="app.session.value.rol === 'admin'"
    :reserve="app.session.value.rol === 'cliente'"
  /><template v-if="app.session.value.rol === 'admin'"
    ><div class="cifras">
      <RouterLink
        v-for="(label, state) in states"
        :key="state"
        :to="{ path: '/administracion/solicitudes', query: { estado: state } }"
        ><b>{{
          app.reservations.value.filter((r) => r.estado === state).length
        }}</b>
        <span>{{ label }}</span></RouterLink
      >
    </div>
    <div class="dos-col">
      <section
        v-for="isToday in [true, false]"
        :key="String(isToday)"
        class="bloque"
      >
        <h2>{{ isToday ? "Reservas del día" : "Próximas reservas" }}</h2>
        <ul class="lista">
          <li
            v-for="r in upcoming
              .filter((r) => (isToday ? r.fecha === today : r.fecha > today))
              .slice(0, isToday ? undefined : 6)"
            :key="r.id"
            class="fila"
          >
            <div>
              <strong>{{ r.actividad }}</strong
              ><small
                >{{ fechaCorta(r.fecha) }} · {{ r.inicio }} – {{ r.fin }} ·
                {{ r.cliente.nombre }} {{ r.cliente.apellido }}</small
              >
            </div>
          </li>
        </ul>
        <p
          v-if="
            !upcoming.some((r) =>
              isToday ? r.fecha === today : r.fecha > today,
            )
          "
          class="vacio-msg"
        >
          No hay reservas aprobadas.
        </p>
      </section>
    </div></template
  >
</template>
