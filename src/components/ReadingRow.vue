<script setup lang="ts">
import { ref } from "vue";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { readingsRef, type Reading, type Datey } from "@/firebase";
import DateText from "./DateText.vue";
import DateInput from "./input/DateInput.vue";

const { reading } = defineProps<{
    notCollection: boolean;
    reading: Reading;
}>();

const dateVal = (d: Datey) => (typeof d === "number" ? new Date(d, 0) : d?.toDate());

const editing = ref(false);
const start = ref<Date | number | undefined>(dateVal(reading.start));
const finish = ref<Date | number | undefined>(dateVal(reading.finish));

const docRef = doc(readingsRef, reading.id);

async function save() {
    // TODO: make this work when you remove finish or start
    await updateDoc(docRef, { start: start.value, finish: finish.value });
    editing.value = false;
}

function deleteThis() {
    if (confirm("Are you sure you want to delete this reading?")) deleteDoc(docRef);
}
</script>

<template>
    <tr>
        <td v-if="!notCollection">{{ reading.book.title }}</td>
        <template v-if="editing">
            <td><DateInput :field="`${reading.id}start`" v-model="start" hide-label /></td>
            <td>
                <DateInput :field="`${reading.id}finish`" v-model="finish" hide-label can-year />
            </td>
            <td>
                <button @click="save">Save</button>
                <button @click="editing = false">Cancel</button>
            </td>
        </template>
        <template v-else>
            <td><DateText :date="reading.start" /></td>
            <td><DateText :date="reading.finish" /></td>
            <td>
                <button @click="editing = true">Edit</button>
                <button @click="deleteThis">Delete</button>
            </td>
        </template>
    </tr>
</template>
