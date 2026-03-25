import { required, schema } from '@angular/forms/signals';
import { GoogleCalendarEventInsertResource } from './types/google/calendar';
import { GooglePerson } from './types/google/people';

export * from './helpers/encryption';

export interface CalendarEventInsertModel extends Omit<
  GoogleCalendarEventInsertResource,
  'start' | 'end'
> {
  readonly summary: string;
  readonly description: string;
  readonly allDay: boolean;
  readonly start: string;
  readonly end: string;
}

export function toCalendarEventnsertModel(): CalendarEventInsertModel {
  return {
    summary: '',
    description: '',
    allDay: true,
    start: '',
    end: '',
  };
}

export function toGoogleCalendarEventInsertResource(
  model: CalendarEventInsertModel,
): GoogleCalendarEventInsertResource {
  const { allDay, start, end, ...rest } = model;

  return {
    ...rest,
    ...(allDay
      ? {
        start: { date: start },
        end: { date: start },
      }
      : {
        start: { dateTime: new Date(start).toISOString() },
        end: { dateTime: new Date(end).toISOString() },
      }),
  };
}
export const CalendarEventInsertSchema = schema<CalendarEventInsertModel>((path) => {
  required(path.summary);
  required(path.allDay);
  required(path.start);
  required(path.end);
});



export interface ContactEmailModel {
  readonly type: string;
  readonly value: string;
}


export interface ContactPhoneModel {
  readonly type: string;
  readonly value: string;
}

export interface ContactInsertModel {
  readonly givenName: string;
  readonly familyName: string;
  readonly emails: readonly ContactEmailModel[];
  readonly phones: readonly ContactPhoneModel[];
}


export function toContactInsertModel(): ContactInsertModel {
  return {
    givenName: '',
    familyName: '',
    emails: [],
    phones: [],
  };
}

export function toGooglePersonInsertResource(
  model: ContactInsertModel,
): GooglePerson {
  const person: GooglePerson = { etag: '' };


  if (model.givenName || model.familyName) {
    person.names = [
      {
        givenName: model.givenName,
        familyName: model.familyName,
      },
    ];
  }


  if (model.emails && model.emails.length > 0) {
    person.emailAddresses = model.emails.map((e) => ({
      type: e.type,
      value: e.value,
    }));
  }


  if (model.phones && model.phones.length > 0) {
    person.phoneNumbers = model.phones.map((p) => ({
      type: p.type,
      value: p.value,
    }));
  }

  return person;
}


export const ContactInsertSchema = schema<ContactInsertModel>((path) => {
  required(path.givenName);

});