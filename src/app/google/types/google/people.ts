import { GoogleResource } from '../google';

/**
 * ระบุประเภทของข้อมูลที่ต้องการดึงจาก People API (Field Mask)
 * @see https://developers.google.com/people/api/rest/v1/people.connections/list#query-parameters
 */
export type GooglePersonField =
    | 'addresses'
    | 'ageRanges'
    | 'biographies'
    | 'birthdays'
    | 'calendarUrls'
    | 'clientData'
    | 'coverPhotos'
    | 'emailAddresses'
    | 'events'
    | 'externalIds'
    | 'genders'
    | 'imClients'
    | 'interests'
    | 'locales'
    | 'locations'
    | 'memberships'
    | 'metadata'
    | 'miscKeywords'
    | 'names'
    | 'nicknames'
    | 'occupations'
    | 'organizations'
    | 'phoneNumbers'
    | 'photos'
    | 'relations'
    | 'sipAddresses'
    | 'skills'
    | 'urls'
    | 'userDefined';

// ============================================================================
// Core Resource Types
// ============================================================================

/**
 * ข้อมูลของแต่ละบุคคล (Contact)
 * @see https://developers.google.com/people/api/rest/v1/people#Person
 */
export interface GooglePerson extends GoogleResource {
    /** The resource name for the person, assigned by the server. e.g., "people/c12345" */
    readonly resourceName?: string;

    /** The HTTP entity tag of the resource. Used for web cache validation. */
    readonly etag: string;

    /** The person's names. */
    names?: readonly GooglePersonName[];

    /** The person's email addresses. */
    emailAddresses?: readonly GooglePersonEmailAddress[];

    /** The person's phone numbers. */
    phoneNumbers?: readonly GooglePersonPhoneNumber[];

    /** The person's read-only photos. */
    readonly photos?: readonly GooglePersonPhoto[];
}

export interface GooglePersonName {
    readonly displayName?: string;
    readonly familyName?: string;
    readonly givenName?: string;
    readonly middleName?: string;
    readonly honorificPrefix?: string;
    readonly honorificSuffix?: string;
}

export interface GooglePersonEmailAddress {
    /** The email address. */
    readonly value: string;
    /** The type of the email address. e.g., 'home', 'work' */
    readonly type?: string;
    /** The read-only type of the email address translated and formatted in the viewer's account locale. */
    readonly formattedType?: string;
}

export interface GooglePersonPhoneNumber {
    /** The phone number. */
    readonly value: string;
    /** The type of the phone number. e.g., 'mobile', 'home' */
    readonly type?: string;
    /** The read-only type of the phone number translated and formatted in the viewer's account locale. */
    readonly formattedType?: string;
    /** The read-only canonicalized ITU-T E.164 form of the phone number. */
    readonly canonicalForm?: string;

    readonly metadata?: {
        primary: boolean;
        source: {
            type: string;
            id: string
        }
    }
}

export interface GooglePersonPhoto {
    /** The URL of the photo. */
    readonly url: string;
    /** True if the photo is a default photo; false if the photo is a user-provided photo. */
    readonly default?: boolean;
}


// ============================================================================
// Request & Response Types
// ============================================================================

/**
 * Parameters for the Google People API people.connections.list request.
 * @see https://developers.google.com/people/api/rest/v1/people.connections/list
 */
export interface GooglePeopleConnectionsListRequest {
    /** * **REQUIRED**: A comma-separated list of person fields to be included in the response. 
     * e.g., "names,emailAddresses,phoneNumbers,photos"
     */
    readonly personFields: string;

    /** Number of connections to include in the response. */
    readonly pageSize?: number;

    /** Token specifying which result page to return. */
    readonly pageToken?: string;

    /** The order in which the connections should be sorted. */
    readonly sortOrder?: 'LAST_MODIFIED_ASCENDING' | 'LAST_MODIFIED_DESCENDING' | 'FIRST_NAME_ASCENDING' | 'LAST_NAME_ASCENDING';

    /** Sync token for delta requests. */
    readonly syncToken?: string;
}

/**
 * Response from people.connections.list
 */
export interface GooglePeopleConnectionsListResponse {
    /** The list of people that the requestor is connected to. */
    readonly connections?: readonly GooglePerson[];

    /** The token that can be used to retrieve the next page of results. */
    readonly nextPageToken?: string;

    /** The token that can be used to retrieve changes since the last request. */
    readonly nextSyncToken?: string;

    /** The total number of items in the list without pagination. */
    readonly totalItems?: number;

    /** The total number of people in the list without pagination. */
    readonly totalPeople?: number;
}


/**
 * Parameters for the Google People API people.createContact request.
 * @see https://developers.google.com/people/api/rest/v1/people/createContact
 */
export interface GooglePeopleCreateContactRequest {
    /** * Optional: A comma-separated list of person fields to be included in the response.
     * If empty, returns the default fields.
     */
    readonly personFields?: string;

    /**
     * The contact resource to create.
     * Passed in the request body.
     */
    readonly requestBody: GooglePerson;
}