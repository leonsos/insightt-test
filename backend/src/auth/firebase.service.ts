import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  onModuleInit() {
    // Inicializar Firebase Admin SDK
    if (!admin.apps.length) {
      // Obtener las credenciales desde variables de entorno
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
      
      if (serviceAccount) {
        // Si hay credenciales como JSON string
        try {
          const serviceAccountJson = JSON.parse(serviceAccount);
          this.firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccountJson),
          });
        } catch (error) {
          throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON');
        }
      } else if (process.env.FIREBASE_PROJECT_ID) {
        // Alternativa: usar Application Default Credentials (para producción en GCP)
        this.firebaseApp = admin.initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID,
        });
      } else {
        // Para desarrollo local, intentar usar credenciales por defecto
        try {
          this.firebaseApp = admin.initializeApp();
        } catch (error) {
          console.warn(
            'Firebase Admin SDK no pudo inicializarse. ' +
            'Asegúrate de tener FIREBASE_SERVICE_ACCOUNT o FIREBASE_PROJECT_ID en tu .env'
          );
        }
      }
    } else {
      this.firebaseApp = admin.app();
    }
  }

  getAuth(): admin.auth.Auth {
    return admin.auth();
  }

  async verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
    try {
      return await this.getAuth().verifyIdToken(token);
    } catch (error) {
      throw new Error(`Invalid token: ${error.message}`);
    }
  }
}

