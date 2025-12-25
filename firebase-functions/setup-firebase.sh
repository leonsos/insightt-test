#!/bin/bash

echo "🚀 Configuración de Firebase Cloud Functions"
echo "============================================"

# Verificar si Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI no está instalado"
    echo "Instalando Firebase CLI..."
    npm install -g firebase-tools
    echo "✅ Firebase CLI instalado"
else
    echo "✅ Firebase CLI ya está instalado"
fi

# Iniciar sesión en Firebase
echo ""
echo "🔐 Iniciando sesión en Firebase..."
firebase login

# Verificar proyectos disponibles
echo ""
echo "📋 Proyectos Firebase disponibles:"
firebase projects:list

# Preguntar si quiere usar un proyecto existente o crear uno nuevo
echo ""
read -p "¿Quieres usar un proyecto existente? (s/n): " use_existing

if [ "$use_existing" = "s" ] || [ "$use_existing" = "S" ]; then
    read -p "Ingresa el ID del proyecto: " project_id
    firebase use $project_id
else
    read -p "Ingresa el nombre del nuevo proyecto: " project_name
    firebase projects:create $project_name
    firebase use $project_name
fi

# Inicializar Firebase Functions
echo ""
echo "🏗️  Inicializando Firebase Functions..."
firebase init functions

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