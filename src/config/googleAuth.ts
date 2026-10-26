import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';
import {
  CognitoUser,
  CognitoUserSession,
  CognitoIdToken,
  CognitoAccessToken,
  CognitoRefreshToken,
} from 'amazon-cognito-identity-js';
import { COGNITO_CONFIG, COGNITO_DOMAIN, userPool, authStorage } from './cognito';

const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: `https://${COGNITO_DOMAIN}/oauth2/authorize`,
  tokenEndpoint: `https://${COGNITO_DOMAIN}/oauth2/token`,
  revocationEndpoint: `https://${COGNITO_DOMAIN}/oauth2/revoke`,
};

// URL a la que Cognito devuelve al usuario. Cada entorno genera una distinta:
//   app compilado (development build / tiendas) → mobileapp://auth
//   Expo Go      → exp://<IP>:8081/--/auth   (cambia si cambia la IP del computador)
//   web local    → http://localhost:8081/auth
// Todas deben estar en Cognito → Cliente de aplicación → URL de devolución de llamadas.
export const googleRedirectUri =
  Platform.OS === 'web'
    ? AuthSession.makeRedirectUri({ path: 'auth' })
    : Linking.createURL('auth');

// En web se guarda el verificador PKCE mientras la página va a Google y vuelve.
const WEB_PKCE_KEY = 'ytc-google-pkce';

export class GoogleNotConfiguredError extends Error {
  constructor() {
    super('COGNITO_DOMAIN vacío en src/config/cognito.ts');
    this.name = 'GoogleNotConfiguredError';
  }
}

function createRequest() {
  return new AuthSession.AuthRequest({
    clientId: COGNITO_CONFIG.ClientId,
    redirectUri: googleRedirectUri,
    responseType: AuthSession.ResponseType.Code,
    scopes: ['openid', 'email', 'profile'],
    usePKCE: true,
    extraParams: { identity_provider: 'Google' },
  });
}

// Cambia el código por tokens y guarda la sesión igual que un login con contraseña.
async function exchangeAndSaveSession(code: string, codeVerifier: string) {
  const tokens = await AuthSession.exchangeCodeAsync(
    {
      clientId: COGNITO_CONFIG.ClientId,
      code,
      redirectUri: googleRedirectUri,
      extraParams: { code_verifier: codeVerifier },
    },
    discovery,
  );

  if (!tokens.idToken) throw new Error('Respuesta sin idToken');

  const session = new CognitoUserSession({
    IdToken: new CognitoIdToken({ IdToken: tokens.idToken }),
    AccessToken: new CognitoAccessToken({ AccessToken: tokens.accessToken }),
    RefreshToken: new CognitoRefreshToken({ RefreshToken: tokens.refreshToken ?? '' }),
  });

  const username: string =
    session.getIdToken().payload['cognito:username'] ??
    session.getAccessToken().payload.username;

  const user = new CognitoUser({ Username: username, Pool: userPool, Storage: authStorage });
  user.setSignInUserSession(session);
}

// Inicia el login con Google.
// Móvil: abre el navegador del sistema y devuelve true/false (false = canceló).
// Web: redirige la página completa a Google; el login se termina en /auth.
export async function signInWithGoogle(): Promise<boolean> {
  if (!COGNITO_DOMAIN) throw new GoogleNotConfiguredError();

  // Debe estar en Cognito → Cliente de aplicación → URL de devolución de llamadas
  if (__DEV__) console.log('[Google] redirectUri:', googleRedirectUri);

  const request = createRequest();

  if (Platform.OS === 'web') {
    const url = await request.makeAuthUrlAsync(discovery);
    window.sessionStorage.setItem(
      WEB_PKCE_KEY,
      JSON.stringify({ verifier: request.codeVerifier, state: request.state }),
    );
    window.location.assign(url);
    return new Promise<boolean>(() => {}); // la página se va a Google
  }

  const result = await request.promptAsync(discovery, { preferEphemeralSession: true });

  if (result.type === 'cancel' || result.type === 'dismiss') return false;
  if (result.type !== 'success') {
    throw new Error(
      result.type === 'error'
        ? result.params?.error_description ?? result.params?.error ?? 'Google'
        : result.type,
    );
  }

  await exchangeAndSaveSession(result.params.code, request.codeVerifier ?? '');
  return true;
}

// Web: termina el login cuando Google/Cognito regresan a /auth?code=...&state=...
export async function completeGoogleRedirect(params: {
  code?: string;
  state?: string;
  error?: string;
}): Promise<void> {
  const raw = window.sessionStorage.getItem(WEB_PKCE_KEY);
  window.sessionStorage.removeItem(WEB_PKCE_KEY);

  if (params.error) throw new Error(params.error);
  if (!params.code || !raw) throw new Error('Respuesta de Google incompleta');

  const saved = JSON.parse(raw) as { verifier?: string; state?: string };
  if (!saved.verifier || saved.state !== params.state) {
    throw new Error('El estado de la respuesta no coincide');
  }

  await exchangeAndSaveSession(params.code, saved.verifier);
}