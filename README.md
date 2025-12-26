# Insightt Test - Fullstack Task Management

Bienvenido al repositorio de **Insightt Test**, una aplicación moderna de gestión de tareas diseñada con una arquitectura escalable y segura. Este proyecto demuestra una implementación **Senior** utilizando tecnologías de vanguardia como React, Firebase y TypeScript.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-19.0-61dafb)
![Firebase](https://img.shields.io/badge/Firebase-11.0-orange)

## 📋 Descripción General

Esta aplicación permite a los usuarios gestionar sus tareas diarias de manera eficiente. Cuenta con un sistema robusto de autenticación, almacenamiento de datos en tiempo real y funciones serverless para lógica de negocio crítica.

### Características Principales

- **Resultados en Tiempo Real**: Sincronización instantánea de tareas.
- **Autenticación Segura**: Implementación completa con **Firebase Authentication**, soportando registro, inicio de sesión y protección de rutas.
- **Arquitectura Serverless**: Lógica de backend desacoplada utilizando **Firebase Cloud Functions** para escalabilidad y mantenimiento reducido.
- **Diseño Moderno**: Interfaz de usuario intuitiva construida con Material UI y React.
- **Calidad de Código**: Tipado estático estricto con TypeScript y linter configurado.

## 🚀 Tecnologías

### Frontend (`/frontend`)
- **React 19**: Biblioteca UI principal.
- **Vite**: Build tool de próxima generación para desarrollo rápido.
- **TypeScript**: Superset de JavaScript para código robusto.
- **React Router**: Enrutamiento declarativo.
- **Cypress**: Framework de pruebas End-to-End (E2E).

### Backend (`/firebase-functions`)
- **Firebase Cloud Functions**: Computación serverless basada en eventos.
- **Firebase Authentication**: Gestión de identidad y control de acceso.
- **Firestore / PostgreSQL**: (Según configuración) Capa de persistencia de datos.

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn
- Firebase CLI (`npm install -g firebase-tools`)

### Pasos de Instalación

1.  **Clonar el repositorio**:
    ```bash
    git clone <repository-url>
    cd insightt-test
    ```

2.  **Configurar Frontend**:
    ```bash
    cd frontend
    npm install
    cp .env.example .env # Configurar variables de entorno de Firebase
    ```

3.  **Configurar Backend**:
    ```bash
    cd ../firebase-functions/functions
    npm install
    ```

## 💻 Ejecución

### Desarrollo Local (Frontend)

Para iniciar el servidor de desarrollo de Vite:

```bash
cd frontend
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

### Emuladores de Firebase (Backend)

Para probar funciones y autenticación localmente:

```bash
cd firebase-functions
firebase emulators:start
```

## 🧪 Pruebas (Testing)

El proyecto cuenta con una suite de pruebas End-to-End (E2E) robusta utilizando **Cypress** para asegurar la integridad de los flujos críticos como el inicio de sesión y la gestión de tareas.

### Ejecutar Pruebas E2E

Para ejecutar las pruebas en modo "headless" (consola):

```bash
cd frontend
npm run test:e2e
```

Para abrir la interfaz interactiva de Cypress:

```bash
cd frontend
npm run test:e2e:open
```

## 🔒 Seguridad y Despliegue

- **Reglas de Seguridad**: Firestore/Storage rules configuradas para acceso granular.
- **CI/CD**: Preparado para pipelines de integración continua.

---
Desarrollado con ❤️ por [Tu Nombre/Equipo]
