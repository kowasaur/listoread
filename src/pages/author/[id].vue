<script setup lang="ts">
import { doc } from "firebase/firestore";
import { useDocument } from "vuefire";
import { useRoute } from "vue-router/auto";
import { authorsRef, type Author } from "@/firebase";
import { fullName } from "@/utils";

const route = useRoute("/author/[id]");
const { pending, data: author } = useDocument<Author>(doc(authorsRef, route.params.id));
</script>

<template>
    <div v-if="pending">Loading...</div>
    <div v-else-if="!author">No author with the ID {{ route.params.id }} exists</div>
    <div v-else class="container">
        <main>
            {{ fullName(author) }}
        </main>
    </div>
</template>
