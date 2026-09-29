# SENTINEL — Sistema de Alarma para Paquetes

Versión funcional para GitHub Pages.

## Funciones
- ARMAR y DESARMAR el sistema.
- Botón SIMULAR ROBO.
- Secuencia automática:
  1. llega el repartidor,
  2. deja el paquete,
  3. se detecta al intruso,
  4. toma el paquete,
  5. sale hacia la calle,
  6. se activa la alarma.
- Sirena mediante Web Audio del navegador.
- Registro de eventos.
- Cambio real de cámara seleccionada.
- Mapa con movimiento del intruso.
- Reinicio de la escena.
- Notificaciones.

## Importante sobre el sonido
El navegador bloquea audio automático en páginas sin interacción. Por eso la sirena se inicia después de pulsar **SIMULAR ROBO** o **INICIAR SECUENCIA DE ROBO**, que es una acción del usuario.

## GitHub Pages
Sube `index.html`, `styles.css`, `script.js` y `assets/` al repositorio.
Luego: Settings → Pages → Deploy from a branch → main → / (root) → Save.
