<script setup>
import { computed } from "vue";
import { datosNota } from "../domain/note.js";
import { CONFIG } from "../config.js";
const props = defineProps({ reservation: Object });
const note = computed(() => datosNota(props.reservation));
</script>
<template>
  <article class="hoja">
    <div class="encab">
      <strong>{{ CONFIG.MUNICIPALIDAD }}</strong
      ><br />{{ CONFIG.NOMBRE_SUM }}
    </div>
    <h3>{{ note.titulo }}</h3>
    <p class="der">{{ note.lugarFecha }}</p>
    <p>{{ note.destinatario }}</p>
    <p>
      <template v-for="(segment, i) in note.cuerpo" :key="i"
        ><strong v-if="segment.b">{{ segment.t }}</strong
        ><template v-else>{{ segment.t }}</template></template
      >
    </p>
    <p v-if="note.observaciones">{{ note.observaciones }}</p>
    <p>{{ note.conformidad }}</p>
    <p>{{ note.cierre }}</p>
    <div class="firma">
      <p>Firma: <span class="lin-firma" /></p>
      <p>Aclaración: {{ note.aclaracion }}</p>
      <p>DNI: {{ note.dni }}</p>
      <p>Solicitud: {{ note.numero }}</p>
    </div>
  </article>
</template>
