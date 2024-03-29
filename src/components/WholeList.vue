<script setup lang="ts">
import {
    addDoc,
    doc,
    getCountFromServer,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { useCollection, useCurrentUser } from "vuefire";
import { type ListGroup, listGroupsRef, type LocalListGroup, type FormListGroup } from "@/firebase";
import Group from "./Group.vue";
import Draggable from "vuedraggable";
import { ref, watchEffect } from "vue";
import ModalGroup from "./ModalGroup.vue";

const OTHER: LocalListGroup = { name: "Other", id: "other", colour: "#e9e3c7" };

// TODO: maybe accept prop from index.vue instead
const user = useCurrentUser();
const whereUser = where("uploader", "==", user.value!.uid);

const groups = useCollection<ListGroup>(query(listGroupsRef, whereUser, orderBy("order")), {
    ssrKey: "all-groups",
});
const groupCountRef = query(listGroupsRef, whereUser, where("order", ">=", 0));

const localGroups = ref<LocalListGroup[]>([]);
watchEffect(() => {
    const gs = groups.value;
    const ind = gs.findIndex(g => g.order >= 0);

    if (ind < 0) {
        localGroups.value = [OTHER, ...gs];
    } else {
        localGroups.value = [...gs.slice(ind), OTHER, ...gs.slice(undefined, ind)];
    }
});

const showCreateModal = ref(false);

async function createGroup(data: FormListGroup) {
    const { count: order } = (await getCountFromServer(groupCountRef)).data();
    await addDoc(listGroupsRef, { ...data, order });
    showCreateModal.value = false;
}

type GroupChange = { moved: { element: LocalListGroup; newIndex: number; oldIndex: number } };
// TODO: Consider using debounce to save money
function groupMoved({ moved }: GroupChange) {
    const start = Math.min(moved.newIndex, moved.oldIndex);
    const end = Math.max(moved.newIndex, moved.oldIndex);
    const gs = localGroups.value;
    const otherIndex = gs.findIndex(g => g.id === "other");

    for (let i = start; i < otherIndex; i++) {
        updateDoc(doc(listGroupsRef, gs[i].id), { order: i });
    }
    for (let i = otherIndex + 1; i <= end; i++) {
        updateDoc(doc(listGroupsRef, gs[i].id), { order: i - gs.length });
    }
}
</script>

<template>
    <Draggable
        v-model="localGroups"
        item-key="id"
        tag="main"
        @change="groupMoved"
        group="groups"
        :delay="300"
        delayOnTouchOnly="true"
    >
        <template #item="{ element }">
            <Group :group="element" />
        </template>
        <template #footer>
            <button class="list-group invisi-button" @click="showCreateModal = true">
                Create New Group
            </button>
        </template>
    </Draggable>
    <ModalGroup title="Create New Group" v-model="showCreateModal" @submit="createGroup" />
</template>

<style scoped>
main {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: var(--main-padding);
}

.list-group {
    margin: 0.5em;
    padding: 0.7em;
    border-style: solid;
    border-width: 1px;
    border-radius: 0.5em;
    min-width: 12em;
}
</style>
