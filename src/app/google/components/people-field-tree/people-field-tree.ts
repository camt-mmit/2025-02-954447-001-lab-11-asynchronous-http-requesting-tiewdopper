import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { ContactInsertModel } from '../../helpers';

@Component({
  selector: 'app-people-field-tree',
  imports: [FormField],
  templateUrl: './people-field-tree.html',
  styleUrl: './people-field-tree.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleFieldTree {
  readonly fieldTree = input.required<FieldTree<ContactInsertModel>>();


  addEmail() {
  
    const emailsSignal = this.fieldTree().emails().value;

    emailsSignal.set([...emailsSignal(), { type: '', value: '' }]);
  }

  removeEmail(index: number) {
    const emailsSignal = this.fieldTree().emails().value;

    emailsSignal.set(emailsSignal().filter((_, i) => i !== index));
  }


  addPhone() {
    const phonesSignal = this.fieldTree().phones().value;
    phonesSignal.set([...phonesSignal(), { type: '', value: '' }]);
  }

  removePhone(index: number) {
    const phonesSignal = this.fieldTree().phones().value;
    phonesSignal.set(phonesSignal().filter((_, i) => i !== index));
  }
}