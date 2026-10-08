<script setup>
import { fechaCorta } from "../domain/date.js";
defineProps({ activity: Object, editable: Boolean });
defineEmits(["edit", "remove"]);
</script>
<template>
  <article class="tarjeta-sol">
    <h3>{{ activity.titulo }}</h3>
    <p>
      {{ fechaCorta(activity.fecha)
      }}<template v-if="activity.inicio">
        · {{ activity.inicio
        }}<template v-if="activity.fin">
          – {{ activity.fin }}</template
        ></template
      >
    </p>
    <p v-if="activity.descripcion">{{ activity.descripcion }}</p>
    <img
      v-if="/^data:image\/(jpeg|png|webp);base64,/.test(activity.flyer || '')"
      class="act-flyer"
      :src="activity.flyer"
      :alt="'Flyer: ' + activity.titulo"
    />
    <div v-if="editable" class="actions">
      <button class="btn btn-sec" @click="$emit('edit', activity)">
        Editar</button
      ><button class="btn btn-peligro" @click="$emit('remove', activity)">
        Eliminar
      </button>
    </div>
  </article>
</template>
