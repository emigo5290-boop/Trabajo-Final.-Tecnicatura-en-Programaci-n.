import { CONFIG } from "../config.js";
import { iso, hh, ahoraLocal, p2 } from "../domain/date.js";
export function seedDemo(DB) {
  if (!CONFIG.MODO_DEMO || DB.read("reservas", null) !== null) return;
  const hoy = new Date(),
    d = (n) => {
      const x = new Date(hoy);
      x.setDate(x.getDate() + n);
      return iso(x);
    };
  const c = (nombre, apellido, dni) => ({
    nombre,
    apellido,
    dni,
    email: "demo@ejemplo.com",
  });
  const mk = (i, cli, fecha, ini, fin, act, obs, est) => ({
    id: "demo" + i,
    userId: "demo",
    cliente: cli,
    fecha,
    inicio: ini,
    fin,
    actividad: act,
    observaciones: obs,
    estado: est,
    creada: ahoraLocal(),
    decidida: est === "pendiente" ? null : ahoraLocal(),
    numero: `SUM-DEMO-${p2(i)}`,
    pdfGenerado: ahoraLocal(),
  });
  const lista = [];
  const hIni = Math.min(
    Math.max(hoy.getHours() + 2, CONFIG.HORA_APERTURA),
    CONFIG.HORA_CIERRE - 2,
  );
  if (hoy.getHours() + 2 <= CONFIG.HORA_CIERRE - 2)
    lista.push(
      mk(
        1,
        c("Laura", "Benítez", "30123456"),
        d(0),
        hh(hIni),
        hh(hIni + 2),
        "Entrenamiento de fútbol sala",
        "",
        "aprobada",
      ),
    );
  lista.push(
    mk(
      2,
      c("Martín", "Sosa", "28456789"),
      d(1),
      "18:00",
      "20:00",
      "Torneo barrial de vóley",
      "Se necesitan 20 sillas.",
      "aprobada",
    ),
  );
  lista.push(
    mk(
      3,
      c("Andrea", "Molina", "27333444"),
      d(3),
      "10:00",
      "12:00",
      "Acto escolar de la escuela N° 214",
      "",
      "aprobada",
    ),
  );
  lista.push(
    mk(
      4,
      c("Carolina", "Ruiz", "33987654"),
      d(4),
      "20:00",
      "22:00",
      "Práctica de básquet",
      "Grupo de 12 personas.",
      "pendiente",
    ),
  );
  lista.push(
    mk(
      5,
      c("Julián", "Paz", "35222111"),
      d(6),
      "15:00",
      "17:00",
      "Cumpleaños infantil",
      "",
      "pendiente",
    ),
  );
  DB.write("reservas", lista);
}
