<script setup>
defineProps({ status: String });
const labels = {
  libre: "Libre",
  reservado: "Reservado",
  ocupado: "Ocupado",
  bloqueado: "Bloqueado",
  fuera: "Fuera de servicio",
  pendiente: "Pendiente",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
  cancelada: "Cancelada",
};
const tones = {
  libre: "libre",
  reservado: "reservada",
  ocupado: "ocupada",
  bloqueado: "bloq",
  fuera: "fuera",
  pendiente: "reservada",
  aprobada: "libre",
  rechazada: "ocupada",
  cancelada: "fuera",
};
</script>
<template>
  <span class="chip" :class="'t-' + tones[status]">{{
    labels[status] || status
  }}</span>
</template>
