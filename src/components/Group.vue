<script setup lang="ts">
import { listItemsRef, type ListItem, type LocalListGroup, listGroupsRef } from "@/firebase";
import { doc, query, updateDoc, where } from "firebase/firestore";
import { useCollection, useCurrentUser } from "vuefire";
import GroupItem from "./GroupItem.vue";
import Draggable from "vuedraggable";
import { ref, watch } from "vue";
import { useModal } from "vue-final-modal";
import ModalListItem from "./ModalListItem.vue";

const { group } = defineProps<{ group: LocalListGroup }>();

const user = useCurrentUser();
const groupRef = group.id === "other" ? null : doc(listGroupsRef, group.id);
const listItems = useCollection<ListItem>(
    // the user thing is necessary for the Other group
    query(listItemsRef, where("group", "==", groupRef), where("uploader", "==", user.value!.uid)),
    { wait: true }
);

const localItems = ref<ListItem[]>([]);

function sortItems() {
    // In theory this shouldn't be necessary but it is
    // I think because the { wait: true } only works for the inital render
    // Probably should come up with an actual solution
    if (listItems.value.some(v => typeof v.edition === "string")) return;

    localItems.value = [...listItems.value];
    localItems.value.sort((a, b) => a.edition.title.localeCompare(b.edition.title));
}

watch(listItems, sortItems, { deep: true });

async function itemMoved({ added }: { added?: { element: ListItem } }) {
    if (!added) return; // fired on where it's removed from as well
    await updateDoc(doc(listItemsRef, added.element.id), { group: groupRef });
    sortItems();
}

const { open, close } = useModal({
    component: ModalListItem,
    attrs: { initialGroup: group.id, onSubmited: () => close() },
});
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
        <template #footer>
            <button @click="open">Add Edition</button>
        </template>
    </Draggable>
</template>

<style scoped>
h2 {
    margin-bottom: 0.3em;
}

button {
    width: 100%;
    opacity: 50%;
    border-radius: 0.3rem;
    border: 1px solid black;
    padding: 0.2rem;
}

button:hover {
    opacity: 70%;
}

button:active {
    opacity: 90%;
}
</style>
