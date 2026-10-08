# Verificación de la entrega

- `npm test`: 11 pruebas aprobadas.
- `npm run build`: compilación de producción correcta.
- Componentes y plantillas procesados por el compilador oficial de Vue.
- PDF de notas e informes comprobado mediante generación de documentos en las pruebas.
- Revisión visual y recorrido interactivo en navegador: pendientes. El entorno no permitió instalar el navegador de pruebas; no se afirma validación visual ni end-to-end.

## Recorrido manual sugerido

1. Ejecutar `npm ci` y `npm run dev`.
2. Crear una cuenta, copiar el código demo, verificarla e ingresar.
3. Solicitar Vóley o Básquet en una fecha futura, revisar la nota, confirmar y descargar el PDF.
4. Ingresar como administración, aprobar la solicitud y comprobar el calendario.
5. Intentar aprobar otra solicitud superpuesta; debe rechazarse la operación.
6. Generar informes por día, semana y mes; abrir los PDF.
7. Cancelar la reserva y comprobar que se libera el horario.
8. Marcar la cancha fuera de servicio y comprobar el bloqueo del período.
9. Ingresar como Prensa, agregar/editar/eliminar una actividad con flyer y modificar la información pública.
10. Comprobar recuperación de contraseña, recarga de rutas, persistencia y vista móvil.

## Actualización de dependencias (7 de octubre de 2026)

Se actualizó jsPDF a 4.2.1. Después de la actualización: `npm audit` informa 0 vulnerabilidades conocidas; las 11 pruebas y la compilación pasan. Esto no equivale a una auditoría integral de seguridad.
