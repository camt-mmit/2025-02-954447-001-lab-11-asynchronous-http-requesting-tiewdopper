import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Planet } from '../../types';
import { RouterLink } from '@angular/router';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe-pipe';

@Component({
  selector: 'app-planet-list',
  imports: [RouterLink, ExtractIdPipe],
  templateUrl: './planet-list.html',
  styleUrl: './planet-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetList {
  readonly data = input.required<readonly Planet[]>();
}
