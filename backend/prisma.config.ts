import { defineConfig } from "prisma/config";
import * as dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        url: process.env.DATABASE_URL,
    },
});
