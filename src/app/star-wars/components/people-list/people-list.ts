import { ChangeDetectionStrategy, Component, inject, Injector, input } from '@angular/core';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe-pipe';
import { Person } from '../../types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-people-list',
  imports: [ExtractIdPipe, RouterLink],
  templateUrl: './people-list.html',
  styleUrl: './people-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleList {
  readonly data = input.required<readonly Person[]>();

  private readonly injector = inject(Injector);
}
