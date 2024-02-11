<script setup lang="ts">
import { doc, query, updateDoc, where } from "firebase/firestore";
import { useCollection, useCurrentUser } from "vuefire";
import Draggable from "vuedraggable";
import { ref, watch } from "vue";
import { useModal } from "vue-final-modal";
import {
    listItemsRef,
    type ListItem,
    type LocalListGroup,
    listGroupsRef,
    type FormListGroup,
} from "@/firebase";
import GroupItem from "./GroupItem.vue";
import ModalListItem from "./ModalListItem.vue";
import ModalGroup from "./ModalGroup.vue";

const { group } = defineProps<{ group: LocalListGroup }>();

const user = useCurrentUser();
const groupRef = group.id === "other" ? null : doc(listGroupsRef, group.id);
const listItems = useCollection<ListItem>(
    // the user thing is necessary for the Other group
    query(listItemsRef, where("group", "==", groupRef), where("uploader", "==", user.value!.uid)),
    { wait: true, ssrKey: "group-items" }
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

const showEdit = ref(false);

function editGroup(data: FormListGroup) {
    updateDoc(groupRef!, data);
    showEdit.value = false;
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
        :delay="300"
        delayOnTouchOnly="true"
    >
        <template #header>
            <div class="space-between">
                <h2>{{ group.name }}</h2>
                <button v-if="group.id !== 'other'" class="invisi-button" @click="showEdit = true">
                    Edit
                </button>
            </div>
        </template>
        <template #item="{ element }">
            <GroupItem :edition="element.edition" />
        </template>
        <template #footer>
            <button @click="open" class="add-button invisi-button">Add Edition</button>
            <ModalGroup title="Edit Group" v-bind="group" @submit="editGroup" v-model="showEdit" />
        </template>
    </Draggable>
</template>

<style scoped>
h2 {
    margin-bottom: 0.3em;
}

.add-button {
    width: 100%;
    border-radius: 0.3rem;
    border: 1px solid black;
    padding: 0.2rem;
}

.space-between > button {
    margin-left: 0.6rem;
}
</style>
