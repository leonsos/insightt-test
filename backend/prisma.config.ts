import { defineConfig } from "prisma/config";
import * as dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        // Usar DIRECT_URL para migraciones (puerto 5432), fallback a DATABASE_URL
        url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
});
