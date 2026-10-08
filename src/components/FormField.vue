<script setup>
defineOptions({ inheritAttrs: false });
defineProps({
  modelValue: [String, Number],
  name: String,
  label: String,
  type: { type: String, default: "text" },
  error: String,
  help: String,
  options: Array,
});
defineEmits(["update:modelValue"]);
</script>
<template>
  <div class="campo">
    <label :for="name">{{ label }}</label
    ><textarea
      v-if="type === 'textarea'"
      :id="name"
      :name="name"
      :value="modelValue"
      :aria-invalid="!!error"
      :aria-describedby="name + '-help ' + name + '-error'"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
    /><select
      v-else-if="options"
      :id="name"
      :name="name"
      :value="modelValue"
      :aria-invalid="!!error"
      :aria-describedby="name + '-error'"
      v-bind="$attrs"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">Elegí una opción</option>
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option></select
    ><input
      v-else
      :id="name"
      :name="name"
      :type="type"
      :value="modelValue"
      :aria-invalid="!!error"
      :aria-describedby="name + '-help ' + name + '-error'"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p :id="name + '-help'" class="ayuda" v-if="help">{{ help }}</p>
    <p :id="name + '-error'" class="err" v-if="error">{{ error }}</p>
  </div>
</template>
