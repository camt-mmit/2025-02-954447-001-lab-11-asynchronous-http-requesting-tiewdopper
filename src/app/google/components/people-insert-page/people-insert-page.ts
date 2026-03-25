import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PeopleService } from '../../services/people.service';
import { form, FormRoot } from '@angular/forms/signals';
import {
  ContactInsertSchema,
  toContactInsertModel,
  toGooglePersonInsertResource,
} from '../../helpers';
import { PeopleFieldTree } from '../../components/people-field-tree/people-field-tree';

@Component({
  selector: 'app-people-insert-page',
  imports: [PeopleFieldTree, FormRoot],
  templateUrl: './people-insert-page.html',
  styleUrl: './people-insert-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleInsertPage {
  private readonly service = inject(PeopleService);

  protected fieldTree = form(signal(toContactInsertModel()), ContactInsertSchema, {
    submission: {
      action: async (fieldTree) => {
        const requestBody = toGooglePersonInsertResource(fieldTree().value());
        await this.service.insertContact({
          requestBody,
          personFields: 'names,emailAddresses,phoneNumbers'
        });

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