<script setup lang="ts">
import { ref } from "vue";
import { deleteDoc, doc } from "firebase/firestore";
import { readingsRef, type Reading } from "@/firebase";
import { formatDate } from "@/utils";
import DateText from "./DateText.vue";

const { reading } = defineProps<{
    notCollection: boolean;
    reading: Reading;
}>();

const editing = ref(false);
const start = ref(formatDate(reading.start?.toDate()));
const finish = ref(formatDate(reading.finish?.toDate()));

const docRef = doc(readingsRef, reading.id);

async function save() {
    console.log(start.value);
}

function deleteThis() {
    if (confirm("Are you sure you want to delete this reading?")) deleteDoc(docRef);
}
</script>

<template>
    <tr>
        <td v-if="!notCollection">{{ reading.book.title }}</td>
        <template v-if="editing">
            <td><input type="date" v-model="start" /></td>
            <td><input type="date" v-model="finish" /></td>
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
