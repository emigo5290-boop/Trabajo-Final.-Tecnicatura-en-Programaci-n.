import { CONFIG } from "../config.js";
import { fechaLarga } from "./date.js";
export function datosNota(r) {
  const nom = `${r.cliente.nombre} ${r.cliente.apellido}`;
  return {
    titulo: "SOLICITUD DE USO DEL SUM",
    lugarFecha: `${CONFIG.CIUDAD_NOTA}, ${fechaLarga(r.creada)}`,
    destinatario: "A la Administración del Salón de Usos Múltiples:",
    cuerpo: [
      { t: "Por medio de la presente, quien suscribe, " },
      { t: nom, b: 1 },
      { t: ", DNI " },
      { t: r.cliente.dni, b: 1 },
      {
        t: ", solicita la autorización para hacer uso de las instalaciones del Salón de Usos Múltiples de la Municipalidad de Bella Vista el día ",
      },
      { t: fechaLarga(r.fecha), b: 1 },
      { t: ", en el horario comprendido entre las " },
      { t: r.inicio + " hs", b: 1 },
      { t: " y las " },
      { t: r.fin + " hs", b: 1 },
      { t: ", con motivo de realizar " },
      { t: r.actividad, b: 1 },
      { t: "." },
    ],
    observaciones: r.observaciones || "",
    conformidad:
      "Asimismo, manifiesta conocer y aceptar las condiciones establecidas para el uso de las instalaciones.",
    cierre: "Sin otro particular, saluda atentamente.",
    aclaracion: nom,
    dni: r.cliente.dni,
    numero: r.numero,
  };
}
