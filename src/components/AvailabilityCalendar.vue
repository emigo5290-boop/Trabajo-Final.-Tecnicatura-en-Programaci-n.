<script setup>
import { ref, computed, watch } from "vue";
import { CONFIG } from "../config.js";
import { useApp } from "../application/context.js";
import { iso, deISO, hh, fechaLarga } from "../domain/date.js";
import { hourStatus, outsideService } from "../domain/availability.js";
import StatusBadge from "./StatusBadge.vue";
const props = defineProps({
  modelValue: { type: String, default: () => iso(new Date()) },
  futureOnly: Boolean,
  admin: Boolean,
});
const emit = defineEmits(["update:modelValue", "detail"]);
const app = useApp();
const month = ref(
  new Date(
    deISO(props.modelValue).getFullYear(),
    deISO(props.modelValue).getMonth(),
    1,
  ),
);
watch(
  () => props.modelValue,
  (v) => {
    if (v)
      month.value = new Date(deISO(v).getFullYear(), deISO(v).getMonth(), 1);
  },
);
const label = computed(() =>
  month.value.toLocaleDateString("es-AR", { month: "long", year: "numeric" }),
);
const days = computed(() => {
  const y = month.value.getFullYear(),
    m = month.value.getMonth();
  return [
    ...Array((month.value.getDay() + 6) % 7).fill(null),
    ...Array.from({ length: new Date(y, m + 1, 0).getDate() }, (_, i) =>
      iso(new Date(y, m, i + 1)),
    ),
  ];
});
const hours = Array.from(
  { length: CONFIG.HORA_CIERRE - CONFIG.HORA_APERTURA },
  (_, i) => i + CONFIG.HORA_APERTURA,
);
const status = (h) =>
  hourStatus(
    props.modelValue,
    h,
    app.reservations.value,
    app.court.value,
    app.clock.value,
  );
const record = (h) =>
  app.reservations.value.find(
    (r) =>
      r.estado === "aprobada" &&
      r.fecha === props.modelValue &&
      r.inicio <= hh(h) &&
      r.fin > hh(h),
  );
function move(n) {
  month.value = new Date(
    month.value.getFullYear(),
    month.value.getMonth() + n,
    1,
  );
}
</script>
<template>
  <div class="cal-wrap">
    <div class="cal">
      <div class="cal-cab">
        <button class="cal-nav" aria-label="Mes anterior" @click="move(-1)">
          ‹
        </button>
        <h3 aria-live="polite">{{ label }}</h3>
        <button class="cal-nav" aria-label="Mes siguiente" @click="move(1)">
          ›
        </button>
      </div>
      <div class="cal-sem">
        <span
          v-for="d in ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']"
          :key="d"
          >{{ d }}</span
        >
      </div>
      <div class="cal-grid">
        <template v-for="(date, i) in days" :key="date || 'blank' + i"
          ><span v-if="!date" /><button
            v-else
            class="dia"
            :class="{
              sel: date === modelValue,
              hoy: date === iso(app.clock.value),
              con: app.reservations.value.some(
                (r) => r.estado === 'aprobada' && r.fecha === date,
              ),
              fuera: outsideService(app.court.value, date),
            }"
            :disabled="futureOnly && date < iso(app.clock.value)"
            :aria-label="fechaLarga(date)"
            :aria-pressed="date === modelValue"
            @click="emit('update:modelValue', date)"
          >
            {{ Number(date.slice(-2)) }}<span class="pto" /></button
        ></template>
      </div>
      <div class="leyenda">
        <StatusBadge
          v-for="s in ['libre', 'reservado', 'ocupado', 'bloqueado', 'fuera']"
          :key="s"
          :status="s"
        />
      </div>
    </div>
    <section class="dia-panel">
      <h3>{{ fechaLarga(modelValue) }}</h3>
      <p class="sub">Horarios del día</p>
      <ul class="horas">
        <li
          v-for="h in hours"
          :key="h"
          class="hora"
          :class="
            't-' +
            {
              libre: 'libre',
              reservado: 'reservada',
              ocupado: 'ocupada',
              fuera: 'fuera',
              bloqueado: 'bloq',
            }[status(h)]
          "
        >
          <span class="rango">{{ hh(h) }} – {{ hh(h + 1) }}</span
          ><StatusBadge :status="status(h)" /><span
            v-if="record(h)"
            class="act"
            >{{ record(h).actividad }}</span
          ><button
            v-if="admin && record(h)"
            class="btn btn-sec btn-chico"
            @click="emit('detail', record(h))"
          >
            Ver detalle
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>
