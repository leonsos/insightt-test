#!/bin/bash

echo "🚀 Configurando proyecto Firebase con token"
echo "=========================================="

# Pide el token al usuario
read -p "Ingresa tu token de Firebase: " firebase_token

# Autenticar con el token
firebase login:ci --token $firebase_token

# Ver proyectos disponibles
echo ""
echo "📋 Proyectos Firebase disponibles:"
firebase projects:list

# Pide el ID del proyecto
read -p "Ingresa el ID del proyecto que deseas usar: " project_id

# Seleccionar proyecto
firebase use $project_id

# Inicializar Firebase Functions
echo ""
echo "🏗️  Inicializando Firebase Functions..."
cd firebase-functions
firebase init functions --project $project_id

# Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."
npm install

# Compilar TypeScript
echo ""
echo "🔨 Compilando TypeScript..."
npm run build

echo ""
echo "✅ Configuración completada!"
echo ""
echo "Próximos pasos:"
echo "1. npm run serve - Para iniciar el emulador local"
echo "2. firebase deploy --only functions - Para desplegar a producción"
echo "3. firebase functions:log - Para ver logs"