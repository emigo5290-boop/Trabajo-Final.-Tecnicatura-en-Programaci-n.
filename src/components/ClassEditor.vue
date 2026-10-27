<script setup>
import { nextTick, reactive, ref } from "vue";
import { useApp } from "../application/context.js";
import { CLASS_DAYS } from "../domain/classes.js";
import AppModal from "./AppModal.vue";
import FormField from "./FormField.vue";

const props = defineProps({ lesson: { type: Object, required: true } });
const emit = defineEmits(["close"]);
const app = useApp();
let nextKey = 0;
const form = reactive({
  id: props.lesson.id || "",
  nombre: props.lesson.nombre || "",
  descripcion: props.lesson.descripcion || "",
  imagen: props.lesson.imagen || "",
  horarios: (props.lesson.horarios || []).map((schedule) => ({
    ...schedule,
    key: nextKey++,
  })),
});
const error = ref("");
const busy = ref(false);
const photoInput = ref(null);
const addButton = ref(null);

async function uploadPhoto(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  busy.value = true;
  try {
    const photo = await app.flyer(file);
    if (photo.length > 2000000) throw Error("Elegí una foto de menor tamaño.");
    form.imagen = photo;
    error.value = "";
  } catch (e) {
    error.value = e.message;
  } finally {
    busy.value = false;
    event.target.value = "";
  }
}

async function addSchedule() {
  const key = nextKey++;
  form.horarios.push({ key, dia: "", inicio: "", fin: "" });
  await nextTick();
  document.getElementById(`class-day-${key}`)?.focus();
}
async function removeSchedule(index) {
  form.horarios.splice(index, 1);
  error.value = "";
  await nextTick();
  const next = form.horarios[index] || form.horarios[index - 1];
  if (next) document.getElementById(`class-day-${next.key}`)?.focus();
  else addButton.value?.focus();
}
function save() {
  if (busy.value) return;
  try {
    app.notify("");
    app.content.saveClass(form);
    if (!app.notice.value) app.notify("Clase guardada.");
    emit("close");
  } catch (e) {
    error.value = e.message;
  }
}
</script>

<template>
  <AppModal
    :title="form.id ? 'Editar clase' : 'Agregar clase'"
    @close="emit('close')"
  >
    <form @submit.prevent="save">
      <FormField
        v-model="form.nombre"
        name="class-name"
        label="Nombre de la clase"
        maxlength="80"
        required
      />
      <FormField
        v-model="form.descripcion"
        name="class-description"
        label="Descripción (opcional)"
        type="textarea"
        rows="3"
        maxlength="300"
        help="Podés indicar edades, niveles o información de contacto."
      />
      <div class="campo">
        <label for="class-photo">Foto de la clase (opcional)</label>
        <input
          id="class-photo"
          ref="photoInput"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          :disabled="busy"
          @change="uploadPhoto"
        />
        <p class="ayuda">
          JPG, PNG o WebP, hasta 10 MB. Podés reemplazar la foto ilustrativa por
          una del SUM.
        </p>
        <img
          v-if="form.imagen"
          :src="form.imagen"
          alt="Vista previa de la foto de la clase"
          class="class-photo-preview"
        />
        <button
          v-if="form.imagen"
          type="button"
          class="btn btn-sec btn-chico"
          :disabled="busy"
          @click="form.imagen = ''"
        >
          Quitar foto
        </button>
      </div>
      <fieldset class="class-schedule-editor">
        <legend>Horarios semanales</legend>
        <p class="ayuda">
          Agregá los días y horarios de la clase. Podés dejarlos pendientes y
          completarlos más adelante.
        </p>
        <fieldset
          v-for="(schedule, index) in form.horarios"
          :key="schedule.key"
          class="class-schedule-row"
        >
          <legend>Horario {{ index + 1 }}</legend>
          <FormField
            v-model="schedule.dia"
            :name="`class-day-${schedule.key}`"
            label="Día"
            :options="CLASS_DAYS"
            required
          />
          <div class="class-time-fields">
            <FormField
              v-model="schedule.inicio"
              :name="`class-start-${schedule.key}`"
              label="Desde"
              type="time"
              required
            />
            <FormField
              v-model="schedule.fin"
              :name="`class-end-${schedule.key}`"
              label="Hasta"
              type="time"
              required
            />
          </div>
          <button
            type="button"
            class="btn btn-sec btn-chico"
            :aria-label="`Quitar horario ${index + 1}`"
            @click="removeSchedule(index)"
          >
            Quitar horario
          </button>
        </fieldset>
        <p v-if="!form.horarios.length" class="class-pending">
          Se mostrará “Horarios a confirmar”.
        </p>
        <button
          ref="addButton"
          type="button"
          class="btn btn-sec btn-chico"
          @click="addSchedule"
        >
          ＋ Agregar horario
        </button>
      </fieldset>
      <p v-if="error" class="err" role="alert">{{ error }}</p>
      <div class="actions">
        <button type="button" class="btn btn-sec" @click="emit('close')">
          Cancelar
        </button>
        <button type="submit" class="btn btn-primary" :disabled="busy">
          {{ busy ? "Procesando foto…" : "Guardar clase" }}
        </button>
      </div>
    </form>
  </AppModal>
</template>
