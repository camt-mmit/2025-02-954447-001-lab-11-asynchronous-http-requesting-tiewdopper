import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  Resource,
  resource,
} from '@angular/core';
import { Film, Person, Planet } from '../../types';
import { DatePipe } from '@angular/common';
import { fetchResource } from '../../helpers';
import { httpResource } from '@angular/common/http';
import { applyEach, createManagedMetadataKey, form, metadata } from '@angular/forms/signals';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe-pipe';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-person-view',
  imports: [DatePipe, ExtractIdPipe, RouterLink],
  templateUrl: './person-view.html',
  styleUrl: './person-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonView {
  readonly data = input.required<Person>();
  readonly moduleRoute = input.required<ActivatedRoute>();

  protected readonly homeWorld$ = computed(() => fetchResource<Planet>(this.data().homeworld));

  protected readonly homeWorldResource = resource({
    params: () => this.data().homeworld,
    loader: async ({ params }) => fetchResource<Planet>(params),
  });

  protected readonly homeWorldHttpResource = httpResource<Planet>(() =>
    this.data().homeworld
      ? {
          url: this.data().homeworld!,
          cache: 'force-cache',
        } // ถ้ามีแค่url ส่งเป็นstringเฉยๆได้ แต่ถ้ามีมากกว่าต้องส่งก้อนrequest
      : undefined,
  );

  protected readonly films$ = computed(() =>
    this.data().films.map((url) => fetchResource<Film>(url)),
  );

  protected readonly filmResource = resource({
    params: () => this.data().films,
    loader: async ({ params }) => await Promise.all(params.map((url) => fetchResource<Film>(url))),
  });

  protected readonly resourceKey = createManagedMetadataKey<Resource<Film | undefined>, string>(
    (url) => {
      //Note: memory leaks when component is reused
      return httpResource(url);
    },
  );
  protected readonly form = form(
    linkedSignal(() => ({ films: this.data().films }) as const),
    (path) => {
      applyEach(path.films, (eachPath) => {
        metadata(eachPath, this.resourceKey, ({ value }) => value());
      });
    },
  );
}
