<script setup>
import { ref } from "vue";
import { CONFIG } from "../config.js";
const broken = ref(false);
</script>
<template>
  <div class="marca">
    <img
      v-if="!broken"
      class="logo"
      :src="CONFIG.LOGO_RUTA"
      alt="Logo de la Municipalidad"
      @error="broken = true"
    /><span v-else class="brand-mark" aria-hidden="true">SUM</span>
    <div class="marca-txt">
      <span class="marca-nombre">{{ CONFIG.NOMBRE_SUM }}</span
      ><span class="marca-muni">{{ CONFIG.MUNICIPALIDAD }}</span>
    </div>
  </div>
</template>
