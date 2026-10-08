/** Puerto mínimo: read(key, fallback), write(key, value). Comparte las claves del original. */
export function createStorage(storage, prefix = "sumbv_") {
  const memory = new Map();
  return {
    read(key, fallback) {
      try {
        const raw = memory.has(key)
          ? memory.get(key)
          : storage?.getItem(prefix + key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    write(key, value) {
      const raw = JSON.stringify(value);
      try {
        if (!storage) throw Error();
        storage.setItem(prefix + key, raw);
        memory.delete(key);
        return true;
      } catch {
        memory.set(key, raw);
        return false;
      }
    },
  };
}
export function browserStorage(name) {
  try {
    return window[name];
  } catch {
    return null;
  }
}
