<script setup>
import { ref } from "vue";
import { CONFIG } from "../config.js";
const broken = ref(false);
</script>
<template>
  <RouterLink
    to="/"
    class="marca"
    :aria-label="`${CONFIG.NOMBRE_SUM} · Ir al inicio`"
  >
    <img
      v-if="!broken"
      class="logo"
      :src="CONFIG.LOGO_RUTA"
      alt=""
      @error="broken = true"
    /><span v-else class="brand-mark" aria-hidden="true">SUM</span>
    <span class="marca-txt">
      <span class="marca-nombre">{{ CONFIG.NOMBRE_SUM }}</span
      ><span class="marca-muni">{{ CONFIG.MUNICIPALIDAD }}</span>
    </span>
  </RouterLink>
</template>
