<script setup>
import { useApp } from "../application/context.js";
import { useRouter } from "vue-router";
const app = useApp(),
  router = useRouter();
function reserve() {
  if (app.session.value && app.session.value.rol !== "cliente")
    return app.notify("Ingresá como cliente para reservar.");
  router.push(
    app.session.value
      ? "/cliente/reservar"
      : { path: "/login", query: { next: "/cliente/reservar" } },
  );
}
</script>
<template>
  <button class="btn btn-primary" @click="reserve">Reservar cancha</button>
</template>
