<script setup lang="ts">
import { VueFinalModal } from "vue-final-modal";
import { useCollection, useCurrentUser } from "vuefire";
import { addDoc, doc, orderBy, query, where } from "firebase/firestore";
import { computed } from "vue";
import UserForm from "@/components/UserForm.vue";
import RefInput from "./RefInput.vue";
import {
    listGroupsRef,
    type ListGroup,
    type ListItem,
    listItemsRef,
    type Edition,
    editionsRef,
} from "@/firebase";
import { inputValue } from "@/utils";

const { initialGroup } = defineProps<{ initialGroup: string }>();
const emit = defineEmits<{ submited: [] }>();

const user = useCurrentUser();
const whereUser = where("uploader", "==", user.value!.uid);
const groups = useCollection<ListGroup>(query(listGroupsRef, whereUser, orderBy("order")));

const listItems = useCollection<ListItem>(query(listItemsRef, whereUser));
const userEditionIds = computed(() => listItems.value.map(l => l.edition.id));
const allEditions = useCollection<Edition>(editionsRef);
const editions = computed(() =>
    allEditions.value.filter(e => !userEditionIds.value.includes(e.id))
);

async function addListItem(_: Event, uploader: string) {
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
    <VueFinalModal class="container" content-class="modal">
        <UserForm title="Add Edition to List" @submit="addListItem">
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
        </UserForm>
    </VueFinalModal>
</template>

<style>
.modal {
    background-color: aliceblue;
    padding: 3em;
    border-radius: 0.35rem;
    box-shadow: 0 0 1em;
}
</style>
