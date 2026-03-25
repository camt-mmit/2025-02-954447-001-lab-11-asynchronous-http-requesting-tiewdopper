import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ModuleRoute } from '../../token';
import { filmResource } from '../../helpers';
import { FilmView } from '../../components/film-view/film-view';

@Component({
  selector: 'app-film-view-page',
  imports: [FilmView],
  templateUrl: './film-view-page.html',
  styleUrl: './film-view-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmViewPage {
  readonly id = input.required<string>(); //bind route parameter

  protected readonly moduleRoute = inject(ModuleRoute);
  readonly dataResource = filmResource(() => this.id());
  protected goback() {
    history.back();
  }
}
