<script setup lang="ts">
import { useCollection } from "vuefire";
import { editionsRef, type Edition } from "@/firebase";

const editions = useCollection<Edition>(editionsRef);
</script>
<template>
    <div class="container">
        <div v-for="edition in editions" class="piece">
            <img
                v-if="edition.img_url"
                :src="edition.img_url"
                alt="Cover of edition"
                height="200"
            />
            <RouterLink :to="'/edition/' + edition.id">{{ edition.title }}</RouterLink>
        </div>
    </div>
</template>
