<script setup lang="ts">
import { listItemsRef, type ListItem, type LocalListGroup } from "@/firebase";
import { query, where } from "firebase/firestore";
import { useCollection } from "vuefire";

const { group } = defineProps<{ group: LocalListGroup }>();

const whereGroup = where("group", "==", group.id === "other" ? null : group);
const listItems = useCollection<ListItem>(query(listItemsRef, whereGroup));
</script>

<template>
    <div class="list-group">
        <h2>{{ group.name }}</h2>
        <ol>
            <li v-for="item in listItems" :key="item.id">
                <RouterLink :to="'edition/' + item.edition.id">{{ item.edition.title }}</RouterLink>
            </li>
        </ol>
    </div>
</template>
