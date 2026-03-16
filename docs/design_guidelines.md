# DESIGN GUIDELINES - Cotiza

## PALETA DE COLORES

**Colores principales:**

-   Primario: #4A35E9 --- Uso: botones principales (CTAs), highlights,
    precios, navegación activa.
-   Secundario: #6B5CFF --- Uso: gradientes de botones, iconos
    destacados.
-   Acento: #8B7BFF --- Uso: enlaces, elementos destacados,
    micro‑interacciones.

**Colores de fondo:**

-   Fondo principal: #0F0B1F --- Background general de la app (modo
    oscuro).
-   Fondo secundario: #171332 --- Cards y contenedores.
-   Fondo terciario: #1E1A3F --- Cards elevadas o listas.

**Colores de texto:**

-   Texto principal: #FFFFFF
-   Texto secundario: #9AA0B4
-   Texto sobre primario: #FFFFFF

**Colores de estado:**

-   Éxito: #22C55E
-   Error: #EF4444
-   Warning: #F59E0B
-   Info: #4A35E9

------------------------------------------------------------------------

## TIPOGRAFÍAS

**Fuente principal:** Inter (Sans Serif)

### Títulos principales (H1)

-   Fuente: Inter
-   Tamaño: 28--32px
-   Peso: Bold (700)
-   Uso: títulos de pantalla y encabezados principales.

Ejemplos: - Crear cuenta - Cotiza - Clientes - Presupuestos

------------------------------------------------------------------------

### Subtítulos (H2)

-   Fuente: Inter
-   Tamaño: 20--22px
-   Peso: Semibold (600)
-   Uso: encabezados de sección y títulos de cards.

Ejemplos: - Datos del cliente - Servicios - Presupuestos recientes

------------------------------------------------------------------------

### Body / Texto principal

-   Fuente: Inter
-   Tamaño: 14--16px
-   Peso: Regular (400)
-   Uso: descripciones, formularios, textos secundarios.

------------------------------------------------------------------------

### Texto de botones

-   Fuente: Inter
-   Tamaño: 15--16px
-   Peso: Semibold (600)
-   Transformación: normal (no uppercase)

Ejemplos: - Crear presupuesto - Guardar borrador - Continuar con
Google - Agregar cliente

------------------------------------------------------------------------

## COMPONENTES PRINCIPALES

### Botón Primario (CTA)

Estilo:

-   Fondo: gradiente #4A35E9 → #6B5CFF
-   Texto: #FFFFFF
-   Altura: 48--52px
-   Padding horizontal: 20--24px
-   Border-radius: 14--16px
-   Sombra: glow violeta suave

Uso:

-   Crear presupuesto
-   Iniciar sesión
-   Guardar
-   Copiar enlace

------------------------------------------------------------------------

### Botón Secundario

Estilo:

-   Fondo: transparente
-   Borde: 1px solid #4A35E9
-   Texto: #4A35E9
-   Border-radius: 14px
-   Altura: 48px

Uso: acciones secundarias.

------------------------------------------------------------------------

### Botón flotante (FAB)

Estilo:

-   Fondo: #4A35E9
-   Icono: blanco
-   Tamaño: 56px
-   Border-radius: 50%
-   Sombra: glow violeta

Uso:

-   Crear presupuesto
-   Agregar cliente

------------------------------------------------------------------------

## CARDS

Estilo general:

-   Fondo: #171332
-   Border-radius: 16--20px
-   Borde: none
-   Sombra: muy sutil

Uso:

-   presupuestos
-   clientes
-   servicios
-   métricas

------------------------------------------------------------------------

### Cards de métricas

Elementos:

-   icono
-   número destacado
-   descripción
-   indicador

Ejemplos:

-   Enviados
-   Vistos
-   Aceptados
-   Rechazados

------------------------------------------------------------------------

## INPUTS / FORMULARIOS

Estilo:

-   Fondo: #171332
-   Borde: 1px solid #2A2550
-   Placeholder: #7A8099
-   Texto: #FFFFFF

Propiedades:

-   Altura: 48px
-   Padding horizontal: 16px
-   Border-radius: 14px

Estado focus:

-   Borde: #4A35E9

------------------------------------------------------------------------

## ICONOS

Estilo:

-   Tipo: line / minimal filled
-   Inspiración: Lucide o Heroicons

Tamaños:

-   20px
-   24px

Colores:

-   Default: #9AA0B4
-   Activo: #4A35E9

------------------------------------------------------------------------

## NAVEGACIÓN

### Bottom Navigation

Elementos:

-   Inicio
-   Cotizaciones
-   Clientes
-   Servicios
-   Ajustes

Estilo:

-   Fondo: #0F0B1F
-   Iconos: #9AA0B4
-   Icono activo: #4A35E9
-   Tamaño iconos: 22px

------------------------------------------------------------------------

## ESPACIADO

Sistema de spacing:

-   XS: 4px
-   SM: 8px
-   MD: 16px
-   LG: 24px
-   XL: 32px

Uso:

-   Padding cards: 20--24px
-   Separación secciones: 24--32px

------------------------------------------------------------------------

## BORDES

Valores detectados:

-   Inputs: 14px
-   Botones: 14--16px
-   Cards: 18--20px
-   FAB: 50%

------------------------------------------------------------------------

## SOMBRAS

Sombra utilizada:

box-shadow: 0 8px 24px rgba(74,53,233,0.15)

Aplicado en:

-   botones primarios
-   FAB
-   cards activas

------------------------------------------------------------------------

## ICONOGRAFÍA DE ESTADOS

Estados visuales:

-   Aceptado → verde
-   Rechazado → rojo
-   Visto → naranja
-   Enviado → violeta

------------------------------------------------------------------------

## ESTILO VISUAL GENERAL

El sistema sigue un estilo **Dark SaaS Dashboard**.

Características:

-   Dark mode por defecto
-   Gradientes violetas
-   Cards suaves
-   Bordes redondeados
-   Iconografía minimalista
-   Tipografía limpia

Inspiración visual cercana a:

-   Linear
-   Vercel
-   Stripe dashboards
-   Wise

------------------------------------------------------------------------

## USO DEL DOCUMENTO

Este documento debe utilizarse para:

-   Generación de UI en código
-   Prompts para IA de frontend
-   Mantener consistencia en nuevas pantallas
-   Documentar el design system del producto
