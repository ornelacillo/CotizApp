
# PRD — App de Presupuestos para Diseñadores Freelance

## 1. Objetivo del producto

Permitir que **diseñadores freelance** puedan:
- calcular precios sugeridos basados en tarifarios profesionales del sector
- generar presupuestos profesionales en pocos minutos
- enviarlos fácilmente a clientes
- realizar un seguimiento básico de visualización

La aplicación ofrece precios sugeridos basados en tarifarios del sector, pero **el diseñador siempre mantiene control total sobre el precio final**.

### Resultado esperado
Reducir el tiempo necesario para generar un presupuesto de **30–40 minutos a menos de 5 minutos**.

### Tiempos operativos
- Completar presupuesto: **máximo 3 minutos**
- Generación del documento: **máximo 1 minuto**

### Usuario principal
Diseñadores freelance que necesitan generar presupuestos rápidamente y no tienen referencias claras de precios.

#### Segmento prioritario
Diseñadores freelance con **0–3 años de experiencia**.

#### Usuarios secundarios
- diseñadores semi senior
- diseñadores senior
- pequeños estudios

---

# 2. Funcionalidades CORE

## CORE 1 — Crear presupuesto

### Datos del cliente
- nombre *(obligatorio)*
- email *(obligatorio)*
- teléfono *(obligatorio)*
- empresa *(opcional)*

### Datos del proyecto
- tipo de proyecto *(obligatorio)*
- descripción *(obligligatorio)*
- alcance *(opcional)*
- urgencia *(opcional)*

### Validaciones
- email válido
- al menos **1 servicio**
- total **no puede ser $0**

### Comportamiento
- guardado automático
- borrador
- recuperación ante pérdida de conexión
- edición antes de enviar

---

## CORE 2 — Cálculo de precio sugerido

### Fuentes
- ARDG Rosario
- ADG Córdoba
- Cámara de Diseñadores de Rafaela

### Valor sugerido
Se usa como base el tarifario de **Rafaela**.

### Rango
- mínimo = menor valor entre fuentes
- máximo = mayor valor entre fuentes

### Ajustes
- experiencia del diseñador
- tipo de cliente
- urgencia
- alcance
- cantidad
- complejidad

### Edición
El diseñador puede modificar el precio **sin límite**.

---

## CORE 3 — Checklist de servicios

### Métodos
- checklist por categorías
- buscador

### Categorías
- identidad / branding
- web
- editorial
- publicitario
- ilustración
- infografía
- promocionales
- packaging
- redes sociales
- señalética
- video
- volumétrico

### Servicio
Cada servicio tiene:
- precio unitario
- cantidad
- subtotal

### Servicios personalizados
Campos:
- nombre
- descripción
- precio
- cantidad

---

## CORE 4 — Generación del documento

### Formatos
- enlace web
- PDF

### Personalización
- logo
- colores
- tipografía
- nombre del estudio
- web
- email
- redes

### Tipografías
- Inter
- Helvetica
- Montserrat

### Contenido
- datos del diseñador
- datos del cliente
- proyecto
- servicios
- total
- condiciones
- validez

### Validez
Predeterminado: **15 días**

---

## CORE 5 — Envío y seguimiento

### Envío
- copiar enlace
- WhatsApp
- email
- descargar PDF

### Estados
- borrador
- enviado
- visto
- aceptado
- rechazado

### Tracking
Se marca **visto** cuando el cliente abre el enlace.

### Panel
- fecha de envío
- fecha de visualización
- veces visto

### Recordatorio
Si no se abre en **3 días**, se envía notificación al diseñador.

---

# 3. Funcionalidades secundarias (v2)

- firma digital
- CRM
- analítica
- pagos
- historial de negociación

---

# 4. Reglas de negocio

- moneda: **pesos argentinos**
- precio sugerido **no obligatorio**
- diseñador controla precio final
- usar última versión válida de tarifarios

---

# 5. Casos límite

- no hay coincidencia → usar equivalencia admin
- tarifario falla → usar último guardado
- precio muy distinto → advertencia
- PDF abierto → no se puede trackear
- pérdida conexión → recuperar borrador

---

# 6. Métricas de éxito

- crear presupuesto **< 5 min**
- presupuestos enviados **> 70%**
- presupuestos abiertos **> 60%**
- envío en **< 10 min**
- uso recurrente **≥ 3 presupuestos/mes**
