export function legacyHash(txt) {
  let h = 5381;
  for (const ch of "sumbv|" + txt) h = ((h << 5) + h + ch.charCodeAt(0)) | 0;
  return "x" + h;
}
export async function hashPassword(txt) {
  if (!globalThis.crypto?.subtle)
    throw Error(
      "Abrí la aplicación en localhost o HTTPS para usar contraseñas.",
    );
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode("sumbv|" + txt),
  );
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
export async function matchesPassword(txt, hash) {
  return hash?.startsWith("x")
    ? legacyHash(txt) === hash
    : (await hashPassword(txt)) === hash;
}
