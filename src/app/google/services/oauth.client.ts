import {
  APP_ID,
  computed,
  inject,
  Injectable,
  resource,
  ResourceRef,
  signal,
  untracked,
} from '@angular/core';
import { AccessTokenData, AuthorizationHeaders, OAUTH_CONFIGURATION } from '../types/services';
import { arrayBufferToBase64, randomString, sha256 } from '../helpers';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const KEY_PREFIX = 'oauth';

const defaultCodeVerifierLength = 64;
const stateCodeLength = 16;
const stateTtl = 10 * 60 * 1_000; // time to live 10 mins
const latency = 10 * 1_0000;

interface StateData {
  readonly expireAt: number;
  readonly data: {
    readonly codeVerifier: string;
    readonly intendedUrl: string;
  };
}

interface StoredAccessTokenData {
  readonly expireAt: number;
  readonly data: AccessTokenData;
}

interface AccessTokenResponse {
  readonly access_token: string;
  readonly expires_in: number;
  readonly scope: string;
  readonly token_type: string;
  readonly id_token?: string;
  readonly refreash_token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OauthClient {
  private readonly config = inject(OAUTH_CONFIGURATION);

  private readonly keyPrefix = `${inject(APP_ID)}-${KEY_PREFIX}-${this.config.id}`;

  //equal = true ตัวเก่ากับตัวใหม่เป็นตัวเดียวกัน เพราะ database ชอบส่งobjectใหม่มา
  // ใส่ # เพื่อให้เป็นprivate จริงๆ เป็นของ Javascript
  readonly #accessToken = signal<AccessTokenData | null>(null, {
    equal: (oldValue, newValue) => oldValue?.accessToken === newValue?.accessToken,
  });
  private stateKey(stateCode: string) {
    return `${this.keyPrefix}-state-${stateCode}` as const;
  }
  // ----------STATE Storage------------
  private storeState(stateCode: string, data: StateData['data']): void {
    localStorage.setItem(
      this.stateKey(stateCode),
      JSON.stringify({
        expireAt: new Date().getTime() + stateTtl,
        data,
      } satisfies StateData),
    ); // satisfies ก้อนนี้สามารถใส่type นี้ได้ แต่ ไม่บังคับtype เหมือน as
  }

  private getState(stateCode: string): StateData['data'] | null {
    const statePrefix = this.stateKey('');
    const now = new Date().getTime();

    Array.from({ length: localStorage.length }) //ArrayLike
      .map((_, i) => localStorage.key(i))
      .filter((key): key is string => key?.startsWith(statePrefix) ?? false) //key is string ถ้า true จะเป็นtypeนั้นไปเลย
      .forEach((key) => {
        const item = JSON.parse(
          localStorage.getItem(this.stateKey(stateCode)) ?? 'null',
        ) as StateData | null;

        if (item !== null) {
          if (item.expireAt < now) {
            localStorage.removeItem(key);
          }
        }
      });

    const result = JSON.parse(
      localStorage.getItem(this.stateKey(stateCode)) ?? 'null',
    ) as StateData | null;

    return result?.data || null;
  }

  private removeState(stateCode: string): void {
    localStorage.removeItem(this.stateKey(stateCode));
  }

  // ----------AcessToken Storage------------

  private readonly accessTokenDataKey = `${this.keyPrefix}-access_token_data` as const;

  private storeAccessTokenData(data: AccessTokenData): void {
    localStorage.setItem(
      this.accessTokenDataKey,
      JSON.stringify({
        expireAt: new Date().getTime() + data.expiresIn * 1_000 - latency,
        data,
      } satisfies StoredAccessTokenData),
    );
  }

  private getAccessTokenData(): AccessTokenData | null {
    const storedAccessTokenData: StoredAccessTokenData = JSON.parse(
      localStorage.getItem(this.accessTokenDataKey) ?? 'null',
    );

    if (storedAccessTokenData === null) {
      return null;
    }

    if (storedAccessTokenData.expireAt < new Date().getTime()) {
      localStorage.removeItem(this.accessTokenDataKey);
      return null;
    }

    return storedAccessTokenData.data;
  }

  private removeAccessTokenData(): void {
    localStorage.removeItem(this.accessTokenDataKey);
  }

  //-------------Refresh Token----------
  private readonly refreshTokenDataKey = `${this.keyPrefix}-refresh_token_data` as const;
  private storeRefreshToken(data: string): void {
    localStorage.setItem(this.refreshTokenDataKey, data);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenDataKey);
  }

  private removeRefreshToken() {
    localStorage.removeItem(this.refreshTokenDataKey);
  }
  //----------END Storage---------------------------

  // ------------Get URL----------------
  private readonly router = inject(Router);

  async getAuthorizationCodeUrl(
    scopes: readonly string[],
    params: Readonly<Record<string, string>> = {},
  ): Promise<URL> {
    const url = new URL(this.config.authorizationUrl);

    Object.entries(params).forEach(([Key, value]) => url.searchParams.set(Key, value)); //entries แปลง object เป็น [['key',value],['key',value]]

    const codeVerifier = randomString(this.config.codeVerifierlength ?? defaultCodeVerifierLength); // ควรเก็บใน indexDB
    const codeChallenge = arrayBufferToBase64(await sha256(codeVerifier), true);

    url.searchParams.set('client_id', this.config.id);
    url.searchParams.set('redirect_uri', this.config.redirectUri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', scopes.join(' '));
    url.searchParams.set('code_challenge', codeChallenge);
    url.searchParams.set('code_challenge_method', 'S256');
    const stateCode = randomString(stateCodeLength); // ควรเก็บใน indexDB โดนโจมตีโดย XSS(Cross-site-script)ได้แต่ยากขึ้นมาหน่อย (ใช้CSP ช่วยได้ระดับหนึ่ง)
    // หรือ http-only Cookie แต่โดนโจมตีโดย CSRFได้(ใช้Same-site ช่วยได้)
    url.searchParams.set('state', stateCode);

    this.storeState(stateCode, {
      codeVerifier,
      intendedUrl: this.router.url,
    });

    return url;
  }

  //-----------------Exchange --------
  private readonly http = inject(HttpClient);

  private async requestToken(formData: FormData): Promise<AccessTokenData> {
    const res = await firstValueFrom(
      this.http.post<AccessTokenResponse>(this.config.tokenUrl, formData),
    );

    const accessTokenData = {
      accessToken: res.access_token,
      tokenType: res.token_type,
      scope: res.scope,
      expiresIn: res.expires_in,
    };

    this.storeAccessTokenData(accessTokenData);

    if (typeof res.refreash_token !== 'undefined') {
      this.storeRefreshToken(res.refreash_token);
    }
    return accessTokenData;
  }

  async exchangeAuthorizationCode(code: string, stateCode: string): Promise<StateData['data']> {
    const state = this.getState(stateCode);
    if (state === null) {
      throw new Error(`state ${stateCode} not found`);
    }

    const formData = new FormData(); //FormData อยู่ใน web standard จะได้ไม่ต้องสร้างhtml

    formData.set('client_id', this.config.id);
    if (typeof this.config.secret !== 'undefined') {
      formData.set('client_secret', this.config.secret);
    }
    formData.set('code', code);
    formData.set('code_verifier', state.codeVerifier);
    formData.set('grant_type', 'authorization_code');
    formData.set('redirect_uri', this.config.redirectUri);

    await this.requestToken(formData);

    this.removeState(stateCode);
    return state;
  }

  //---------Get Access Token----------
  private readonly lockKey = `${this.keyPrefix}-lock` as const;

  async getAccessToken(): Promise<AccessTokenData | null> {
    return await navigator.locks.request(this.lockKey, async () => {
      //ใช้locks เพื่อ prevent data race
      const accessTokenData = this.getAccessTokenData();
      if (accessTokenData === null) {
        const refreshToken = this.getRefreshToken();

        if (refreshToken !== null) {
          const formData = new FormData();
          formData.set('client_id', this.config.id);
          if (typeof this.config.secret !== 'undefined') {
            formData.set('client_secret', this.config.secret);
          }
          formData.set('grant_type', 'refresh_token');
          formData.set('refresh_token', refreshToken);

          return this.updateAccessTokenData(await this.requestToken(formData));
        } else {
          return this.updateAccessTokenData(null);
        }
      } else {
        return this.updateAccessTokenData(accessTokenData);
      }
    });
  }

  async getAuthorizationHeaders(): Promise<AuthorizationHeaders> {
    const accessTokenData = await this.getAccessToken();
    if (accessTokenData === null) {
      throw new Error(`access token not found`);
    }
    return {
      Authorization: `${accessTokenData?.tokenType} ${accessTokenData?.accessToken}`,
    };
  }

  async clearToken(): Promise<void> {
    this.removeAccessTokenData();
    this.removeRefreshToken();

    await this.getAccessToken();
  }

  //untracked  เผื่อถูกเรียกในreactiveตัวอื่น
  private updateAccessTokenData(data: AccessTokenData | null): AccessTokenData | null {
    return untracked(() => {
      this.#accessToken.set(data);

      return data;
    });
  }

  accessTokenDataResource(): ResourceRef<AccessTokenData | undefined> {
    return resource({
      stream: async () => {
        //ต้องreturn signal ที่สามารถส่งค่าออกมาซ้ำๆได้ ถ้าใช้ loader จะ return ค่าเดียว
        await this.getAccessToken();

        return computed(() => {
          const accessTokenData = this.#accessToken();

          if (accessTokenData !== null) {
            return { value: accessTokenData };
          } else {
            return { error: new Error(`access token not found`) };
          }
        });
      },
    });
  }
}
