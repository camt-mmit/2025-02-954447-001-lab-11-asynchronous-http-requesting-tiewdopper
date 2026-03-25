import { ChangeDetectionStrategy, Component, input, linkedSignal, Resource } from '@angular/core';
import { Film, Person, Planet } from '../../types';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { applyEach, createManagedMetadataKey, form, metadata } from '@angular/forms/signals';

import { ExtractIdPipe } from '../../pipes/extract-id-pipe-pipe';

@Component({
  selector: 'app-planet-view',
  imports: [DecimalPipe, RouterLink, ExtractIdPipe, DatePipe],
  templateUrl: './planet-view.html',
  styleUrl: './planet-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetView {
  readonly data = input.required<Planet>();
  readonly moduleRoute = input.required<ActivatedRoute>();

  protected readonly residentResourceKey = createManagedMetadataKey<
    Resource<Person | undefined>,
    string
  >((url) => {
    return httpResource(url);
  });
  protected readonly filmResourceKey = createManagedMetadataKey<Resource<Film | undefined>, string>(
    (url) => {
      return httpResource(url);
    },
  );
  protected readonly form = form(
    linkedSignal(() => ({ films: this.data().films, residents: this.data().residents }) as const),
    (path) => {
      applyEach(path.films, (eachPath) => {
        metadata(eachPath, this.filmResourceKey, ({ value }) => value());
      });
      applyEach(path.residents, (eachPath) => {
        metadata(eachPath, this.residentResourceKey, ({ value }) => value());
      });
    },
  );
}
