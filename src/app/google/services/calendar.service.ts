import { inject, Injectable, ResourceRef } from '@angular/core';
import { OauthClient } from './oauth.client';
import { HttpClient } from '@angular/common/http';
import {
  CalendarResource,
  GoogleCalendarEvent,
  GoogleCalendarEventInsertResource,
  GoogleCalendarEventsInsertRequest,
  GoogleCalendarEventsListRequest,
  GoogleCalendarEventsListResponse,
} from '../types/google/calendar';
import { rxResource } from '@angular/core/rxjs-interop';
import { defer, firstValueFrom, switchMap } from 'rxjs';

const baseUrl = 'https://www.googleapis.com/calendar/v3/calendars';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private readonly client = inject(OauthClient);

  private readonly http = inject(HttpClient);

  eventResource(
    params: () => GoogleCalendarEventsListRequest,
  ): ResourceRef<GoogleCalendarEventsListResponse | undefined> {
    return rxResource({
      params,
      stream: ({ params: options }) => {
        // เปลี่ยนชื่อ
        const { calendarId, ...params } = options;
        return defer(async () => await this.client.getAuthorizationHeaders()).pipe(
          switchMap((headers) =>
            this.http.get<GoogleCalendarEventsListResponse>(`${baseUrl}/${calendarId}/events`, {
              headers: { ...headers },
              params,
            }),
          ),
        ); //defer async -> observable
      },
    });
  }

  insertEvent(
    options: GoogleCalendarEventsInsertRequest,
    body: GoogleCalendarEventInsertResource,
  ): Promise<GoogleCalendarEvent> {
    const { calendarId, requestBody, ...params } = options;
    return firstValueFrom(
      defer(async () => await this.client.getAuthorizationHeaders()).pipe(
        switchMap((headers) =>
          this.http.post<GoogleCalendarEvent>(`${baseUrl}/${calendarId}/events`, body, {
            headers: { ...headers },
            params,
          }),
        ),
      ),
    );
  }
}
