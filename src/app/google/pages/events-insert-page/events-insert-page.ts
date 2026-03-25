import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { form, FormRoot } from '@angular/forms/signals';
import {
  CalendarEventInsertSchema,
  toCalendarEventnsertModel,
  toGoogleCalendarEventInsertResource,
} from '../../helpers';
import { EventsFieldTree } from '../../components/events-field-tree/events-field-tree';

@Component({
  selector: 'app-events-insert-page',
  imports: [EventsFieldTree, FormRoot],
  templateUrl: './events-insert-page.html',
  styleUrl: './events-insert-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsInsertPage {
  private readonly service = inject(CalendarService);

  protected fieldTree = form(signal(toCalendarEventnsertModel()), CalendarEventInsertSchema, {
    submission: {
      action: async (fieldTree) => {
        const requestBody = toGoogleCalendarEventInsertResource(fieldTree().value());
        await this.service.insertEvent(
          {
            calendarId: 'primary',
            requestBody,
          },
          toGoogleCalendarEventInsertResource(fieldTree().value()),
        );
        history.back();
      },
      onInvalid: (fieldTree) => {
        fieldTree().errorSummary()[0]?.fieldTree().focusBoundControl();
      },
    },
  });

  protected cancel(): void {
    history.back();
  }
}
