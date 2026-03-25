import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { PeopleService } from '../../services/people.service';
import { GooglePerson } from '../../types/google/people';
import { form, FormField, FormRoot, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-people-list-page',
  imports: [FormField, FormRoot, RouterLink],
  templateUrl: './people-list-page.html',
  styleUrl: './people-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleListPage {
  private readonly service = inject(PeopleService);
  private readonly router = inject(Router);


  readonly q = input<string>('');


  protected readonly form = form(
    linkedSignal(
      () => ({ q: this.q() ?? '' }) as const,
    ),
    {
      submission: {
        action: async (fieldTree) => {
          this.router.navigate([], {
            queryParams: { q: fieldTree().value().q || null },
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
        },
      },
    },
  );


  protected readonly resource = this.service.connectionsResource(() => ({
    personFields: 'names,emailAddresses,phoneNumbers,photos',
    pageSize: 100,
  }));


  protected readonly filteredContacts = computed(() => {
    const connections = this.resource.value()?.connections ?? [];

    const searchTerm = (this.q() ?? '').toLowerCase();

    if (!searchTerm) {
      return connections;
    }

    return connections.filter((person: GooglePerson) => {
      const matchName = person.names?.some(n =>
        n.displayName?.toLowerCase().includes(searchTerm)
      );

      const matchEmail = person.emailAddresses?.some(e =>
        e.value?.toLowerCase().includes(searchTerm)
      );

      return matchName || matchEmail;
    });
  });

  protected async clearSearch() {
    this.form.q().value.set('');
    await submit(this.form);
  }
}