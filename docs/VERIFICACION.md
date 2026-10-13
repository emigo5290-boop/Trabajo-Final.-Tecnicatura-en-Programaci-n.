# Verificación de la entrega

## Revisión responsive (13 de octubre de 2026)

- Se revisaron los componentes y estilos antes de editar. Se corrigieron el cálculo global de tamaños, los campos de ancho fijo y los desplazamientos manuales de botones y marcador; las reglas se ajustaron en sus hojas existentes.
- Encabezado: “Ingresar” enlaza a `/login` junto al selector de tema. Con una sesión iniciada se conserva “Ir a mi panel”. El logo y el nombre comparten un enlace a `/`, con nombre accesible y foco visible.
- Chrome con perfil temporal y datos de demostración: 19 rutas × 5 anchos (320, 390, 768, 1024 y 1440 px) × 2 temas = 190 comprobaciones sin desbordes horizontales ni excepciones JavaScript.
- Se inspeccionaron capturas de escritorio y móvil de la vista pública, ingreso, reserva, administración, formularios y diálogos. El calendario cambia a una columna según el espacio disponible en el contenido, incluyendo los paneles con barra lateral.
- 89 comprobaciones adicionales: alineación y destino del acceso, clic sobre logo y nombre, Tab/Enter y foco visible, nombre del enlace en el árbol de accesibilidad, cambio de tema, ingreso como administración, menú móvil, informes, detalle y nota formal, cierre con Escape y retorno del foco, campos de fechas, vista previa de reserva y editor de actividades. Se verificó también el contenido interior de tarjetas y diálogos y los estados de la cancha.
- `npm run build`: correcto.
- `npm test`: 17 de 18 pruebas pasan. La prueba de contraste del tema claro falla en `reservada/reservada-soft` (2,07:1 frente a 4,5:1 requerido). Se reprodujo el mismo fallo con `general.css` de `HEAD`, anterior a estos cambios. La paleta existente se conservó.
- Alcance visual: navegador Chromium con anchos emulados; no se probaron dispositivos físicos ni un lector de pantalla real.

## Entrega inicial

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
