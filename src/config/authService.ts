import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

// ─── Pool ────────────────────────────────────────────────────────────────────
const pool = new CognitoUserPool({
  UserPoolId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID ?? '',
  ClientId:   process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID   ?? '',
});

// ─── Registro ────────────────────────────────────────────────────────────────
export function signUp(
  email: string,
  password: string,
  givenName: string,
  familyName: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const attrs = [
      new CognitoUserAttribute({ Name: 'email',       Value: email }),
      new CognitoUserAttribute({ Name: 'given_name',  Value: givenName }),
      new CognitoUserAttribute({ Name: 'family_name', Value: familyName }),
    ];
    pool.signUp(email, password, attrs, [], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// ─── Confirmación ────────────────────────────────────────────────────────────
export function confirmSignUp(email: string, code: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: pool });
    user.confirmRegistration(code, true, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// ─── Login ───────────────────────────────────────────────────────────────────
export function signIn(email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: pool });
    const auth = new AuthenticationDetails({ Username: email, Password: password });
    user.authenticateUser(auth, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
    });
  });
}

// ─── Recuperación ────────────────────────────────────────────────────────────
export function forgotPassword(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: pool });
    user.forgotPassword({
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
    const user = new CognitoUser({ Username: email, Pool: pool });
    user.confirmPassword(code, newPassword, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
    });
  });
}

// ─── Sesión actual ───────────────────────────────────────────────────────────
export function getCurrentUser(): CognitoUser | null {
  return pool.getCurrentUser();
}

export function signOut(): void {
  pool.getCurrentUser()?.signOut();
}