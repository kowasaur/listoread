<script setup lang="ts" generic="T">
import { type VueFirestoreQueryData } from "vuefire";

const { collection } = defineProps<{
    field: string;
    label: string;
    collection: VueFirestoreQueryData<T>;
}>();
</script>

<template>
    <div class="form-input">
        <label :for="field">{{ label }}</label>
        <select :name="field" :id="field">
            <option v-for="doc in collection" :key="doc.id" :value="doc.id">
                <slot :doc="doc"></slot>
            </option>
        </select>
    </div>
</template>
