<script setup lang="ts">
import { useCollection, useCurrentUser } from "vuefire";
import { addDoc, doc, orderBy } from "firebase/firestore";
import { computed } from "vue";
import RefInput from "./RefInput.vue";
import {
    listGroupsRef,
    type ListGroup,
    type ListItem,
    listItemsRef,
    type Edition,
    editionsRef,
    whereUser,
} from "@/firebase";
import { inputValue } from "@/utils";
import ModalForm from "./ModalForm.vue";

const { initialGroup } = defineProps<{ initialGroup: string }>();
const emit = defineEmits<{ submited: [] }>();

const user = useCurrentUser();
const groups = useCollection<ListGroup>(whereUser(listGroupsRef, user.value, orderBy("order")), {
    ssrKey: "modal-user-groups",
});

const listItems = useCollection<ListItem>(whereUser(listItemsRef, user.value), {
    ssrKey: "modal-list-items",
});
const userEditionIds = computed(() => listItems.value.map(l => l.edition.id));
const allEditions = useCollection<Edition>(editionsRef);
const editions = computed(() =>
    allEditions.value.filter(e => !userEditionIds.value.includes(e.id))
);

async function addListItem(uploader: string) {
    const groupId = inputValue("item-group");
    await addDoc(listItemsRef, {
        uploader,
        edition: doc(editionsRef, inputValue("item-edition")),
        group: groupId !== "other" ? doc(listGroupsRef, groupId) : null,
    });
    emit("submited");
}
</script>

<template>
    <ModalForm title="Add Edition to List" @submit="addListItem">
        <RefInput field="item-edition" label="Edition" :collection="editions" v-slot="{ doc }">
            {{ doc.title }}
        </RefInput>
        <RefInput
            :initial-value="initialGroup"
            field="item-group"
            label="Group"
            :collection="groups"
        >
            <template #="{ doc }">{{ doc.name }}</template>
            <template #extraOptions> <option value="other">Other</option> </template>
        </RefInput>
    </ModalForm>
</template>
