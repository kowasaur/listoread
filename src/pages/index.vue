<script setup lang="ts">
import { useCollection, useCurrentUser } from "vuefire";
import { addDoc, doc, query, where } from "firebase/firestore";
import { listItemsRef, editionsRef, type Edition, type ListItem } from "@/firebase";
import RefInput from "@/components/RefInput.vue";
import { inputValue } from "@/utils";
import { computed } from "vue";

const user = useCurrentUser();
const listItems = useCollection<ListItem>(
    query(listItemsRef, where("uploader", "==", user.value!.uid))
);

const userEditionIds = computed(() => listItems.value.map(l => l.edition.id));
const allEditions = useCollection<Edition>(editionsRef);
const editions = computed(() =>
    allEditions.value.filter(e => !userEditionIds.value.includes(e.id))
);

async function listItemSubmit(event: Event) {
    await addDoc(listItemsRef, {
        // TODO: maybe don't assume not null
        uploader: user.value!.uid,
        edition: doc(editionsRef, inputValue("edition")),
    });
    alert("Book uploaded successfully");
}
</script>

<template>
    <form>
        <RefInput field="edition" label="Edition" :collection="editions" v-slot="{ doc }">
            {{ doc.title }} by {{ doc.books[0].authors[0].surname }}
        </RefInput>
        <button @click.prevent="listItemSubmit">Add to List</button>
    </form>

    <div>
        <aside>
            <h2>Currently Reading</h2>
        </aside>

        <h2>Other</h2>
        <ol>
            <li v-for="item in listItems">{{ item.edition.title }}</li>
        </ol>
    </div>
</template>
