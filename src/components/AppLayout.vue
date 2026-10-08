<script setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useApp } from "../application/context.js";
import { home, menus } from "../router/index.js";
import AppBrand from "./AppBrand.vue";
defineProps({ secure: Boolean });
const app = useApp(),
  router = useRouter(),
  route = useRoute(),
  open = ref(false);
const role = computed(() => app.session.value?.rol);
const label = computed(
  () =>
    ({
      admin: "Administración",
      prensa: "Prensa",
      cliente: app.user.value?.nombre + " " + app.user.value?.apellido,
    })[role.value],
);
watch(
  () => route.path,
  () => (open.value = false),
);
function logout() {
  app.auth.logout();
  router.push("/");
}
</script>
<template>
  <div v-if="secure && role" class="app">
    <aside class="lado" :class="{ abierto: open }">
      <div class="lado-in">
        <div class="lado-cab">
          <AppBrand /><button
            class="btn btn-sec menu-btn"
            :aria-expanded="open"
            aria-controls="nav-principal"
            @click="open = !open"
          >
            Menú
          </button>
        </div>
        <p class="usuario-chip">{{ label }}</p>
        <nav id="nav-principal" class="nav" aria-label="Menú principal">
          <RouterLink
            v-for="[path, title] in menus[role]"
            :key="path"
            :to="path"
            >{{ title }}</RouterLink
          ><RouterLink to="/">Ver sitio público</RouterLink
          ><button class="salir" @click="logout">Cerrar sesión</button>
        </nav>
      </div>
    </aside>
    <main id="main" class="cuerpo" tabindex="-1">
      <h1 class="pag-tit page-heading" tabindex="-1">{{ route.meta.title }}</h1>
      <slot />
    </main>
  </div>
  <template v-else
    ><header class="cab">
      <div class="cab-in">
        <AppBrand />
        <div class="cab-acc">
          <RouterLink
            class="btn btn-sec btn-chico"
            :to="route.path === '/' ? (role ? home(role) : '/login') : '/'"
            >{{
              route.path === "/"
                ? role
                  ? "Ir a mi panel"
                  : "Ingresar"
                : "Volver al SUM"
            }}</RouterLink
          >
        </div>
      </div>
    </header>
    <main id="main" class="contenedor" tabindex="-1"><slot /></main>
    <footer class="contenedor pie">
      SUM Municipal · Municipalidad de Bella Vista<br />Versión de demostración:
      los datos se guardan en este navegador. Los códigos se muestran en
      pantalla; no se envían correos.
    </footer></template
  >
</template>
