import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { GoogleCalendarEvent, GoogleCalendarEventsListRequest } from '../../types/google/calendar';
import { form, FormField, FormRoot, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { EventsList } from "../../components/events-list/events-list";

const defaulQueryParams: GoogleCalendarEventsListRequest = {
  calendarId: 'primary',
  maxResults: 25,
  singleEvents: true,
  eventTypes: ['default'],
  orderBy: 'startTime',
};
@Component({
  selector: 'app-events-list-page',
  imports: [FormField, FormRoot, EventsList, RouterLink],
  templateUrl: './events-list-page.html',
  styleUrl: './events-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsListPage {
  private readonly service = inject(CalendarService);

  readonly q = input<string>();

  private readonly params = linkedSignal(() => ({
    ...defaulQueryParams,
    ...(this.q() ? { q: this.q()! } : {}),
  }));

  protected readonly resource = this.service.eventResource(this.params);

  protected readonly items = linkedSignal({
    source: () => (this.resource.hasValue() ? this.resource.value().items : null),
    computation: (source, previous): readonly GoogleCalendarEvent[] | null => {
      if (source === null) {
        return previous?.value ?? null;
      } else {
        return [...(previous?.value ?? []), ...source];
      }
    },
  });

  private readonly router = inject(Router);
  protected readonly form = form(
    linkedSignal(
      () =>
        ({
          q: this.q() ?? '',
        }) as const,
    ),
    {
      submission: {
        action: async (fieldTree) => {
          this.items.set(null);
          this.router.navigate([], {
            queryParams: fieldTree().value(),
            replaceUrl: true,
          });
        },
      },
    },
  );

  protected async clearSearch() {
    this.form.q().value.set('');

    await submit(this.form);
  }

  loadMore(PageToken: string): void {
    this.params.update((value) => ({
      ...value,
      PageToken,
    }));
  }
}
