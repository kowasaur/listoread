<script setup lang="ts">
import { useCollection, useCurrentUser } from "vuefire";
import { query, where } from "firebase/firestore";
import { readingsRef, type Reading } from "@/firebase";
import { fullName } from "@/utils";
import { computed } from "vue";
import WholeList from "@/components/WholeList.vue";
import RequireSignIn from "@/components/RequireSignIn.vue";

const user = useCurrentUser();
const whereUser = where("uploader", "==", user.value?.uid ?? null);

// TODO: consider having a collection just for marking things as finished/currently reading
// for performance reasons (and just having the necessary info)
const readings = useCollection<Reading>(query(readingsRef, whereUser));
const currentReads = computed(() => readings.value.filter(r => !r.finish));
</script>

<template>
    <RequireSignIn>
        <div class="homepage">
            <aside>
                <h2>Currently Reading</h2>
                <div v-for="read in currentReads">
                    <RouterLink :to="`/edition/${read.edition.id}`">
                        <img
                            v-if="read.edition.img_url"
                            :src="read.edition.img_url"
                            alt="Picture of the book"
                        />
                        <div v-else>
                            <h5>{{ read.edition.title }}</h5>
                            <h6>{{ fullName(read.book.authors[0]) }}</h6>
                        </div>
                    </RouterLink>
                </div>
            </aside>

            <WholeList />
        </div>
    </RequireSignIn>
</template>

<style scoped>
aside {
    background-color: bisque;
    padding: var(--main-padding);
}

.homepage {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
}

img {
    width: 7rem;
}

h5 {
    margin-bottom: 0;
}

h6 {
    margin-top: 0.2rem;
}
</style>
