<script setup lang="ts">
import { ref } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import Checkbox from "@/components/input/Checkbox.vue";

defineProps<{
    field: string;
    label?: string;
    startDate?: Date;
    canYear?: boolean;
    hideLabel?: boolean;
}>();

const date = defineModel<Date | number>();
const yearPicker = ref(typeof date.value === "number");
</script>

<template>
    <div class="form-input">
        <label v-if="!hideLabel" :for="`dp-input-${field}`">{{ label }}</label>
        <VueDatePicker
            :uid="field"
            :name="field"
            v-model="date"
            :format="yearPicker ? 'yyyy' : 'dd/MM/yyyy, HH:mm'"
            :action-row="{ showNow: true, showCancel: false }"
            auto-apply
            :config="{ closeOnAutoApply: false, keepActionRow: true }"
            :min-date="startDate"
            :start-date="startDate"
            :year-picker="yearPicker"
            :year-range="[2000, 2050]"
        >
            <template #left-sidebar v-if="canYear">
                <Checkbox field="just_year" label="Only year" v-model="yearPicker" />
            </template>
        </VueDatePicker>
    </div>
</template>
