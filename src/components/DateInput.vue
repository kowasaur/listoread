<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";

defineProps<{
    field: string;
    label: string;
    startDate?: Date;
}>();

const date = defineModel<Date>();
</script>

<template>
    <div class="form-input">
        <label :for="`dp-input-${field}`">{{ label }}</label>
        <VueDatePicker
            :uid="field"
            :name="field"
            v-model="date"
            format="dd/MM/yyyy, HH:mm"
            :action-row="{ showNow: true, showCancel: false }"
            auto-apply
            :config="{ closeOnAutoApply: false, keepActionRow: true }"
            :min-date="startDate"
            :start-date="startDate"
        />
    </div>
</template>
