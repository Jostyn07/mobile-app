import 'react-native-get-random-values';
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { userPool, authStorage } from './cognito';

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function userFor(email: string): CognitoUser {
  return new CognitoUser({
    Username: normalizeEmail(email),
    Pool: userPool,
    Storage: authStorage,
  });
}

// ─── Mensajes de error en español ────────────────────────────────────────────
export function getAuthErrorMessage(err: any): string {
  const name: string = err?.code ?? err?.name ?? '';
  const message: string = err?.message ?? '';

  if (/network/i.test(name) || /network/i.test(message)) {
    return 'Sin conexión. Revisa tu internet e intenta de nuevo.';
  }

  switch (name) {
    case 'NotAuthorizedException':
      return /attempts exceeded/i.test(message)
        ? 'Demasiados intentos. Espera unos minutos e intenta de nuevo.'
        : 'Correo o contraseña incorrectos.';
    case 'UserNotFoundException':
      return 'No encontramos una cuenta con ese correo.';
    case 'UsernameExistsException':
      return 'Ese correo ya está registrado. Inicia sesión o usa otro correo.';
    case 'InvalidPasswordException':
      return 'La contraseña no cumple los requisitos de seguridad.';
    case 'CodeMismatchException':
      return 'El código no es correcto. Revísalo e intenta de nuevo.';
    case 'ExpiredCodeException':
      return 'El código venció. Pide uno nuevo.';
    case 'LimitExceededException':
    case 'TooManyRequestsException':
    case 'TooManyFailedAttemptsException':
      return 'Demasiados intentos. Espera unos minutos e intenta de nuevo.';
    case 'InvalidParameterException':
      return 'Revisa que todos los campos estén completos y correctos.';
    default:
      return 'Ocurrió un error. Intenta de nuevo.';
  }
}

export function isUnconfirmedError(err: any): boolean {
  return (err?.code ?? err?.name) === 'UserNotConfirmedException';
}

// ─── Registro ────────────────────────────────────────────────────────────────
export function signUp(
  email: string,
  password: string,
  givenName: string,
  familyName: string,
): Promise<void> {
  const username = normalizeEmail(email);
  return new Promise((resolve, reject) => {
    const attrs = [
      new CognitoUserAttribute({ Name: 'email', Value: username }),
      new CognitoUserAttribute({ Name: 'given_name', Value: givenName.trim() }),
      new CognitoUserAttribute({ Name: 'family_name', Value: familyName.trim() }),
    ];
    userPool.signUp(username, password, attrs, [], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function confirmSignUp(email: string, code: string): Promise<void> {
  return new Promise((resolve, reject) => {
    userFor(email).confirmRegistration(code.trim(), true, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function resendConfirmationCode(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    userFor(email).resendConfirmationCode((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// ─── Login ───────────────────────────────────────────────────────────────────
export function signIn(email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const auth = new AuthenticationDetails({
      Username: normalizeEmail(email),
      Password: password,
    });
    userFor(email).authenticateUser(auth, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
    });
  });
}

// ─── Recuperación de contraseña ──────────────────────────────────────────────
export function forgotPassword(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    userFor(email).forgotPassword({
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
    });
  });
}

export function confirmNewPassword(
  email: string,
  code: string,
  newPassword: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    userFor(email).confirmPassword(code.trim(), newPassword, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
    });
  });
}

// ─── Sesión ──────────────────────────────────────────────────────────────────
// Devuelve true si hay una sesión válida. Si el token venció, Cognito lo
// renueva automáticamente con el refresh token.
export function hasValidSession(): Promise<boolean> {
  const user = userPool.getCurrentUser();
  if (!user) return Promise.resolve(false);
  return new Promise((resolve) => {
    user.getSession((err: any, session: any) => {
      resolve(!err && !!session?.isValid());
    });
  });
}

export function signOut(): void {
  userPool.getCurrentUser()?.signOut();
}