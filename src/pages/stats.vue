<script setup lang="ts">
import { computed } from "vue";
import { useCollection, useCurrentUser } from "vuefire";
import { Timestamp, orderBy, where } from "firebase/firestore";
import { readingsRef, whereUser, type Reading, type Edition } from "@/firebase";
import RequireSignIn from "@/components/RequireSignIn.vue";
import TimelineRead from "@/components/TimelineRead.vue";

const YEAR = 2023;
const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

function month(date: Timestamp, clamp: number) {
    const d = date.toDate();
    return d.getFullYear() === YEAR ? d.getMonth() : clamp;
}

const user = useCurrentUser();
const readings = useCollection<Reading>(
    whereUser(
        readingsRef,
        user.value,
        where("start", "<", Timestamp.fromDate(new Date(YEAR + 1, 0))),
        // firebase doesn't allow having multiple inequalities
        // I wanted to do finish >= Timestamp.fromDate(new Date(2023, 0))
        orderBy("start")
    ),
    { maxRefDepth: 1, ssrKey: "stats" }
);

const editions = computed(() => {
    const reads = readings.value.slice(
        readings.value.findIndex(
            r => r.finish === null || (<Timestamp>r.finish).toDate().getFullYear() === YEAR
        )
    );
    const eds = new Map<string, { months: Set<number>; edition: Edition }>();
    for (const r of reads) {
        let ed = eds.get(r.edition.id);
        if (!ed) {
            ed = { months: new Set(), edition: r.edition };
            eds.set(r.edition.id, ed);
        }
        // TODO: make visually different when starts/ends outside of year
        // TODO: handle when not Date properly
        ed.months.add(month(r.start!, 0));
        ed.months.add(month(<Timestamp>r.finish, 11));
    }
    return eds.values();
});
</script>

<template>
    <RequireSignIn>
        <div class="timeline-chart">
            <div v-for="month in MONTHS" class="month">{{ month }}</div>
            <TimelineRead v-for="e in editions" v-bind="e" />
        </div>
    </RequireSignIn>
</template>

<style scoped>
.timeline-chart {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-auto-flow: dense;
    gap: 0.3rem;
}

.month {
    text-align: center;
}
</style>
