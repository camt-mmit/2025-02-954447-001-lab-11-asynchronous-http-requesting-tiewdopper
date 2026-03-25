import { InjectionToken } from '@angular/core';

export interface OauthConfiguration {
  readonly id: string;
  readonly secret?: string;
  readonly authorizationUrl: string;
  readonly tokenUrl: string;
  readonly redirectUri: string;
  readonly codeVerifierlength?: number;
}

export const OAUTH_CONFIGURATION = new InjectionToken<OauthConfiguration>('oauth-configuration');

export interface AccessTokenData {
  readonly accessToken: string;
  readonly expiresIn: number;
  readonly tokenType: string;
  readonly scope: string;
}

export interface AuthorizationHeaders {
  readonly Authorization: string;
}
