# Arquitectura Técnica — App de Presupuestos para Diseñadores Freelance

## 1. RESUMEN DE LA ARQUITECTURA

La aplicación se implementa como una **web app responsive con enfoque mobile-first y soporte PWA**, compuesta por una **interfaz autenticada para el diseñador** y una **vista pública read-only para el cliente**. La arquitectura recomendada es **Next.js + TypeScript + Supabase (Auth, PostgreSQL, Storage, Realtime)**, con lógica asíncrona desacoplada para recordatorios, expiraciones y sincronización de tarifarios.

La solución prioriza simplicidad de desarrollo, velocidad de iteración y bajo overhead operativo, manteniendo dentro del núcleo del sistema: creación de presupuestos, cálculo sugerido, generación de enlace/PDF, tracking de apertura, versionado y seguimiento básico.

---

## 2. FRONTEND

### Tipo de aplicación
- **Web responsive**
- **PWA** para acceso rápido desde notebook y móvil
- **No app móvil nativa en MVP**
- **No desktop app**

### Interfaces necesarias

#### A. App del diseñador (autenticada)
Incluye:
- registro / login con email
- login con Google
- onboarding de identidad visual
- dashboard
- lista de presupuestos
- creación y edición de borradores
- selección de servicios
- resumen, vista previa y generación
- compartir enlace
- descarga PDF
- seguimiento de estados
- duplicación de presupuestos
- creación de nuevas versiones
- configuración de perfil

#### B. Vista pública del presupuesto (sin autenticación)
Incluye:
- visualización del presupuesto compartido por enlace
- validación de vigencia
- pantalla de presupuesto vencido
- pantalla de presupuesto no encontrado
- pantalla de error de conexión

### Cantidad de interfaces
- **2 superficies de producto**
  1. Panel del diseñador
  2. Vista pública del cliente

> No se recomienda un panel admin dedicado en el MVP. La administración operativa puede resolverse con herramientas internas de base de datos/hosting.

### Tech stack sugerido
- **Next.js 15**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **React Hook Form + Zod** para formularios y validaciones
- **TanStack Query** para fetching y cache cliente
- **next-pwa** para capacidades PWA

### Decisiones de frontend
- Mobile-first por el patrón de uso rápido del diseñador.
- SSR/ISR para la vista pública del presupuesto.
- Client-side interactions para builder, autosave y edición.
- Estados visuales consistentes con el design system ya definido.

---

## 3. BACKEND

### Tipo de API
- **REST**
- Patrón recomendado: **BFF (Backend for Frontend)** con **Next.js Route Handlers / Server Actions**
- **GraphQL no es necesario** en el MVP

### Responsabilidades principales del backend

#### Autenticación y acceso
- registro con email + contraseña
- login con Google OAuth
- recuperación de contraseña
- manejo de sesión

#### Perfil e identidad visual
- persistencia del perfil del diseñador
- carga de logo
- configuración de color principal
- selección de tipografía
- datos de estudio, web, email y redes

#### Catálogo de servicios y cálculo sugerido
- catálogo base por categorías
- servicios personalizados por diseñador
- motor de cálculo sugerido usando tarifarios guardados
- reglas de ajuste por experiencia, cliente, urgencia, alcance, cantidad y complejidad
- fallback al último tarifario válido guardado

#### Presupuestos
- creación de borradores
- guardado automático
- recuperación ante pérdida de conexión
- validaciones de negocio
- cálculo de subtotales y total
- generación de presupuesto “Listo”
- duplicación
- creación de nueva versión sin modificar el original

#### Compartir y tracking
- generación de enlace público con token seguro
- validación de expiración
- registro de apertura del enlace
- actualización de estado a “Visto”
- registro de número de aperturas y fecha de apertura

#### PDF
- generación de PDF a partir del mismo template del presupuesto
- almacenamiento del archivo generado
- descarga segura
- registro del evento de descarga

#### Seguimiento
- marcar manualmente “Aceptado” / “Rechazado”
- auditoría de eventos
- cálculo de métricas simples para dashboard

### ¿Necesita WebSockets?
- **No son obligatorios para el MVP**
- **Uso opcional recomendado** solo para:
  - reflejar en tiempo casi real el cambio a estado **Visto** si el diseñador está en el dashboard
  - actualizar métricas sin refresh manual

### Estrategia recomendada
- MVP inicial: **polling liviano / revalidación**
- Mejora inmediata posible: **Supabase Realtime** sobre eventos de presupuesto
- No se justifica una infraestructura dedicada de sockets propia

### Procesos síncronos
- login
- autosave de borrador
- cálculo de total
- creación de presupuesto
- generación de enlace
- validación de vista pública

### Procesos asíncronos
- recordatorios al diseñador si no se abrió en 3 días
- expiración programada de enlaces
- importación / actualización de tarifarios
- reprocesos de PDF ante error
- agregación de métricas o resúmenes

### Tech stack sugerido
- **Next.js Route Handlers / Server Actions**
- **Supabase Auth**
- **Supabase Edge Functions** para lógica desacoplada y tareas públicas simples
- **Node runtime** para generación de PDF
- **Puppeteer/Playwright** o **React-PDF** para exportación PDF

### Endpoints / módulos internos esperados
- `/auth/*`
- `/profile/*`
- `/services/*`
- `/rates/*`
- `/clients/*`
- `/budgets/*`
- `/budgets/:id/share`
- `/budgets/public/:token`
- `/budgets/:id/pdf`
- `/budgets/:id/events`

---

## 4. BASE DE DATOS

### Tipo de BD recomendado
- **PostgreSQL**

### Motivo
- relaciones claras entre usuarios, clientes, presupuestos, versiones e ítems
- necesidad de consistencia transaccional
- versionado y tracking con buen soporte relacional
- fácil integración con Supabase

### Tablas principales

#### 1. `auth.users`
Gestionada por el sistema de autenticación.

#### 2. `designer_profiles`
Datos del diseñador.

Campos sugeridos:
- id
- auth_user_id
- nombre
- apellido
- email
- experiencia
- estudio_nombre
- sitio_web
- created_at
- updated_at

#### 3. `designer_branding`
Configuración visual del presupuesto.

Campos sugeridos:
- id
- designer_id
- logo_path
- color_principal
- tipografia
- redes_json
- created_at
- updated_at

#### 4. `clients`
Clientes cargados por cada diseñador.

Campos sugeridos:
- id
- designer_id
- nombre
- email
- telefono
- empresa
- created_at
- updated_at

#### 5. `service_categories`
Categorías base del sistema.

Ejemplos:
- branding
- web
- editorial
- publicitario
- ilustración
- packaging
- redes sociales

#### 6. `service_catalog`
Servicios reutilizables.

Campos sugeridos:
- id
- designer_id nullable
- category_id
- nombre
- descripcion
- precio_base
- origen (`system` | `custom`)
- activo
- created_at
- updated_at

#### 7. `rate_sources`
Fuentes de tarifarios.

Campos sugeridos:
- id
- nombre_fuente
- version
- vigencia_desde
- vigente
- imported_at

#### 8. `rate_reference_items`
Valores de referencia por servicio.

Campos sugeridos:
- id
- rate_source_id
- category_id
- servicio_nombre
- valor_min
- valor_base
- valor_max
- metadata_json

#### 9. `rate_equivalences`
Mapeo cuando no hay coincidencia directa entre un servicio del usuario y el tarifario.

Campos sugeridos:
- id
- input_label
- reference_item_id
- aprobado_por_admin

#### 10. `budgets`
Entidad principal del presupuesto.

Campos sugeridos:
- id
- designer_id
- client_id
- current_version_id
- estado_actual
- moneda
- validez_dias
- expires_at
- public_token
- public_url
- sent_at
- first_viewed_at
- last_viewed_at
- views_count
- downloaded_at
- accepted_at
- rejected_at
- created_at
- updated_at

#### 11. `budget_versions`
Versionado inmutable del contenido.

Campos sugeridos:
- id
- budget_id
- numero_version
- estado_version
- project_type
- project_description
- project_scope
- urgency
- condiciones
- subtotal
- total
- generated_at
- created_at

#### 12. `budget_items`
Ítems de cada versión.

Campos sugeridos:
- id
- budget_version_id
- service_catalog_id nullable
- nombre
- descripcion
- cantidad
- precio_unitario
- subtotal
- orden

#### 13. `budget_views`
Eventos de apertura del enlace público.

Campos sugeridos:
- id
- budget_id
- viewed_at
- ip_hash
- user_agent
- referrer

#### 14. `budget_events`
Timeline del presupuesto.

Eventos sugeridos:
- draft_created
- auto_saved
- generated
- link_created
- sent_confirmed
- viewed
- pdf_downloaded
- accepted_marked
- rejected_marked
- expired
- duplicated
- version_created

### Relaciones principales
- `auth.users` **1:1** `designer_profiles`
- `designer_profiles` **1:1** `designer_branding`
- `designer_profiles` **1:N** `clients`
- `designer_profiles` **1:N** `service_catalog`
- `designer_profiles` **1:N** `budgets`
- `clients` **1:N** `budgets`
- `budgets` **1:N** `budget_versions`
- `budget_versions` **1:N** `budget_items`
- `budgets` **1:N** `budget_views`
- `budgets` **1:N** `budget_events`
- `service_categories` **1:N** `service_catalog`
- `rate_sources` **1:N** `rate_reference_items`

### Reglas de modelado importantes
- El presupuesto enviado **no se sobrescribe**.
- Cada edición posterior crea una **nueva versión**.
- El link público siempre debe apuntar a una **versión explícita**.
- El estado visible puede derivarse de eventos, pero conviene persistir `estado_actual` para consultas rápidas.
- El tracking del PDF no existe; solo se registra descarga.

### Seguridad
- **RLS (Row Level Security)** por `designer_id`
- la vista pública accede solo por `public_token`
- logo y PDFs con URLs firmadas o controladas
- no exponer IDs internos en enlaces públicos

---

## 5. n8n — AUTOMATIZACIONES

### Aplicación en el MVP
**Sí aplica, pero solo fuera del flujo principal.**

n8n no debe intervenir en:
- login
- creación de presupuesto
- cálculo de totales
- generación del link público
- render de la vista pública

n8n sí puede utilizarse para:

### Automatizaciones recomendadas
1. **Recordatorio de presupuesto no visto**
   - trigger programado
   - consulta presupuestos enviados no abiertos en 3 días
   - envía email al diseñador

2. **Expiración programada**
   - job periódico
   - detecta presupuestos vencidos
   - actualiza estado a `Vencido`

3. **Sincronización de tarifarios**
   - importación manual o programada
   - normalización de datos
   - actualización de tablas de referencia

4. **Reintento de PDFs fallidos**
   - toma eventos con error de generación
   - reintenta generación y notifica resultado

5. **Digest operativo**
   - resumen diario o semanal para el diseñador:
     - enviados
     - vistos
     - aceptados
     - rechazados

### Criterio de uso
- **Core transaccional dentro de la app**
- **Automatizaciones periféricas en n8n**

---

## 6. SERVICIOS EXTERNOS

### Autenticación
- **Supabase Auth**
- proveedores:
  - email + password
  - Google OAuth

### Base de datos
- **Supabase PostgreSQL**

### Almacenamiento
- **Supabase Storage**

Uso:
- logos del diseñador
- PDFs generados
- assets auxiliares si fueran necesarios

### Email transaccional
- **Resend**

Uso:
- recuperación de contraseña
- recordatorios de presupuestos no vistos
- notificaciones operativas

### Hosting / despliegue
- **Vercel** para frontend + backend Next.js
- **Supabase** para capa de datos y auth

### Realtime
- **Supabase Realtime**

Uso opcional:
- actualización instantánea del estado `Visto`
- métricas en dashboard

### Compartir por WhatsApp
- **No requiere API externa en MVP**
- usar deep links `wa.me` o share nativo del navegador

### PDF
- **Servicio interno en backend**
- no requiere tercero en MVP
- motor recomendado: Playwright / Puppeteer o React-PDF

### Analytics
- **Opcional**: PostHog

Uso:
- funnels de creación
- tiempo hasta generación
- uso recurrente
- aperturas y conversiones

### Pagos
- **No aplica en MVP**

### CRM externo
- **No aplica en MVP**

---

## STACK FINAL RECOMENDADO

### Stack principal
- **Frontend:** Next.js + React + TypeScript + Tailwind + shadcn/ui
- **Backend:** Next.js Route Handlers / Server Actions + Supabase Edge Functions
- **Base de datos:** PostgreSQL en Supabase
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Realtime opcional:** Supabase Realtime
- **Automatizaciones:** n8n
- **Email:** Resend
- **Hosting:** Vercel + Supabase

### Criterio final
Esta combinación minimiza complejidad, acelera el desarrollo con IA/Vibe Coding, evita sobrearquitectura y cubre completamente el MVP definido.
