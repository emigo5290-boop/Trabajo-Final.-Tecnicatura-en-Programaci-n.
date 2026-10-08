<script setup>
import { computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApp } from "./application/context.js";
import AppLayout from "./components/AppLayout.vue";
const skip = () => document.getElementById("main")?.focus();
const app = useApp(),
  route = useRoute(),
  router = useRouter();
let timer;
const secure = computed(() => !!route.meta.role);
watch(
  () => app.session.value,
  () => {
    if (route.meta.role && app.session.value?.rol !== route.meta.role)
      router.replace("/login");
  },
);
watch(
  () => route.path,
  async () => {
    await nextTick();
    document.querySelector("main h1")?.focus({ preventScroll: true });
  },
);
onMounted(() => {
  timer = setInterval(app.refresh, 30000);
  window.addEventListener("storage", app.refresh);
  window.addEventListener("pageshow", app.refresh);
});
onUnmounted(() => {
  clearInterval(timer);
  window.removeEventListener("storage", app.refresh);
  window.removeEventListener("pageshow", app.refresh);
});
</script>
<template>
  <a href="#main" class="skip" @click.prevent="skip">Saltar al contenido</a
  ><AppLayout :secure="secure"><RouterView :key="route.path" /></AppLayout>
  <div v-if="app.notice.value" class="notice" role="status">
    <span>{{ app.notice.value }}</span
    ><button @click="app.notify('')" aria-label="Cerrar aviso">×</button>
  </div>
</template>
