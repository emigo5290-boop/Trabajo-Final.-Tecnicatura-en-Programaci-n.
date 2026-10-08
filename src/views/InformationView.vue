<script setup>
import { reactive, ref } from "vue";
import { useApp } from "../application/context.js";
import FormField from "../components/FormField.vue";
const app = useApp(),
  form = reactive({
    ...app.info.value,
    actividades: app.info.value.actividades.join("\n"),
    normas: app.info.value.normas.join("\n"),
  }),
  error = ref("");
const lines = (text) =>
  text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
function save() {
  try {
    app.content.saveInfo({
      ...form,
      actividades: lines(form.actividades),
      normas: lines(form.normas),
    });
    error.value = "";
    app.notify("Información pública actualizada.");
  } catch (e) {
    error.value = e.message;
  }
}
</script>
<template>
  <form class="bloque form-width" @submit.prevent="save">
    <h2>Editar información del SUM</h2>
    <FormField
      v-model="form.direccion"
      name="direccion"
      label="Dirección"
      maxlength="160"
      required
    /><FormField
      v-model="form.horario"
      name="horario"
      label="Horarios de funcionamiento"
      maxlength="160"
      required
    /><FormField
      v-model="form.uso"
      name="uso"
      label="Uso de la cancha"
      type="textarea"
      maxlength="600"
    /><FormField
      v-model="form.actividades"
      name="actividades"
      label="Actividades permitidas"
      type="textarea"
      maxlength="800"
      help="Una por línea."
    /><FormField
      v-model="form.normas"
      name="normas"
      label="Normas de utilización"
      type="textarea"
      maxlength="1200"
      help="Una por línea."
    />
    <p class="err" role="alert">{{ error }}</p>
    <button class="btn btn-primary">Guardar información</button>
  </form>
</template>
