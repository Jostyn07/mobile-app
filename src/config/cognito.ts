import AsyncStorage from '@react-native-async-storage/async-storage';
import { CognitoUserPool, ICognitoStorage } from 'amazon-cognito-identity-js';

// Identificadores públicos del User Pool (el cliente de app no tiene "client secret").
export const COGNITO_CONFIG = {
  UserPoolId: 'us-east-2_2IKAQG4xF',
  ClientId: '5qiutkr9r1ebbig87h4vpe1gra',
};

// Dominio del login administrado de Cognito (sin https://).
// Cognito → User pool → Branding → Domain. Ej: 'yotecuido.auth.us-east-2.amazoncognito.com'
export const COGNITO_DOMAIN = '';

// ─── Almacenamiento de sesión ────────────────────────────────────────────────
// Cognito lee la sesión de forma síncrona, pero AsyncStorage es asíncrono.
// Solución: caché en memoria que se carga una vez al abrir el app
// (loadAuthStorage) y se guarda en AsyncStorage con cada cambio.
const STORAGE_KEY = '@ytc/auth-session';
let cache: Record<string, string> = {};

function persist() {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache)).catch(() => {});
}

class AuthStorage implements ICognitoStorage {
  setItem(key: string, value: string) {
    cache[key] = value;
    persist();
  }
  getItem(key: string): string | null {
    return cache[key] ?? null;
  }
  removeItem(key: string) {
    delete cache[key];
    persist();
  }
  clear() {
    cache = {};
    persist();
  }
}

export async function loadAuthStorage(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    cache = raw ? JSON.parse(raw) : {};
  } catch {
    cache = {};
  }
}

export const authStorage = new AuthStorage();

export const userPool = new CognitoUserPool({
  ...COGNITO_CONFIG,
  Storage: authStorage,
});