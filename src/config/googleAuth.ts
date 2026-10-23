import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import {
  CognitoUser,
  CognitoUserSession,
  CognitoIdToken,
  CognitoAccessToken,
  CognitoRefreshToken,
} from 'amazon-cognito-identity-js';
import { COGNITO_CONFIG, COGNITO_DOMAIN, userPool, authStorage } from './cognito';

WebBrowser.maybeCompleteAuthSession();

const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: `https://${COGNITO_DOMAIN}/oauth2/authorize`,
  tokenEndpoint: `https://${COGNITO_DOMAIN}/oauth2/token`,
  revocationEndpoint: `https://${COGNITO_DOMAIN}/oauth2/revoke`,
};

// URL a la que Google/Cognito devuelven al usuario.
// En build propio: mobileapp://auth — en Expo Go: exp://<IP>:8081/--/auth
export const googleRedirectUri = AuthSession.makeRedirectUri({
  scheme: 'mobileapp',
  path: 'auth',
});

export class GoogleNotConfiguredError extends Error {
  constructor() {
    super('COGNITO_DOMAIN vacío en src/config/cognito.ts');
    this.name = 'GoogleNotConfiguredError';
  }
}

// Abre Google, recibe el código, lo cambia por tokens de Cognito y guarda la
// sesión igual que un login con contraseña. Devuelve false si el usuario cancela.
export async function signInWithGoogle(): Promise<boolean> {
  if (!COGNITO_DOMAIN) throw new GoogleNotConfiguredError();

  const request = new AuthSession.AuthRequest({
    clientId: COGNITO_CONFIG.ClientId,
    redirectUri: googleRedirectUri,
    responseType: AuthSession.ResponseType.Code,
    scopes: ['openid', 'email', 'profile'],
    usePKCE: true,
    extraParams: { identity_provider: 'Google' },
  });

  const result = await request.promptAsync(discovery, { preferEphemeralSession: true });

  if (result.type === 'cancel' || result.type === 'dismiss') return false;
  if (result.type !== 'success') {
    throw new Error(result.type === 'error' ? result.params?.error_description ?? result.params?.error ?? 'Google' : result.type);
  }

  const tokens = await AuthSession.exchangeCodeAsync(
    {
      clientId: COGNITO_CONFIG.ClientId,
      code: result.params.code,
      redirectUri: googleRedirectUri,
      extraParams: { code_verifier: request.codeVerifier ?? '' },
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
  return true;
}