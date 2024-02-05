import "./assets/main.css";
import "vue-final-modal/style.css";

import { createApp } from "vue";
import { VueFire, VueFireAuth } from "vuefire";
import { createRouter, createWebHistory } from "vue-router/auto";
import { createVfm } from "vue-final-modal";
import { firebaseApp } from "./firebase";
import App from "./App.vue";

const app = createApp(App);
const router = createRouter({ history: createWebHistory() });

app.use(router);
app.use(VueFire, { firebaseApp, modules: [VueFireAuth()] });
app.use(createVfm());
app.mount("#app");
