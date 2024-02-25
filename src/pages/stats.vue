<script setup lang="ts">
import { computed, ref } from "vue";
import { useCollection, useCurrentUser } from "vuefire";
import VueDatePicker from "@vuepic/vue-datepicker";
import { Timestamp, getDocs, orderBy, where } from "firebase/firestore";
import { readingsRef, whereUser, type Reading, type Edition, type Datey } from "@/firebase";
import RequireSignIn from "@/components/RequireSignIn.vue";
import TimelineRead from "@/components/TimelineRead.vue";

interface EditionRead {
    months: Set<number>;
    edition: Edition;
}

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

const year = ref(new Date().getFullYear());

function addMonth(ed: EditionRead, read: Datey, clamp: number) {
    if (read === null) ed.months.add(clamp);
    else if (typeof read !== "number") {
        const d = read.toDate();
        ed.months.add(d.getFullYear() === year.value ? d.getMonth() : clamp);
    }
}

const user = useCurrentUser();

const readRef = computed(() =>
    whereUser(
        readingsRef,
        user.value,
        where("start", "<", Timestamp.fromDate(new Date(year.value + 1, 0))),
        // firebase doesn't allow having multiple inequalities
        // I wanted to do finish >= Timestamp.fromDate(new Date(2023, 0))
        orderBy("start")
    )
);

const readings = useCollection<Reading>(readRef, { maxRefDepth: 1, ssrKey: "stats" });

const editions = computed(() => {
    const reads = readings.value.slice(
        readings.value.findIndex(
            r => r.finish === null || (<Timestamp>r.finish).toDate().getFullYear() === year.value
        )
    );
    const eds = new Map<string, EditionRead>();
    for (const r of reads) {
        let ed = eds.get(r.edition.id);
        if (!ed) {
            ed = { months: new Set(), edition: r.edition };
            eds.set(r.edition.id, ed);
        }
        // TODO: make visually different when starts/ends outside of year
        addMonth(ed, r.start, 0);
        addMonth(
            ed,
            r.finish,
            year.value === new Date().getFullYear() ? new Date().getMonth() : 11
        );
    }
    return eds.values();
});
</script>

<template>
    <RequireSignIn>
        <div class="container">
            <div class="year">
                <label for="year">Year</label>
                <VueDatePicker :year-picker="true" v-model="year" :clearable="false" />
            </div>
            <div class="timeline-chart">
                <div v-for="month in MONTHS" class="month">{{ month }}</div>
                <TimelineRead v-for="e in editions" v-bind="e" />
            </div>
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

.year {
    max-width: 15rem;
    margin-bottom: 2rem;
}
</style>
