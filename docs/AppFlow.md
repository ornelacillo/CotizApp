# App Flow --- Aplicación de Presupuestos para Diseñadores Freelance

## Roles de usuario

### Diseñador freelance

Usuario principal de la aplicación. Puede: - Crear presupuestos -
Editarlos - Generarlos - Compartir enlace o descargar PDF -
Duplicarlos - Crear nuevas versiones - Marcar manualmente aceptado o
rechazado - Hacer seguimiento básico

### Cliente

No interactúa con la app como usuario. Solo puede: - Abrir el enlace
público del presupuesto - Ver el documento

No puede: - aceptar - rechazar - editar - responder dentro de la app

------------------------------------------------------------------------

# Estados del presupuesto

-   **Borrador** → presupuesto en edición
-   **Listo** → presupuesto generado y listo para enviar
-   **Enviado** → enlace compartido efectivamente
-   **Descargado** → PDF descargado
-   **Visto** → cliente abrió el enlace
-   **Aceptado** → marcado manualmente por el diseñador
-   **Rechazado** → marcado manualmente por el diseñador
-   **Vencido** → expiró la validez del enlace

------------------------------------------------------------------------

# Registro y acceso

## Opciones de acceso

El diseñador puede:

-   Registrarse con **email y contraseña**
-   Registrarse con **Google**
-   Iniciar sesión con **email**
-   Iniciar sesión con **Google**

## Registro con email

Campos obligatorios: - nombre - apellido - email - contraseña

## Registro con Google

Flujo: 1. Click en "Continuar con Google" 2. Autenticación Google 3.
Selección de cuenta 4. Creación de cuenta 5. Si faltan datos → completar
nombre/apellido 6. Acceso al dashboard

------------------------------------------------------------------------

# Identidad visual del diseñador

Campos configurables:

-   Logo
-   Color principal
-   Tipografía
-   Web
-   Redes sociales

Reglas:

-   Logo formatos permitidos: **PNG, JPEG, SVG**
-   Si no hay logo → se usa **Nombre y Apellido**
-   Si no se define color → color por defecto
-   Si no se define tipografía → tipografía por defecto

Campos obligatorios para generar presupuesto:

-   nombre
-   apellido
-   email

------------------------------------------------------------------------

# Crear presupuesto

## Flujo principal

1.  Dashboard
2.  Nuevo presupuesto
3.  Sistema crea **borrador**
4.  Completar datos del cliente:
    -   nombre
    -   teléfono
    -   email
5.  Completar proyecto:
    -   tipo de proyecto
    -   descripción
6.  Agregar servicios
7.  Definir precio y cantidad
8.  Sistema calcula totales
9.  Vista previa
10. Definir validez
11. Generar presupuesto

Estado cambia:

**Borrador → Listo**

------------------------------------------------------------------------

# Servicios

El diseñador puede:

-   elegir servicios existentes
-   crear **servicios personalizados**

Características:

-   cantidad ilimitada
-   se guardan en la cuenta
-   reutilizables en futuros presupuestos

Campos de servicio personalizado:

-   nombre
-   precio
-   cantidad

Validaciones: - nombre obligatorio - precio válido

------------------------------------------------------------------------

# Compartir presupuesto

## Enlace web

Flujo:

1.  Abrir presupuesto **Listo**
2.  Click en compartir
3.  Generar enlace
4.  Compartir
5.  Confirmar envío

Estado:

**Listo → Enviado**

Si el cliente abre el enlace:

**Enviado → Visto**

------------------------------------------------------------------------

# Descargar PDF

Flujo:

1.  Abrir presupuesto **Listo**
2.  Click en descargar PDF
3.  Sistema genera archivo
4.  Descargar

Estado:

**Listo → Descargado**

Importante:

-   PDF **no permite tracking**
-   no registra apertura
-   no puede vencerse

------------------------------------------------------------------------

# Seguimiento del presupuesto

Datos visibles:

-   fecha creación
-   fecha generación
-   fecha envío
-   fecha apertura
-   número de aperturas
-   fecha vencimiento

Estados visibles:

-   Enviado
-   Visto
-   Descargado
-   Aceptado
-   Rechazado
-   Vencido

------------------------------------------------------------------------

# Marcar resultado

El cliente **no interactúa con la app**.

El diseñador puede marcar manualmente:

-   Aceptado
-   Rechazado

------------------------------------------------------------------------

# Vencimiento

El diseñador define la validez (ej: 15 días).

Cuando vence:

-   estado → **Vencido**
-   el enlace **deja de abrir**
-   aparece pantalla: **Presupuesto vencido**

El PDF no puede vencerse.

------------------------------------------------------------------------

# Duplicar presupuesto

Flujo:

1.  Abrir presupuesto existente
2.  Click en **Duplicar**
3.  Sistema crea copia

Estado:

**Borrador**

Se duplican:

-   servicios
-   precios
-   estructura
-   condiciones

El diseñador cambia:

-   cliente
-   email
-   teléfono
-   detalles

------------------------------------------------------------------------

# Editar presupuesto enviado o descargado

Regla clave:

**Nunca se modifica el presupuesto original**

Flujo:

1.  Abrir presupuesto
2.  Click editar
3.  Sistema crea **nueva versión**
4.  Nueva versión editable
5.  Generar nuevamente

------------------------------------------------------------------------

# Estados intermedios

-   Creando presupuesto
-   Guardando cambios
-   Generando presupuesto
-   Generando enlace
-   Generando PDF
-   Duplicando presupuesto
-   Creando nueva versión
-   Cargando dashboard
-   Cargando presupuesto

------------------------------------------------------------------------

# Error Paths

## Registro

-   email existente
-   contraseña inválida
-   datos incompletos

## Google login

-   cancelación usuario
-   popup bloqueado
-   error autenticación
-   falta nombre/apellido

## Identidad visual

-   formato logo inválido
-   archivo corrupto

## Presupuesto

-   cliente sin nombre
-   email inválido
-   sin servicios
-   total = 0

## Servicios

-   nombre vacío
-   precio inválido

## Documento

-   error generación PDF
-   error generación enlace

## Compartir

-   enlace no generado
-   usuario no confirma envío

## Conectividad

-   pérdida de conexión
-   sesión expirada
-   cierre accidental de pestaña

------------------------------------------------------------------------

# Cliente --- Vista pública

Flujo:

1.  Recibe enlace
2.  Abre enlace
3.  Presupuesto carga
4.  Sistema registra apertura
5.  Diseñador ve estado **Visto**

------------------------------------------------------------------------

# Errores cliente

-   enlace vencido
-   presupuesto no encontrado
-   sin conexión

Pantallas:

-   Presupuesto vencido
-   Presupuesto no encontrado
-   Error conexión

------------------------------------------------------------------------

# Pantallas necesarias

## Acceso

-   Login
-   Registro
-   Google login
-   Recuperar contraseña

## Setup

-   Onboarding identidad
-   Configuración perfil

## Presupuestos

-   Dashboard
-   Lista de presupuestos
-   Crear presupuesto
-   Servicios
-   Resumen
-   Vista previa
-   Compartir
-   Descargar PDF
-   Detalle presupuesto

## Acciones

-   Duplicar
-   Nueva versión
-   Confirmar envío

## Estados

-   Sin presupuestos
-   Sin servicios
-   Sin conexión
-   Error genérico

## Cliente

-   Vista presupuesto
-   Presupuesto vencido
-   Presupuesto no encontrado

------------------------------------------------------------------------

# Flujo maestro del MVP

1 Registro / Login\
2 Onboarding identidad\
3 Dashboard\
4 Nuevo presupuesto o duplicar\
5 Cliente + proyecto\
6 Servicios\
7 Resumen + validez\
8 Generar → **Listo**\
9 Compartir → **Enviado**\
10 Descargar PDF → **Descargado**\
11 Cliente abre enlace → **Visto**\
12 Diseñador marca → **Aceptado / Rechazado**\
13 Expiración → **Vencido**\
14 Edición → **Nueva versión**
