/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import { Pool } from 'pg';

// Initialize Firebase Admin
admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.

/**
 * Cloud Function para marcar una tarea como completada
 *
 * Endpoint: POST /markTaskDone
 *
 * Request Body:
 * {
 *   "taskId": 123
 * }
 *
 * Headers:
 * Authorization: Bearer <firebase-id-token>
 *
 * Response:
 * {
 *   "success": true,
 *   "task": {
 *     "id": 123,
 *     "title": "Tarea completada",
 *     "done": true,
 *     "userId": 456
 *   }
 * }
 */
export const markTaskDone = functions.runWith({ secrets: ["DATABASE_URL"] }).https.onRequest(async (req: functions.https.Request, res: functions.Response) => {
  try {
    // 1. Manejo de CORS Manual
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({
        success: false,
        error: 'Method not allowed. Use POST.'
      });
      return;
    }

    // 2. Obtener y validar token de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Authorization header missing or invalid'
      });
      return;
    }

    const idToken = authHeader.split(' ')[1];
    if (!idToken) {
      res.status(401).json({
        success: false,
        error: 'ID Token missing'
      });
      return;
    }

    // 3. Verificar token con Firebase Admin
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
      return;
    }

    //const firebaseUid = decodedToken.uid;

    // 4. Obtener taskId del body
    const { taskId } = req.body;
    if (!taskId || typeof taskId !== 'number') {
      res.status(400).json({
        success: false,
        error: 'taskId is required and must be a number'
      });
      return;
    }

    // 5. Crear conexión a PostgreSQL (solo cuando se necesita)
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // 6. Verificar que el usuario sea dueño de la tarea y actualizar
    const client = await pool.connect();

    try {
      // Iniciar transacción
      await client.query('BEGIN');

      // Verificar propiedad y actualizar en una sola consulta
      const updateQuery = `
        UPDATE "Task"
        SET done = true, "updatedAt" = NOW()
        WHERE id = $1 AND "userId" = (
          SELECT id FROM "User" WHERE email = $2
        )
        RETURNING id, title, description, done, "userId", "createdAt", "updatedAt"
      `;

      const result = await client.query(updateQuery, [taskId, decodedToken.email]);

      if (result.rows.length === 0) {
        // No se encontró la tarea o el usuario no es el dueño
        await client.query('ROLLBACK');
        res.status(404).json({
          success: false,
          error: 'Task not found or you do not have permission to update this task'
        });
        return;
      }

      const updatedTask = result.rows[0];

      // Confirmar transacción
      await client.query('COMMIT');

      // Responder con éxito
      res.status(200).json({
        success: true,
        task: {
          id: updatedTask.id,
          title: updatedTask.title,
          description: updatedTask.description,
          done: updatedTask.done,
          userId: updatedTask.userId,
          createdAt: updatedTask.createdAt,
          updatedAt: updatedTask.updatedAt
        }
      });

    } catch (dbError: unknown) {
      await client.query('ROLLBACK');
      throw dbError;
    } finally {
      client.release();
      // Cerrar el pool después de la operación
      await pool.end();
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: errorMessage
    });
  }
});
