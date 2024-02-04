<script setup lang="ts">
const { field, label } = defineProps<{
    field: string;
    label: string;
    required?: boolean;
}>();
</script>

<template>
    <div class="form-input">
        <label :for="field">{{ label }}</label>
        <input type="text" :name="field" :id="field" :required="required" />
    </div>
</template>
