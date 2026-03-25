import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ModuleRoute } from '../../token';

@Component({
  selector: 'app-star-wars-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './star-wars-root.html',
  styleUrl: './star-wars-root.scss',
  providers: [{ provide: ModuleRoute, useFactory: () => inject(ActivatedRoute) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarWarsRoot {}
