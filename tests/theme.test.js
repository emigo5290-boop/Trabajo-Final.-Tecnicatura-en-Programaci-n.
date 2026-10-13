import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const bootstrap = readFileSync(
  new URL("../public/theme.js", import.meta.url),
  "utf8",
);
function browser({ saved = null, dark = false, blocked = false } = {}) {
  const data = new Map(saved === null ? [] : [["sumbv_theme", saved]]);
  const window = new EventTarget();
  const system = new EventTarget();
  system.matches = dark;
  window.matchMedia = () => system;
  window.localStorage = {
    getItem(key) {
      if (blocked) throw Error("blocked");
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      if (blocked) throw Error("blocked");
      data.set(key, value);
    },
    removeItem(key) {
      if (blocked) throw Error("blocked");
      data.delete(key);
    },
  };
  const document = { documentElement: { dataset: {}, style: {} } };
  vm.runInNewContext(bootstrap, { window, document, Event });
  return { window, system, data, root: document.documentElement };
}

test("theme bootstrap runs synchronously in the head before the application", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const script = html.indexOf('<script src="/theme.js"></script>');
  assert.ok(script > 0 && script < html.indexOf("</head>"));
  assert.ok(script < html.indexOf('rel="stylesheet"'));
});
test("initial theme uses a valid saved preference before the OS setting", () => {
  for (const dark of [false, true]) {
    for (const saved of [null, "invalid", "light", "dark"]) {
      const b = browser({ saved, dark });
      const expected = ["light", "dark"].includes(saved)
        ? saved
        : dark
          ? "dark"
          : "light";
      assert.equal(b.root.dataset.theme, expected);
      assert.equal(b.root.style.colorScheme, expected);
    }
  }
});
test("selection persists, reload restores it, and System resumes live OS changes", () => {
  const b = browser({ dark: true });
  b.window.SUMTheme.setPreference("light");
  assert.equal(b.data.get("sumbv_theme"), "light");
  assert.equal(
    browser({ saved: b.data.get("sumbv_theme"), dark: true }).root.dataset
      .theme,
    "light",
  );
  b.system.dispatchEvent(new Event("change"));
  assert.equal(b.root.dataset.theme, "light");
  b.window.SUMTheme.setPreference("system");
  assert.equal(b.data.has("sumbv_theme"), false);
  assert.equal(b.root.dataset.theme, "dark");
  b.system.matches = false;
  b.system.dispatchEvent(new Event("change"));
  assert.equal(b.root.dataset.theme, "light");
});
test("blocked storage still supports initial OS theme and manual selection", () => {
  const b = browser({ dark: true, blocked: true });
  assert.equal(b.root.dataset.theme, "dark");
  b.window.SUMTheme.setPreference("light");
  assert.equal(b.root.dataset.theme, "light");
});
test("other tabs update the theme; unrelated storage keys are ignored", () => {
  const b = browser({ saved: "light", dark: true });
  const storage = (key, newValue) => {
    const event = new Event("storage");
    Object.assign(event, { key, newValue });
    b.window.dispatchEvent(event);
  };
  storage("sumbv_reservas", null);
  assert.equal(b.root.dataset.theme, "light");
  storage("sumbv_theme", "dark");
  assert.equal(b.root.dataset.theme, "dark");
  storage("sumbv_theme", "light");
  storage(null, null);
  assert.equal(b.window.SUMTheme.preference, "system");
  assert.equal(b.root.dataset.theme, "dark");
});

const css = readFileSync(
  new URL("../src/styles/general.css", import.meta.url),
  "utf8",
);
const blocks = [
  ...css.matchAll(/:root(?:\[data-theme="dark"\])?\s*\{([^}]+)\}/g),
].map((m) =>
  Object.fromEntries(
    [...m[1].matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((x) => [
      x[1],
      x[2].trim(),
    ]),
  ),
);
function luminance(hex) {
  return hex
    .slice(1)
    .match(/../g)
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
}
function contrast(a, b) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
for (const [i, theme] of ["light", "dark"].entries()) {
  test(`${theme}: text, states, buttons, controls and focus meet contrast targets`, () => {
    const tokens = { ...blocks[0], ...(i ? blocks[1] : {}) };
    const value = (key) =>
      tokens[key].startsWith("var(")
        ? value(tokens[key].slice(4, -1))
        : tokens[key];
    const pairs = [];
    for (const surface of [
      "bg",
      "panel",
      "panel-2",
      "brand-soft",
      "libre-soft",
      "reservada-soft",
      "ocupada-soft",
      "fuera-soft",
      "bloq-soft",
    ])
      for (const ink of ["ink", "ink-2"]) pairs.push([ink, surface, 4.5]);
    for (const state of ["libre", "reservada", "ocupada", "fuera", "bloq"])
      pairs.push([state, state + "-soft", 4.5]);
    pairs.push(
      ["brand", "panel", 4.5],
      ["brand", "brand-soft", 4.5],
      ["brand-ink", "brand", 4.5],
      ["brand-ink", "brand-hover", 4.5],
      ["peligro-ink", "peligro", 4.5],
      ["peligro-ink", "peligro-hover", 4.5],
      ["peligro", "panel", 4.5],
      ["disabled-ink", "disabled-bg", 4.5],
      ["score-muted", "score-bg", 4.5],
      ["score-note", "score-bg", 4.5],
    );
    for (const state of ["libre", "reservada", "ocupada", "fuera"])
      pairs.push(["score-" + state, "score-bg", 4.5]);
    for (const surface of ["bg", "panel", "panel-2", "brand-soft"])
      for (const indicator of ["control-line", "focus"])
        pairs.push([indicator, surface, 3]);
    pairs.push(["selected-dot", "brand", 3]);
    for (const [a, b, minimum] of pairs) {
      const ratio = contrast(value("--" + a), value("--" + b));
      assert.ok(
        ratio >= minimum,
        `${theme}: ${a}/${b} = ${ratio.toFixed(2)}, requires ${minimum}`,
      );
    }
    assert.notEqual(value("--panel").toLowerCase(), "#ffffff");
  });
}
