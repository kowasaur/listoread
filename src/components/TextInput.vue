<script setup lang="ts">
const { field, label } = defineProps<{
    field: string;
    label: string;
    required?: boolean;
}>();
</script>

<template>
    <label :for="field">{{ label }}</label>
    <input type="text" :name="field" :id="field" :required="required" />
</template>
