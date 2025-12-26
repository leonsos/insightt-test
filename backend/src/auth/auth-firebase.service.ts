import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

export interface FirebaseUser {
  uid: string;
  email: string;
}

@Injectable()
export class AuthFirebaseService {
  getAuth(): admin.auth.Auth {
    return admin.auth();
  }

  async createUserWithEmailAndPassword(email: string, password: string): Promise<{ uid: string; email: string }> {
    try {
      const userRecord = await this.getAuth().createUser({
        email,
        password,
        emailVerified: false,
        disabled: false,
      });

      return {
        uid: userRecord.uid,
        email: userRecord.email!
      };
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async verifyToken(token: string): Promise<FirebaseUser> {
    try {
      const decodedToken = await this.getAuth().verifyIdToken(token);
      return {
        uid: decodedToken.uid,
        email: decodedToken.email!
      };
    } catch (error) {
      throw new Error(`Invalid token: ${error.message}`);
    }
  }

  async getUserByUid(uid: string): Promise<FirebaseUser | null> {
    try {
      const userRecord = await this.getAuth().getUser(uid);
      return {
        uid: userRecord.uid,
        email: userRecord.email!
      };
    } catch (error) {
      return null;
    }
  }

  async revokeRefreshTokens(uid: string): Promise<void> {
    try {
      await this.getAuth().revokeRefreshTokens(uid);
    } catch (error) {
      throw new Error(`Error revoking tokens: ${error.message}`);
    }
  }

  async deleteUser(uid: string): Promise<void> {
    try {
      await this.getAuth().deleteUser(uid);
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}