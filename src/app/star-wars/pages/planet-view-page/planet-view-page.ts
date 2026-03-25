import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ModuleRoute } from '../../token';
import { planetResource } from '../../helpers';
import { PlanetView } from '../../components/planet-view/planet-view';

@Component({
  selector: 'app-planet-view-page',
  imports: [PlanetView],
  templateUrl: './planet-view-page.html',
  styleUrl: './planet-view-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetViewPage {
  readonly id = input.required<string>(); //bind route parameter

  protected readonly moduleRoute = inject(ModuleRoute);
  readonly dataResource = planetResource(() => this.id());
  protected goback() {
    history.back();
  }
}
