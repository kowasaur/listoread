<script setup lang="ts">
import { listItemsRef, type ListItem, type LocalListGroup, listGroupsRef } from "@/firebase";
import { doc, query, updateDoc, where } from "firebase/firestore";
import { useCollection } from "vuefire";
import GroupItem from "./GroupItem.vue";
import Draggable from "vuedraggable";
import { computed, nextTick, ref, watch, watchEffect } from "vue";

const { group } = defineProps<{ group: LocalListGroup }>();

const groupRef = group.id === "other" ? null : doc(listGroupsRef, group.id);
const listItems = useCollection<ListItem>(query(listItemsRef, where("group", "==", groupRef)));

const localItems = ref<ListItem[]>([]);

function sortItems() {
    localItems.value = [...listItems.value];
    localItems.value.sort((a, b) => a.edition.title.localeCompare(b.edition.title));
}

watch(listItems, sortItems, { immediate: true });

async function itemMoved({ added }: { added?: { element: ListItem } }) {
    if (!added) return; // fired on where it's removed from as well
    await updateDoc(doc(listItemsRef, added.element.id), { group: groupRef });
    sortItems();
}
</script>

<template>
    <Draggable
        v-model="localItems"
        item-key="id"
        group="items"
        :sort="false"
        class="list-group"
        :style="{ backgroundColor: group.colour }"
        @change="itemMoved"
    >
        <template #header>
            <h2>{{ group.name }}</h2>
        </template>
        <template #item="{ element }">
            <GroupItem :edition="element.edition" />
        </template>
    </Draggable>
</template>
