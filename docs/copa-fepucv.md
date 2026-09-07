# Copa FEPUCV

Minijuego arcade en `/minijuegos`. Seis integrantes seleccionables, cinco duelos contra el resto de la mesa, tres vidas y 60 segundos por partido. Cada victoria desbloquea el siguiente rival; empates y derrotas consumen una vida. La dificultad aumenta mediante velocidad, anticipación, salto y frecuencia/potencia de remate.

## Puntajes y avance

- Solo las victorias suman: 100 por gol + 500 por nivel superado + 250 con arco invicto.
- Completar los cinco duelos agrega 2.000 puntos.
- Reintentar no permite acumular puntos de partidos perdidos o empatados.
- El avance se guarda al terminar cada duelo. Recargar o salir de un partido lo reinicia y conserva los anteriores.
- **Reiniciar campaña** está en el vestuario y la pausa; pide confirmación, restaura tres vidas, vacía el puntaje y conserva los récords. También permite cambiar de personaje desde el vestuario.
- Las claves locales tienen prefijo `fepucv.copa` y versión. Datos corruptos o almacenamiento bloqueado no impiden jugar; en ese caso se informa que el avance no persistirá.

## Ranking compartido

Aplicar `supabase/migrations/202609070001_copa_fepucv.sql` en el proyecto de Supabase destinado al juego. La migración es transaccional e idempotente. El cliente incluye la URL y la clave **publicable** del proyecto Fepucv (`kvelueguheafshtntehu`) creado en la organización gratuita FEPUCV. Así el mismo ranking funciona al publicar sin copiar secretos ni depender de la configuración antigua del portal. Para cambiar de proyecto se pueden definir estas variables en `.env.local` y en Vercel:

```dotenv
VITE_COPA_SUPABASE_URL=https://PROJECT_ID.supabase.co
VITE_COPA_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Ambos valores deben pertenecer al mismo proyecto. La clave publicable está destinada al navegador; la protección real está en los permisos de la base de datos. Nunca usar `service_role`, claves secretas o contraseñas en variables `VITE_*`. Reiniciar Vite/recompilar después de cambiar variables. Las variables genéricas `VITE_SUPABASE_*` del portal no se utilizan para el minijuego.

La aplicación llama a `copa_top3` y `copa_submit` mediante REST. Las tablas tienen RLS y carecen de acceso directo público; las funciones definen `search_path` vacío y exponen únicamente las operaciones del juego. El servidor recalcula los puntos, valida campañas completas, evita reenvíos del mismo identificador y conserva la mejor marca por apodo, ignorando mayúsculas. Los desempates favorecen más duelos ganados y luego la marca más antigua.

La interfaz distingue el ranking global del local; un error de red nunca se presenta como publicación exitosa. El respaldo local muestra sus propios tres mejores puntajes y permite reintentar la publicación. Una marca de cero puntos no ingresa al ranking.

Los apodos se eligen entre combinaciones de un catálogo cerrado (animal + cualidad + número de tres dígitos), por ejemplo **Cóndor Audaz 482**. No hay campo de texto libre. `nicknames.ts` genera tres opciones y la persona puede pedir otras. La función de Supabase valida exactamente el mismo vocabulario, incluso ante llamadas directas a la API. El catálogo ofrece 90.000 combinaciones; los apodos no son cuentas verificadas.

Este es un ranking recreativo por apodo, sin cuentas de jugadores: los apodos no acreditan identidad. Aunque el servidor valida y recalcula resultados, la simulación corre en el cliente; no constituye un sistema antitrampas ni sirve para premios competitivos. Antes de ampliar ese alcance se necesita simulación o verificación autoritativa y limitación de tráfico en el servidor.

Documentación de referencia: [funciones de base de datos](https://supabase.com/docs/guides/database/functions) y [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Controles y motor

Flechas o A/D para moverse, arriba o W para saltar, espacio/Enter para patear y P/Esc para pausar. Los botones en pantalla admiten captura y cancelación de punteros. Por decisión del usuario, los teléfonos muestran un aviso de incompatibilidad y no cargan el motor (ancho menor a 768 px o dispositivo táctil en horizontal de hasta 540 px de alto). Cambiar de pestaña o perder el foco pausa el juego. La física avanza a 60 pasos por segundo independientemente de la frecuencia de pantalla; el reloj usa esos mismos pasos.

## Arte

Imágenes creadas con la herramienta integrada de generación de imágenes a partir de las seis fotos existentes en `public/img/mesa`. Los originales institucionales no se modificaron. `plantel-a.png` y `plantel-b.png` conservan los retratos iniciales de referencia. La versión final usa `cabezas-a.png` y `cabezas-b.png`, atlas RGBA con tres celdas de 384 × 384 cada uno, tanto en las cartas como en el juego. En cancha solo se muestran una cabeza por su silueta y un botín vectorial animado, según la referencia aportada por el usuario.

Prompt base de cartas: “Three-column, one-row portrait atlas, exact equal square cells, same order as the reference photos; recognizable faces, polished cartoon sports game art, oversized expressive heads, crisp dark contours, mint jerseys and navy collars, uniform navy background, no text.” Orden A: Francesca, Krishna, Mirko. Orden B: Romina, Sofía, Vincent.

Prompt de cabezas: “Only three floating heads, preserve identities, facial features, glasses and expressions. Remove shoulders, jerseys, torsos, necks and background. End each silhouette below the chin, adapt long hair to compact head silhouette. Crisp dark contour following hair, ears and chin; no circle, badge or square. Equal cells with transparent padding, no feet or text.”

El generador entregó un damero opaco. Con autorización explícita del usuario, `scripts/prepare_heads.py` eliminó el fondo claro conectado a los bordes, conservó los detalles interiores y normalizó los sprites. No aplicar ese script a fotografías arbitrarias. Los botines y el estadio son gráficos SVG originales del proyecto.

## Verificación

`npm run build` verifica TypeScript y producción. `npm run test:game` requiere Node 22.6+ (verificado con Node 24) y cubre progreso, vidas, puntajes, duplicados, persistencia corrupta/bloqueada, goles, rebotes y fin de partido.

`supabase/tests/copa.sql` comprueba la base de datos dentro de una transacción que termina con ROLLBACK; no conserva registros de prueba.
