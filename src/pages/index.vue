<script setup lang="ts">
import { useCollection, useCurrentUser } from "vuefire";
import { addDoc, doc, query, where } from "firebase/firestore";
import {
    readingsRef,
    listItemsRef,
    editionsRef,
    type Edition,
    type ListItem,
    type Reading,
} from "@/firebase";
import RefInput from "@/components/RefInput.vue";
import { fullName, inputValue } from "@/utils";
import { computed } from "vue";
import WholeList from "@/components/WholeList.vue";
import RequireSignIn from "@/components/RequireSignIn.vue";

const user = useCurrentUser();
const whereUser = where("uploader", "==", user.value?.uid ?? null);
const listItems = useCollection<ListItem>(query(listItemsRef, whereUser));

const userEditionIds = computed(() => listItems.value.map(l => l.edition.id));
const allEditions = useCollection<Edition>(editionsRef);
const editions = computed(() =>
    allEditions.value.filter(e => !userEditionIds.value.includes(e.id))
);

// TODO: consider having a collection just for marking things as finished/currently reading
// for performance reasons (and just having the necessary info)
const readings = useCollection<Reading>(query(readingsRef, whereUser));
const currentReads = computed(() => readings.value.filter(r => !r.finish));

async function listItemSubmit() {
    await addDoc(listItemsRef, {
        // TODO: maybe don't assume not null
        uploader: user.value!.uid,
        edition: doc(editionsRef, inputValue("edition")),
        group: null,
    });
    alert("Book uploaded successfully");
}
</script>

<template>
    <RequireSignIn>
        <form>
            <RefInput field="edition" label="Edition" :collection="editions" v-slot="{ doc }">
                {{ doc.title }} by {{ doc.books[0].authors[0].surname }}
            </RefInput>
            <button @click.prevent="listItemSubmit">Add to List</button>
        </form>

        <div class="homepage">
            <aside>
                <h2>Currently Reading</h2>
                <div v-for="read in currentReads">
                    <img
                        v-if="read.edition.img_url"
                        :src="read.edition.img_url"
                        alt="Picture of the book"
                        height="100"
                    />
                    <h5>{{ read.edition.title }}</h5>
                    <h6>{{ fullName(read.book.authors[0]) }}</h6>
                </div>
            </aside>

            <WholeList />
        </div>
    </RequireSignIn>
</template>

<style scoped>
.homepage {
    display: flex;
    flex-direction: row;
}
</style>
