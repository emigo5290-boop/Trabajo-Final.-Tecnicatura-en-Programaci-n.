import { validDate } from "../domain/availability.js";
import { passwordErrors, assertValid } from "../domain/validation.js";
import { preparePublication } from "../domain/publications.js";
export function createContentService({ repository, session, password }) {
  function allow(role) {
    if (session()?.rol !== role)
      throw Error("No tenés permiso para esta operación.");
  }
  return {
    saveCourt(c) {
      allow("admin");
      if (
        !["disponible", "ocupada", "reservada", "fuera_de_servicio"].includes(
          c.estado,
        )
      )
        throw Error("Estado inválido.");
      if (
        c.estado === "fuera_de_servicio" &&
        (!c.motivo.trim() ||
          !validDate(c.desde) ||
          (c.hasta && (!validDate(c.hasta) || c.hasta < c.desde)))
      )
        throw Error("Indicá un motivo y un período válido.");
      repository.write(
        "cancha",
        c.estado === "fuera_de_servicio"
          ? { ...c }
          : { estado: c.estado, motivo: "", desde: "", hasta: "" },
      );
    },
    async savePress(d) {
      allow("admin");
      assertValid(passwordErrors(d.clave, d.clave2));
      if (!d.usuario.trim()) throw Error("Indicá el usuario.");
      repository.write("prensa", {
        usuario: d.usuario.trim(),
        passHash: await password.hash(d.clave),
      });
    },
    saveInfo(d) {
      allow("prensa");
      if (!d.direccion.trim() || !d.horario.trim())
        throw Error("Completá la dirección y los horarios.");
      repository.write("info", { ...d });
    },
    saveActivity(d) {
      allow("prensa");
      const publication = preparePublication(d);
      const records = repository.read("actividades", []),
        record = { ...publication, id: d.id || crypto.randomUUID() };
      repository.write("actividades", [
        ...records.filter((a) => a.id !== record.id),
        record,
      ]);
    },
    removeActivity(id) {
      allow("prensa");
      repository.write(
        "actividades",
        repository.read("actividades", []).filter((a) => a.id !== id),
      );
    },
  };
}
