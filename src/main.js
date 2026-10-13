import { createApp } from "vue";
import App from "./App.vue";
import { AppKey, createApplication } from "./application/context.js";
import { createStorage, browserStorage } from "./infrastructure/storage.js";
import { hashPassword, matchesPassword } from "./infrastructure/password.js";
import { seedDemo } from "./infrastructure/seed.js";
import { createPdfService } from "./infrastructure/pdf.js";
import { readFlyer } from "./infrastructure/flyer.js";
import { createAppRouter } from "./router/index.js";
const storage = createStorage(browserStorage("localStorage"));
seedDemo(storage);
const services = createApplication({
  storage,
  temp: createStorage(browserStorage("sessionStorage"), "sumbv_vue_"),
  password: { hash: hashPassword, matches: matchesPassword },
  pdf: createPdfService(),
  flyer: readFlyer,
});
services.refresh();
const router = createAppRouter(services);
createApp(App).provide(AppKey, services).use(router).mount("#app");
