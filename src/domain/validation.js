import { norm } from "./date.js";
export function passwordErrors(clave = "", clave2 = "") {
  if (clave.length < 8 || !/[A-Za-z]/.test(clave) || !/\d/.test(clave))
    return { clave: "Usá al menos 8 caracteres, con letras y números." };
  return clave !== clave2 ? { clave2: "Las contraseñas no coinciden." } : {};
}
export function registrationErrors(d, users) {
  const e = passwordErrors(d.clave, d.clave2),
    name = /^[\p{L}][\p{L}'’\- ]{1,49}$/u;
  for (const k of ["nombre", "apellido"])
    if (!name.test((d[k] || "").trim())) e[k] = "Ingresá al menos 2 letras.";
  if (!/^\d{7,8}$/.test(d.dni || ""))
    e.dni = "El DNI debe tener 7 u 8 números.";
  if (!/^\d{11}$/.test(d.cuil || "")) e.cuil = "El CUIL debe tener 11 números.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email || ""))
    e.email = "Ingresá un correo válido.";
  for (const k of ["dni", "cuil", "email"])
    if (users.some((u) => norm(u[k]) === norm(d[k])))
      e[k] = "Ya existe una cuenta con este dato.";
  return e;
}
export function assertValid(errors) {
  if (Object.keys(errors).length) {
    const err = new Error("Revisá los campos indicados.");
    err.fields = errors;
    throw err;
  }
}
