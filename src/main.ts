import "./assets/main.css";

import { createApp } from "vue";
import { VueFire, VueFireAuth } from "vuefire";
import { firebaseApp } from "./firebase";
import { createRouter, createWebHistory } from "vue-router/auto";
import App from "./App.vue";

const app = createApp(App);
const router = createRouter({ history: createWebHistory() });

app.use(router);
app.use(VueFire, { firebaseApp, modules: [VueFireAuth()] });
app.mount("#app");
