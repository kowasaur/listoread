<script setup lang="ts">
defineProps<{
    field: string;
    label: string;
    required?: boolean;
    initialValue?: string;
}>();
</script>

<template>
    <div class="form-input">
        <label :for="field">{{ label }}</label>
        <input type="text" :name="field" :id="field" :required="required" :value="initialValue" />
    </div>
</template>
