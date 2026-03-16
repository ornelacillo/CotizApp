
# CHECKLIST DE SEGURIDAD — App de Presupuestos para Diseñadores Freelance

## AUTENTICACIÓN
- [ ] Requerir autenticación obligatoria para acceder al panel del diseñador
- [ ] Permitir autenticación mediante email + contraseña
- [ ] Permitir autenticación mediante Google OAuth
- [ ] Usar Supabase Auth como proveedor de autenticación
- [ ] Implementar hashing seguro de contraseñas (bcrypt o Argon2) gestionado por Supabase
- [ ] Requerir confirmación de email al registrarse
- [ ] Forzar contraseña mínima de 10 caracteres
- [ ] Validar presencia de al menos una letra y un número en la contraseña
- [ ] Bloquear login después de 5 intentos fallidos en 10 minutos
- [ ] Implementar expiración de sesión tras 24 horas de inactividad
- [ ] Permitir logout manual desde el panel
- [ ] Invalidar tokens de sesión al hacer logout
- [ ] Usar JWT firmados para sesiones
- [ ] Almacenar tokens de sesión en cookies HTTPOnly seguras
- [ ] Usar Secure + SameSite cookies

## AUTORIZACIÓN (PERMISOS POR ROL)

### ROL: Diseñador (usuario autenticado)
- [ ] Puede crear presupuestos
- [ ] Puede editar presupuestos en estado borrador
- [ ] Puede generar presupuesto final
- [ ] Puede duplicar presupuestos existentes
- [ ] Puede crear nueva versión de presupuesto enviado
- [ ] Puede descargar presupuesto en PDF
- [ ] Puede compartir enlace público del presupuesto
- [ ] Puede ver listado de sus presupuestos
- [ ] Puede ver estado de presupuestos (borrador, listo, enviado, visto)
- [ ] Puede marcar manualmente aceptado o rechazado
- [ ] Puede editar su perfil (logo, nombre del estudio, web, redes)
- [ ] Puede subir su logo e identidad visual
- [ ] NO puede acceder a presupuestos de otros diseñadores
- [ ] NO puede modificar presupuestos de otros usuarios
- [ ] NO puede ver datos de clientes de otros diseñadores
- [ ] NO puede modificar datos del sistema (tarifarios base)
- [ ] NO puede acceder a logs internos del sistema

### ROL: Cliente (acceso público)
- [ ] Puede abrir enlace público del presupuesto
- [ ] Puede visualizar contenido del presupuesto
- [ ] Puede visualizar datos del diseñador
- [ ] Puede descargar PDF si está habilitado
- [ ] NO puede editar el presupuesto
- [ ] NO puede modificar estados
- [ ] NO puede responder dentro de la app
- [ ] NO puede acceder a otros presupuestos
- [ ] NO puede ver el panel del diseñador
- [ ] NO puede autenticarse en el sistema

## PROTECCIÓN DE DATOS
- [ ] Usar HTTPS obligatorio en toda la aplicación
- [ ] Forzar HSTS (HTTP Strict Transport Security)
- [ ] Cifrar tráfico mediante TLS 1.2 o superior
- [ ] No almacenar contraseñas en texto plano
- [ ] Almacenar archivos (logos) en Supabase Storage con acceso controlado
- [ ] Generar URLs públicas firmadas para presupuestos
- [ ] Usar tokens únicos para enlaces de presupuesto

## VALIDACIÓN DE INPUTS
- [ ] Email: validar formato RFC
- [ ] Contraseña: validar longitud mínima (10 caracteres)
- [ ] Nombre del estudio: máximo 100 caracteres
- [ ] Sitio web: validar URL válida
- [ ] Redes sociales: validar URLs
- [ ] Logo: solo permitir PNG, JPG, SVG
- [ ] Nombre cliente: máximo 100 caracteres
- [ ] Email cliente: validar formato
- [ ] Teléfono: máximo 20 caracteres
- [ ] Nombre del proyecto: máximo 150 caracteres
- [ ] Descripción: máximo 2000 caracteres
- [ ] Precios: solo números positivos
- [ ] Moneda: validar contra lista permitida
- [ ] Validar tipo MIME real de archivos subidos
- [ ] Tamaño máximo archivo: 5MB

## RATE LIMITING
- [ ] Registro: máximo 5 registros por IP por hora
- [ ] Login: máximo 5 intentos fallidos en 10 minutos por IP
- [ ] Creación de presupuestos: máximo 30 por hora por usuario
- [ ] Generación de PDF: máximo 20 PDFs por hora por usuario
- [ ] Acceso a enlaces de presupuesto: máximo 100 visitas por minuto por IP

## GESTIÓN DE ERRORES
- [ ] No mostrar stack traces al usuario
- [ ] No mostrar errores de base de datos
- [ ] No mostrar rutas internas del servidor
- [ ] Mostrar mensajes genéricos al usuario
- [ ] Registrar errores en sistema de logs centralizado
- [ ] Registrar intentos de login fallidos
- [ ] Registrar creación de presupuestos
- [ ] Registrar generación de enlaces públicos
- [ ] Registrar subida de archivos

## BACKUP Y RECUPERACIÓN
- [ ] Backup automático diario de PostgreSQL
- [ ] Retención mínima de backups: 30 días
- [ ] Verificación automática de integridad del backup
- [ ] Backup diario de archivos en storage (logos)
- [ ] Tiempo máximo de recuperación (RTO): 4 horas
- [ ] Pérdida máxima de datos (RPO): 24 horas
- [ ] Procedimiento documentado de restauración

## RGPD
- [ ] Solicitar consentimiento explícito al registrarse
- [ ] Permitir retirar consentimiento
- [ ] Solicitar únicamente datos necesarios
- [ ] Permitir al usuario descargar sus datos
- [ ] Permitir eliminación completa de cuenta
- [ ] Eliminar datos personales de base de datos
- [ ] Eliminar archivos asociados
- [ ] Eliminar cuentas inactivas tras 24 meses
- [ ] Eliminar logs sensibles tras 90 días
