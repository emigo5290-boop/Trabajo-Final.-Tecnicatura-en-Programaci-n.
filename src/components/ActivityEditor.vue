<script setup>
import { reactive, ref } from "vue";
import { useApp } from "../application/context.js";
import { iso } from "../domain/date.js";
import AppModal from "./AppModal.vue";
import FormField from "./FormField.vue";
const props = defineProps({ activity: Object }),
  emit = defineEmits(["close"]),
  app = useApp(),
  form = reactive({
    id: "",
    titulo: "",
    fecha: iso(new Date()),
    inicio: "",
    fin: "",
    descripcion: "",
    flyer: "",
    ...props.activity,
  }),
  error = ref(""),
  busy = ref(false);
async function upload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  busy.value = true;
  try {
    form.flyer = await app.flyer(file);
    error.value = "";
  } catch (e) {
    error.value = e.message;
    event.target.value = "";
  } finally {
    busy.value = false;
  }
}
function save() {
  try {
    app.content.saveActivity(form);
    app.notify("Actividad guardada.");
    emit("close");
  } catch (e) {
    error.value = e.message;
  }
}
</script>
<template>
  <AppModal
    :title="form.id ? 'Editar actividad' : 'Nueva actividad'"
    @close="emit('close')"
    ><form @submit.prevent="save">
      <FormField
        v-model="form.titulo"
        name="titulo"
        label="Nombre de la actividad"
        maxlength="100"
        required
      /><FormField
        v-model="form.fecha"
        name="fecha-act"
        label="Fecha"
        type="date"
        required
      />
      <div class="fila2">
        <FormField
          v-model="form.inicio"
          name="inicio-act"
          label="Hora de inicio (opcional)"
          type="time"
        /><FormField
          v-model="form.fin"
          name="fin-act"
          label="Hora de fin (opcional)"
          type="time"
        />
      </div>
      <FormField
        v-model="form.descripcion"
        name="descripcion"
        label="Descripción (opcional)"
        type="textarea"
        maxlength="400"
      />
      <div class="campo">
        <label for="flyer">Flyer (imagen de hasta 10 MB)</label
        ><input
          id="flyer"
          type="file"
          accept="image/*"
          :disabled="busy"
          @change="upload"
        />
      </div>
      <template v-if="form.flyer"
        ><img
          class="act-flyer"
          :src="form.flyer"
          alt="Vista previa del flyer"
        /><button type="button" class="btn btn-sec" @click="form.flyer = ''">
          Quitar flyer
        </button></template
      >
      <p class="err" role="alert">{{ error }}</p>
      <div class="actions">
        <button class="btn btn-primary" :disabled="busy">
          {{ busy ? "Procesando imagen…" : "Guardar actividad" }}
        </button>
      </div>
    </form></AppModal
  >
</template>
