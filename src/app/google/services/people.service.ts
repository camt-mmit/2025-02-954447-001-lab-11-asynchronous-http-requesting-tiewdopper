import { inject, Injectable, ResourceRef } from '@angular/core';
import { OauthClient } from './oauth.client';
import { HttpClient } from '@angular/common/http';
import {
  GooglePeopleConnectionsListRequest,
  GooglePeopleConnectionsListResponse,
  GooglePeopleCreateContactRequest,
  GooglePerson,
} from '../types/google/people';
import { rxResource } from '@angular/core/rxjs-interop';
import { defer, firstValueFrom, switchMap } from 'rxjs';


const baseUrl = 'https://people.googleapis.com/v1/people';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private readonly client = inject(OauthClient);
  private readonly http = inject(HttpClient);


  connectionsResource(
    params: () => GooglePeopleConnectionsListRequest,
  ): ResourceRef<GooglePeopleConnectionsListResponse | undefined> {
    return rxResource({
      params,
      stream: ({ params: options }) => {
        return defer(async () => await this.client.getAuthorizationHeaders()).pipe(
          switchMap((headers) =>
            this.http.get<GooglePeopleConnectionsListResponse>(`${baseUrl}/me/connections`, {
              headers: { ...headers },
              params: { ...options },
            }),
          ),
        );
      },
    });
  }

  insertContact(
    options: GooglePeopleCreateContactRequest,
  ): Promise<GooglePerson> {
    const { requestBody, personFields } = options;


    const params = personFields ? { personFields } : {};

    return firstValueFrom(
      defer(async () => await this.client.getAuthorizationHeaders()).pipe(
        switchMap((headers) =>
          this.http.post<GooglePerson>(`${baseUrl}:createContact`, requestBody, {
            headers: { ...headers },
            params,
          }),
        ),
      ),
    );
  }
}