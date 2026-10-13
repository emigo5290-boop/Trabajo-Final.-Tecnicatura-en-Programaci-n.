<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const preference = ref(window.SUMTheme.preference);
const currentTheme = ref(document.documentElement.dataset.theme);
const options = [
  {
    value: "light",
    label: "Modo claro",
    paths: [
      "M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42",
    ],
  },
  {
    value: "dark",
    label: "Modo oscuro",
    paths: ["M20.9 13.3A9 9 0 0 1 10.7 3.1 9 9 0 1 0 20.9 13.3Z"],
  },
  /*{
    value: "system",
    label: "Usar tema del sistema",
    paths: [
      "M4 3h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z",
      "M8 21h8m-4-5v5",
    ],
  },*/
];
function sync() {
  preference.value = window.SUMTheme.preference;
  currentTheme.value = document.documentElement.dataset.theme;
}
function change(value) {
  window.SUMTheme.setPreference(value);
}
onMounted(() => window.addEventListener("sum-theme-change", sync));
onUnmounted(() => window.removeEventListener("sum-theme-change", sync));
</script>
<template>
  <div class="theme-control">
    <div class="theme-switch" role="group" aria-label="Tema de apariencia">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="theme-option"
        :aria-label="option.label"
        :title="
          option.value === 'system'
            ? option.label +
              (currentTheme === 'dark' ? ' (oscuro)' : ' (claro)')
            : option.label
        "
        :aria-pressed="preference === option.value"
        @click="change(option.value)"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <circle v-if="option.value === 'light'" cx="12" cy="12" r="4" />
          <path v-for="(d, index) in option.paths" :key="index" :d="d" />
        </svg>
      </button>
    </div>
  </div>
</template>
