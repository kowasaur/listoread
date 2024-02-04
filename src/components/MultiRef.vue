<script setup lang="ts" generic="T">
import type { VueFirestoreQueryData } from "vuefire";

const inputs = defineModel<string[]>({ required: true });

defineProps<{
    field: string;
    label: string;
    collection: VueFirestoreQueryData<T>;
}>();
</script>

<template>
    <div class="form-input">
        <div class="multi-label">
            <label :for="`${field}1`">{{ label }}{{ inputs.length > 1 ? "s" : "" }}</label>
            <button v-if="inputs.length > 1" type="button" @click="inputs.pop()">-</button>
            <button type="button" @click="inputs.push('')">+</button>
        </div>
        <select v-for="(_, i) in inputs" v-model="inputs[i]" :name="field + i" :id="field + i">
            <option value="" disabled>...</option>
            <option v-for="doc in collection" :key="doc.id" :value="doc.id">
                <slot :doc="doc"></slot>
            </option>
        </select>
    </div>
</template>

<style scoped>
.multi-label {
    display: flex;
}

.multi-label > label {
    flex-grow: 1;
}
</style>
