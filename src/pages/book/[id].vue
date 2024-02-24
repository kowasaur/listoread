<script setup lang="ts">
import { ref, watch } from "vue";
import { doc, setDoc } from "firebase/firestore";
import { useCurrentUser, useDocument } from "vuefire";
import { useRoute } from "vue-router/auto";
import { booksRef, type Book, notesRef, type Note } from "@/firebase";
import BookTitleAuthors from "@/components/BookTitleAuthors.vue";

const route = useRoute("/book/[id]");
const user = useCurrentUser();

const bookDoc = doc(booksRef, route.params.id);

const noteDoc = doc(notesRef, route.params.id + user.value?.uid);
const { pending, data: book } = useDocument<Book>(bookDoc);
const note = useDocument<Note>(noteDoc);

const text = ref("");
watch(note, () => note.value && (text.value = note.value?.note));

const editing = ref(false);

function saveNote() {
    setDoc(noteDoc, {
        uploader: user.value!.uid,
        book: bookDoc,
        note: text.value,
    });
    editing.value = false;
}
</script>

<template>
    <div v-if="pending">Loading...</div>
    <div v-else-if="!book">No book with the ID {{ route.params.id }} exists</div>
    <div v-else class="container">
        <main>
            <BookTitleAuthors :title="book.title" :authors="book.authors" />
            <div v-if="user">
                <div class="space-between notes-heading">
                    <h3>Notes</h3>
                    <div v-if="editing">
                        <button class="cancel" @click="editing = false">Cancel</button>
                        <button @click="saveNote">Save</button>
                    </div>
                    <button v-else @click="editing = true">Edit</button>
                </div>
                <textarea
                    v-if="editing"
                    v-model="text"
                    name="notes"
                    id="notes"
                    rows="30"
                ></textarea>
                <p v-else>{{ note?.note }}</p>
            </div>
        </main>
    </div>
</template>

<style scoped>
h3 {
    margin: 0;
}

.notes-heading {
    margin: 0.2rem 0;
}

.cancel {
    margin-right: 0.2rem;
}

p {
    white-space: pre-line;
}

textarea {
    width: 100%;
}
</style>
