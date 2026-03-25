import { ChangeDetectionStrategy, Component, input, linkedSignal, Resource } from '@angular/core';
import { Film, Person, Planet } from '../../types';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { applyEach, createManagedMetadataKey, form, metadata } from '@angular/forms/signals';
import { httpResource } from '@angular/common/http';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe-pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-film-view',
  imports: [RouterLink, ExtractIdPipe, DatePipe],
  templateUrl: './film-view.html',
  styleUrl: './film-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmView {
  readonly data = input.required<Film>();
  readonly moduleRoute = input.required<ActivatedRoute>();

  protected readonly characterResourceKey = createManagedMetadataKey<
    Resource<Person | undefined>,
    string
  >((url) => {
    return httpResource(url);
  });

  protected readonly planetResourceKey = createManagedMetadataKey<
    Resource<Planet | undefined>,
    string
  >((url) => {
    return httpResource(url);
  });

  protected readonly form = form(
    linkedSignal(
      () => ({ characters: this.data().characters, planets: this.data().planets }) as const,
    ),
    (path) => {
      applyEach(path.characters, (eachPath) => {
        metadata(eachPath, this.characterResourceKey, ({ value }) => value());
      });
      applyEach(path.planets, (eachPath) => {
        metadata(eachPath, this.planetResourceKey, ({ value }) => value());
      });
    },
  );
}
