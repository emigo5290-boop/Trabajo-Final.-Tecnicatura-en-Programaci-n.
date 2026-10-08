<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
defineProps({ title: String });
const emit = defineEmits(["close"]);
const dialog = ref(null);
let previous;
onMounted(async () => {
  previous = document.activeElement;
  await nextTick();
  dialog.value.showModal();
});
onUnmounted(() => previous?.focus());
</script>
<template>
  <Teleport to="body"
    ><dialog
      ref="dialog"
      class="modal"
      aria-labelledby="modal-title"
      @cancel.prevent="emit('close')"
      @click="
        (e) => {
          if (e.target === dialog) emit('close');
        }
      "
    >
      <div class="modal-cab">
        <h2 id="modal-title">{{ title }}</h2>
        <button
          class="btn btn-sec btn-chico"
          aria-label="Cerrar diálogo"
          @click="emit('close')"
        >
          ×
        </button>
      </div>
      <slot />
      <div class="modal-pie"><slot name="actions" /></div></dialog
  ></Teleport>
</template>
