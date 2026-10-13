// Script clasico y sin dependencias: se ejecuta antes de cargar Vue y los estilos.
(() => {
  const key = "sumbv_theme";
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const valid = (value) => value === "light" || value === "dark";
  let preference = "system";
  try {
    const saved = window.localStorage.getItem(key);
    if (valid(saved)) preference = saved;
  } catch {
    /* El tema funciona tambien si el almacenamiento esta bloqueado. */
  }
  function apply() {
    const theme = valid(preference)
      ? preference
      : system.matches
        ? "dark"
        : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.dispatchEvent(new Event("sum-theme-change"));
  }
  window.SUMTheme = {
    get preference() {
      return preference;
    },
    setPreference(value) {
      preference = valid(value) ? value : "system";
      try {
        if (preference === "system") window.localStorage.removeItem(key);
        else window.localStorage.setItem(key, preference);
      } catch {
        /* Conserva la eleccion durante esta visita. */
      }
      apply();
    },
  };
  system.addEventListener("change", () => {
    if (preference === "system") apply();
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== key && event.key !== null) return;
    preference = valid(event.newValue) ? event.newValue : "system";
    apply();
  });
  apply();
})();
