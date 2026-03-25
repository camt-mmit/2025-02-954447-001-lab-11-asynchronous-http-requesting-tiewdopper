import { GoogleResource } from '../google';

export interface CalendarResource<K extends string> extends GoogleResource {
  readonly kind: `'calendar#${K}'`;
}
/**
 * Represents the response from the Google Calendar API events.list method.
 * @see https://developers.google.com/workspace/calendar/api/v3/reference/events/list
 */
export interface GoogleCalendarEventsListResponse extends CalendarResource<'events'> {
  /** Title of the calendar. Read-only. */
  readonly summary: string;

  /** Description of the calendar. Read-only. */
  readonly description?: string;

  /** Last modification time of the calendar (as a RFC3339 timestamp). Read-only. */
  readonly updated: string;

  /** The time zone of the calendar. Read-only. */
  readonly timeZone: string;

  /** The user's access role for this calendar. Read-only. */
  readonly accessRole: 'none' | 'freeBusyReader' | 'reader' | 'writer' | 'owner';

  /** The default reminders on the calendar for the authenticated user. */
  readonly defaultReminders: readonly GoogleCalendarReminder[];

  /** Token used to access the next page of this result. Omitted if no further results are available. */
  readonly nextPageToken?: string;

  /** Token used at a later point in time to retrieve only the entries that have changed since this result was returned. */
  readonly nextSyncToken?: string;

  /** List of events on the calendar. */
  readonly items: readonly GoogleCalendarEvent[];
}

/**
 * Represents an individual event on a calendar.
 */
export interface GoogleCalendarEvent extends CalendarResource<'event'> {
  /** ETag of the resource. */
  readonly etag: string;

  /** Opaque identifier of the event. */
  readonly id: string;

  /** Status of the event. */
  readonly status?: 'confirmed' | 'tentative' | 'cancelled';

  /** An absolute link to this event in the Google Calendar Web UI. Read-only. */
  readonly htmlLink?: string;

  /** Creation time of the event (as a RFC3339 timestamp). Read-only. */
  readonly created?: string;

  /** Last modification time of the event (as a RFC3339 timestamp). Read-only. */
  readonly updated?: string;

  /** Title of the event. */
  readonly summary?: string;

  /** Description of the event. Can contain HTML. */
  readonly description?: string;

  /** Geographic location of the event as free-form text. */
  readonly location?: string;

  /** The color of the event. ID referring to an entry in the event section of the colors definition. */
  readonly colorId?: string;

  /** The creator of the event. */
  readonly creator?: {
    readonly id?: string;
    readonly email?: string;
    readonly displayName?: string;
    readonly self?: boolean;
  };

  /** The organizer of the event. */
  readonly organizer?: {
    readonly id?: string;
    readonly email?: string;
    readonly displayName?: string;
    readonly self?: boolean;
  };

  /** The (inclusive) start time of the event. */
  readonly start: GoogleCalendarEventDateTime;

  /** The (exclusive) end time of the event. */
  readonly end: GoogleCalendarEventDateTime;

  /** Whether the end time is actually unspecified. An end time is still provided for compatibility. */
  readonly endTimeUnspecified?: boolean;

  /** List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event, as specified in RFC5545. */
  readonly recurrence?: readonly string[];

  /** For an instance of a recurring event, this is the id of the recurring event to which this instance belongs. */
  readonly recurringEventId?: string;

  /** For an instance of a recurring event, this is the time at which this event would start according to the recurrence data. */
  readonly originalStartTime?: GoogleCalendarEventDateTime;

  /** Whether the event blocks time on the calendar. "opaque" (default) or "transparent". */
  readonly transparency?: 'opaque' | 'transparent';

  /** Visibility of the event. "default", "public", "private", or "confidential". */
  readonly visibility?: 'default' | 'public' | 'private' | 'confidential';

  /** Event unique identifier as defined in RFC5545. */
  readonly iCalUID?: string;

  /** Sequence number as per iCalendar. */
  readonly sequence?: number;

  /** The attendees of the event. */
  readonly attendees?: readonly GoogleCalendarAttendee[];

  /** Whether attendees may have been omitted from the event's representation. */
  readonly attendeesOmitted?: boolean;

  /** Information about the event's reminders for the authenticated user. */
  readonly reminders?: {
    readonly useDefault: boolean;
    readonly overrides?: readonly GoogleCalendarReminder[];
  };

  /** Source from which the event was created. For example, a web page or an email. */
  readonly source?: {
    readonly url?: string;
    readonly title?: string;
  };

  /** File attachments for the event. */
  readonly attachments?: readonly GoogleCalendarAttachment[];

  /** Specific type of the event. */
  readonly eventType?:
    | 'default'
    | 'outOfOffice'
    | 'focusTime'
    | 'workingLocation'
    | 'birthday'
    | 'fromGmail';
}

/**
 * Representation of a date-time for an event.
 */
export interface GoogleCalendarEventDateTime {
  /** The date, in the format "yyyy-mm-dd", if this is an all-day event. */
  readonly date?: string;

  /** The time, as a combined date-time value (RFC3339). */
  readonly dateTime?: string;

  /** The time zone in which the time is specified. */
  readonly timeZone?: string;
}

/**
 * Representation of an event attendee.
 */
export interface GoogleCalendarAttendee {
  readonly id?: string;
  readonly email?: string;
  readonly displayName?: string;
  readonly organizer?: boolean;
  readonly self?: boolean;
  readonly resource?: boolean;
  readonly optional?: boolean;
  readonly responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  readonly comment?: string;
  readonly additionalGuests?: number;
}

/**
 * Representation of a reminder.
 */
export interface GoogleCalendarReminder {
  /** The method used by this reminder. */
  readonly method: 'email' | 'popup';

  /** Number of minutes before the start of the event when the reminder should trigger. */
  readonly minutes: number;
}

/**
 * Representation of an event attachment.
 */
export interface GoogleCalendarAttachment {
  /** URL link to the attachment. */
  readonly fileUrl: string;

  /** Title of the attachment. */
  readonly title: string;

  /** Internet Media Type (MIME type) of the attachment. */
  readonly mimeType?: string;

  /** URL link to the attachment's icon. */
  readonly iconLink?: string;

  /** ID of the Google Drive item. */
  readonly fileId?: string;
}

/**
 * Parameters for the Google Calendar API events.list request.
 * @see https://developers.google.com/workspace/calendar/api/v3/reference/events/list
 */
export interface GoogleCalendarEventsListRequest {
  /** * Calendar identifier. To retrieve calendar events for the primary
   * calendar, use the "primary" keyword.
   */
  readonly calendarId: string;

  /** * Maximum number of attendees to include in the response.
   * If there are more than the specified number of attendees, only the participant is returned.
   */
  readonly maxAttendees?: number;

  /** * Maximum number of events returned on one result page.
   * The number of events in the resulting page may be less than this value, or none at all.
   */
  readonly maxResults?: number;

  /** * The order of the events returned in the result.
   * "startTime": Order by start time (ascending). This is only available when querying for single events.
   * "updated": Order by last modification time (ascending).
   */
  readonly orderBy?: 'startTime' | 'updated';

  /** * Token specifying which result page to return. This is the nextPageToken from a previous response.
   */
  readonly pageToken?: string;

  /** * Free text search terms to find events that match these terms in any field, except for extended properties.
   */
  readonly q?: string;

  /** * Tokens used to access the next page of this result.
   * This is a "delta check" to retrieve only entries that have changed since the last request.
   */
  readonly syncToken?: string;

  /** * Lower bound (exclusive) for an event's end time to filter by.
   * Must be an RFC3339 timestamp with mandatory time zone offset.
   */
  readonly timeMax?: string;

  /** * Upper bound (exclusive) for an event's start time to filter by.
   * Must be an RFC3339 timestamp with mandatory time zone offset.
   */
  readonly timeMin?: string;

  /** * Time zone used in the response. (e.g., "Europe/Zurich").
   * Defaults to the calendar's time zone.
   */
  readonly timeZone?: string;

  /** * Lower bound for an event's last modification time (as a RFC3339 timestamp) to filter by.
   */
  readonly updatedMin?: string;

  /** * Whether to expand recurring events into instances and only return single one-off events and
   * instances of recurring events, but not the underlying recurring events themselves.
   */
  readonly singleEvents?: boolean;

  /** * Whether to include deleted events (with status "cancelled") in the result.
   * Cancelled instances of recurring events will always be returned if singleEvents is true.
   */
  readonly showDeleted?: boolean;

  /** * Whether to include hidden invitations in the result.
   */
  readonly showHiddenInvitations?: boolean;

  /** * Event types to return. If empty, all event types except for 'birthday' are returned.
   */
  readonly eventTypes?: readonly (
    | 'default'
    | 'outOfOffice'
    | 'focusTime'
    | 'workingLocation'
    | 'birthday'
    | 'fromGmail'
  )[];

  /** * Shared or private custom properties to filter by.
   * Format: "propertyName=value"
   */
  readonly sharedExtendedProperty?: readonly string[];
  readonly privateExtendedProperty?: readonly string[];
}

/**
 * Parameters for the Google Calendar API events.insert request.
 * @see https://developers.google.com/workspace/calendar/api/v3/reference/events/insert
 */
export interface GoogleCalendarEventsInsertRequest {
  /** * Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
   * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
   */
  readonly calendarId: string;

  /** * The maximum number of attendees to include in the response.
   * If there are more than the specified number of attendees, only the participant is returned.
   */
  readonly maxAttendees?: number;

  /** * Whether to send notifications about the creation of the new event.
   * Note: This is the replacement for the deprecated sendNotifications.
   */
  readonly sendUpdates?: "all" | "externalOnly" | "none";

  /** * Whether the API client performing the operation supports event attachments.
   * If you want to include attachments in the response, this must be set to true.
   */
  readonly supportsAttachments?: boolean;

  /** * Version number of conference data supported by the API client.
   * Set this to 1 to enable support for Google Meet and other conference data.
   */
  readonly conferenceDataVersion?: 0 | 1;

  /** * The event resource to create.
   * This is passed in the request body.
   */
  readonly requestBody: GoogleCalendarEventInsertResource;
}

/**
 * The event resource sent in the body of an insert request.
 * Some fields are read-only in responses but can be set during insertion (like 'id').
 */
export interface GoogleCalendarEventInsertResource {
  /** * Opaque identifier of the event. If you do not specify an ID, it will be generated by the server.
   * Characters allowed: base32hex encoding (a-v, 0-9). Length: 5-1024 characters.
   */
  readonly id?: string;

  /** Title of the event. */
  readonly summary?: string;

  /** Description of the event. Can contain HTML. */
  readonly description?: string;

  /** Geographic location of the event as free-form text. */
  readonly location?: string;

  /** The color of the event (ID from the colors endpoint). */
  readonly colorId?: string;

  /** The (inclusive) start time of the event. Required for non-recurring events. */
  readonly start: GoogleCalendarDateTime;

  /** The (exclusive) end time of the event. Required for non-recurring events. */
  readonly end: GoogleCalendarDateTime;

  /** * The attendees of the event.
   * To create an event with attendees, you must have writer access to the calendar.
   */
  readonly attendees?: readonly GoogleCalendarAttendeeInsert[];

  /** * Information about the event's reminders.
   */
  readonly reminders?: {
    /** Whether the default reminders of the calendar apply for the event. */
    readonly useDefault: boolean;
    /** If useDefault is false, the custom overrides for this event. */
    readonly overrides?: readonly GoogleCalendarReminder[];
  };

  /** * List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event, as specified in RFC5545.
   */
  readonly recurrence?: readonly string[];

  /** * Specific type of the event.
   * Possible values: "default", "outOfOffice", "focusTime", "workingLocation", "birthday".
   * Note: "fromGmail" events cannot be created via the API.
   */
  readonly eventType?: "default" | "outOfOffice" | "focusTime" | "workingLocation" | "birthday";

  /** * Conference-related information, such as details of a Google Meet conference.
   * Requires conferenceDataVersion=1 in the request.
   */
  readonly conferenceData?: {
    readonly createRequest?: {
      readonly requestId: string;
      readonly conferenceSolutionKey?: { readonly type?: string };
      readonly status?: { readonly statusCode?: string };
    };
  };

  /** Whether the event blocks time on the calendar. */
  readonly transparency?: "opaque" | "transparent";

  /** Visibility of the event. */
  readonly visibility?: "default" | "public" | "private" | "confidential";

  /** Extended properties of the event. */
  readonly extendedProperties?: {
    readonly private?: Readonly<Record<string, string>>;
    readonly shared?: Readonly<Record<string, string>>;
  };

  /** * File attachments for the event.
   * requires supportsAttachments=true in the request.
   */
  readonly attachments?: readonly GoogleCalendarAttachment[];
}

/** * Common type for event start/end times.
 */
export interface GoogleCalendarDateTime {
  /** The date, in the format "yyyy-mm-dd", if this is an all-day event. */
  readonly date?: string;
  /** The time, as a combined date-time value (RFC3339). */
  readonly dateTime?: string;
  /** The time zone in which the time is specified. (e.g. "Europe/Zurich") */
  readonly timeZone?: string;
}

/** * Simplified attendee structure for insertion.
 */
export interface GoogleCalendarAttendeeInsert {
  readonly email?: string;
  readonly displayName?: string;
  readonly optional?: boolean;
  readonly responseStatus?: "needsAction" | "declined" | "tentative" | "accepted";
  readonly comment?: string;
  readonly additionalGuests?: number;
}

export interface GoogleCalendarReminder {
  readonly method: "email" | "popup";
  readonly minutes: number;
}

export interface GoogleCalendarAttachment {
  readonly fileUrl: string;
  readonly title: string;
  readonly mimeType?: string;
  readonly iconLink?: string;
  readonly fileId?: string;
}
