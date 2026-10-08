<script setup>
import { reactive, ref } from "vue";
import { useApp } from "../application/context.js";
import FormField from "../components/FormField.vue";
const app = useApp(),
  form = reactive({ usuario: app.pressName(), clave: "", clave2: "" }),
  error = ref(""),
  busy = ref(false);
async function save() {
  if (busy.value) return;
  busy.value = true;
  try {
    await app.content.savePress(form);
    form.clave = "";
    form.clave2 = "";
    error.value = "";
    app.notify("Acceso de Prensa actualizado.");
  } catch (e) {
    error.value = e.message;
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <form class="bloque form-width" @submit.prevent="save">
    <h2>Acceso del perfil Prensa</h2>
    <p>
      Prensa puede publicar actividades y editar información del SUM. Sus
      pantallas no muestran los datos personales de las reservas.
    </p>
    <FormField
      v-model="form.usuario"
      name="usuario"
      label="Usuario de Prensa"
      required
    /><FormField
      v-model="form.clave"
      name="clave"
      label="Nueva contraseña"
      type="password"
      autocomplete="new-password"
      help="Mínimo 8 caracteres, con letras y números."
      required
    /><FormField
      v-model="form.clave2"
      name="clave2"
      label="Confirmar contraseña"
      type="password"
      autocomplete="new-password"
      required
    />
    <p class="err" role="alert">{{ error }}</p>
    <button class="btn btn-primary" :disabled="busy">
      Guardar acceso de Prensa
    </button>
  </form>
</template>
