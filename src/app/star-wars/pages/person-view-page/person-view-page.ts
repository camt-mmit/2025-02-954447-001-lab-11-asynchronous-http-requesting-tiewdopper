import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { PersonView } from '../../components/person-view/person-view';
import { personResource } from '../../helpers';
import { JsonPipe } from '@angular/common';
import { ModuleRoute } from '../../token';

@Component({
  selector: 'app-person-view-page',
  imports: [PersonView, JsonPipe],
  templateUrl: './person-view-page.html',
  styleUrl: './person-view-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonViewPage {
  readonly id = input.required<string>(); //bind route parameter

  protected readonly moduleRoute = inject(ModuleRoute);
  readonly dataResource = personResource(() => this.id()); //or เขียนเป็นฟังชั่นไปเลย personResource(this.id)


  protected goBack(): void {
    history.back(); //ไม่ค่อยแนะนำ
  }
}
