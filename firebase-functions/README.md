# Firebase Cloud Functions - Task Management

Este proyecto contiene las Cloud Functions de Firebase para la funcionalidad "Mark as Done" de la aplicación de gestión de tareas.

## 🚀 Funcionalidades

### 1. markTaskDone (HTTP Function)
Endpoint HTTP para procesar la lógica avanzada de marcar tareas como completadas.

**Endpoint:** `POST /markTaskDone`

**Requisitos:**
- Autenticación Firebase JWT en header `Authorization: Bearer <token>`
- Body: `{ "taskId": "123" }`

**Procesamiento:**
- Validación de autenticación
- Procesamiento avanzado de la tarea
- Registro de auditoría
- Posibles integraciones con otros servicios

### 2. sendTaskCompletionNotification (Firestore Trigger)
Cloud Function que se dispara cuando una tarea es marcada como completada para enviar notificaciones push.

**Trigger:** `tasks/{taskId}` onUpdate

**Funcionalidad:**
- Detecta cambios en el campo `done`
- Envía notificación push al usuario
- Mensaje personalizado con el título de la tarea

### 3. updateTaskStatistics (Firestore Trigger)
Cloud Function para mantener estadísticas en tiempo real del progreso del usuario.

**Trigger:** `tasks/{taskId}` onUpdate

**Estadísticas:**
- Total de tareas
- Tareas completadas
- Porcentaje de completitud

## 🛠️ Configuración

### Requisitos previos
1. Firebase CLI instalado: `npm install -g firebase-tools`
2. Proyecto Firebase configurado
3. Permisos de administrador en el proyecto

### Instalación
```bash
cd firebase-functions
npm install
```

### Desarrollo
```bash
# Compilar TypeScript
npm run build

# Iniciar emulador local
npm run serve

# Shell interactivo
npm run shell
```

### Despliegue
```bash
# Desplegar todas las funciones
npm run deploy

# Ver logs
npm run logs
```

## 📋 Estructura del Proyecto

```
firebase-functions/
├── src/
│   └── index.ts          # Funciones principales
├── lib/                  # Código compilado (generado)
├── package.json
├── tsconfig.json
└── .firebaserc           # Configuración del proyecto
```

## 🔧 Integración con el Backend

El backend NestJS dispara estas Cloud Functions de varias maneras:

1. **HTTP Request:** Llamando directamente al endpoint de la Cloud Function
2. **Firestore Trigger:** Actualizando documentos en Firestore para que las funciones se disparen automáticamente
3. **Pub/Sub:** Publicando mensajes en topics para procesamiento asíncrono

## 📊 Monitorización

- **Firebase Console:** Dashboard de funciones y métricas
- **Cloud Logging:** Registros detallados de ejecución
- **Error Reporting:** Gestión de errores y excepciones

## 🚨 Consideraciones

- **Costos:** Las Cloud Functions tienen costos basados en ejecución
- **Límites:** Tiempo de ejecución máximo de 60 segundos (HTTP) o 9 minutos (triggers)
- **Escalabilidad:** Se escalan automáticamente según la demanda
- **Seguridad:** Todas las funciones requieren autenticación Firebase