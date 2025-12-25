import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Inicializar Firebase Admin SDK
admin.initializeApp();

// Cloud Function para "Mark as Done"
export const markTaskDone = functions.https.onRequest(async (req, res) => {
  try {
    // Verificar autenticación
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Obtener datos de la solicitud
    const { taskId } = req.body;

    if (!taskId) {
      res.status(400).json({ error: 'Task ID is required' });
      return;
    }

    // Simular procesamiento avanzado en Cloud Function
    console.log(`Cloud Function processing task ${taskId} for user ${userId}`);

    // Aquí podrías:
    // 1. Enviar notificaciones push
    // 2. Actualizar estadísticas en tiempo real
    // 3. Validar dependencias de tareas
    // 4. Registrar auditoría
    // 5. Integrar con otros servicios

    // Simulación de procesamiento
    await new Promise(resolve => setTimeout(resolve, 100));

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      message: `Task ${taskId} marked as done successfully`,
      processedAt: new Date().toISOString(),
      userId: userId
    });

  } catch (error) {
    console.error('Error in markTaskDone function:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Cloud Function para notificaciones push (opcional)
export const sendTaskCompletionNotification = functions.firestore
  .document('tasks/{taskId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    // Si la tarea fue marcada como completada
    if (newValue.done && !previousValue.done) {
      const userId = newValue.userId;
      
      try {
        // Obtener el token de notificación del usuario (debería estar almacenado en Firestore)
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        const userToken = userDoc.data()?.notificationToken;

        if (userToken) {
          // Enviar notificación push
          await admin.messaging().send({
            token: userToken,
            notification: {
              title: '¡Tarea completada!',
              body: `La tarea "${newValue.title}" ha sido marcada como completada.`
            }
          });
        }
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
  });

// Cloud Function para estadísticas en tiempo real (opcional)
export const updateTaskStatistics = functions.firestore
  .document('tasks/{taskId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    if (newValue.done !== previousValue.done) {
      const userId = newValue.userId;
      
      try {
        // Actualizar estadísticas del usuario
        const statsRef = admin.firestore().collection('userStats').doc(userId);
        const statsDoc = await statsRef.get();
        
        const currentStats = statsDoc.exists ? statsDoc.data() : {
          totalTasks: 0,
          completedTasks: 0,
          completionRate: 0
        };

        const totalTasks = currentStats?.totalTasks || 0;
        const completedTasks = currentStats?.completedTasks || 0;

        const newStats = {
          totalTasks: totalTasks + (newValue.done ? 0 : 1),
          completedTasks: completedTasks + (newValue.done ? 1 : 0),
          completionRate: 0 // Calcular según lógica de negocio
        };

        await statsRef.set(newStats, { merge: true });
      } catch (error) {
        console.error('Error updating statistics:', error);
      }
    }
  });