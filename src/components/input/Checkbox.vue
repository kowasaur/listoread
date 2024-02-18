<script setup lang="ts">
defineProps<{ field: string; label: string }>();
defineEmits<{ toggled: [] }>();
const checked = defineModel<boolean>();
</script>

<template>
    <div class="checkbox">
        <input
            type="checkbox"
            :name="field"
            :id="field"
            v-model="checked"
            @change="$emit('toggled')"
        />
        <label :for="field">{{ label }}</label>
    </div>
</template>

<style scoped>
.checkbox {
    display: flex;
    margin-bottom: 0.5em;
}
</style>
