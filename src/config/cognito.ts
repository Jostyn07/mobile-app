import { CognitoUserPool } from 'amazon-cognito-identity-js';

// Estos son los identificadores reales de TU User Pool — no son secretos,
// son públicos por diseño (el cliente de app no tiene "client secret").
export const COGNITO_CONFIG = {
  UserPoolId: 'us-east-2_2IKAQG4xF',
  ClientId: '5qiutkr9r1ebbig87h4vpe1gra',
};

export const userPool = new CognitoUserPool(COGNITO_CONFIG);