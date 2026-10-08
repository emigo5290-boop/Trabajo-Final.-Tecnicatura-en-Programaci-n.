<script setup>
import { useApp } from "../application/context.js";
const app = useApp();
const labels = {
  nombre: "Nombre",
  apellido: "Apellido",
  dni: "DNI",
  cuil: "CUIL",
  email: "Email",
};
</script>
<template>
  <section v-if="app.user.value" class="bloque form-width">
    <dl class="dl">
      <template v-for="(label, key) in labels" :key="key"
        ><dt>{{ label }}</dt>
        <dd>{{ app.user.value[key] }}</dd></template
      >
      <dt>Cuenta</dt>
      <dd>{{ app.user.value.verificado ? "Verificada" : "Sin verificar" }}</dd>
    </dl>
  </section>
</template>
