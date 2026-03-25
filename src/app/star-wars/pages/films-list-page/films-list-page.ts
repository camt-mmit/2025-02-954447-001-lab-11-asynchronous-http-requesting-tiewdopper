import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { ResultsListParams } from '../../types';
import { Router, RouterLink } from '@angular/router';
import { filmListResource, purnEmptyProperties } from '../../helpers';
import { disabled, form, submit, FormField } from '@angular/forms/signals';
import { DecimalPipe } from '@angular/common';
import { FilmsList } from '../../components/films-list/films-list';

@Component({
  selector: 'app-films-list-page',
  imports: [FormField, DecimalPipe, RouterLink, FilmsList],
  templateUrl: './films-list-page.html',
  styleUrl: './films-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmsListPage {
  readonly search = input<string>();
  readonly page = input<string>();
  private readonly params = computed<Required<ResultsListParams>>(() => ({
    search: this.search() ?? '',
    page: this.page() ?? '',
  }));

  protected readonly currentPage = computed(() => Number(this.page() ?? 1));

  protected readonly previousPage = computed(() => {
    if (this.resource.hasValue()) {
      const urlText = this.resource.value().previous;

      if (urlText === null) {
        return null;
      }

      const url = new URL(urlText);
      return url.searchParams.get('page'); //searchParams เป็น property ของ URL Object ที่จะดึงเอาเฉพาะส่วนที่อยู่หลังเครื่องหมาย ? ผลลัพธ์ที่ได้ออกมาจากคำสั่งนี้ก็คือ String คำว่า '2'
    } else {
      return null;
    }
  });

  protected readonly nextPage = computed(() =>
    this.resource.hasValue() && this.resource.value().next
      ? new URL(this.resource.value().next!).searchParams.get('page')
      : null,
  );
  private readonly router = inject(Router);

  protected readonly resource = filmListResource(() => purnEmptyProperties(this.params()));
  protected readonly form = form(
    linkedSignal(() => ({ search: this.search() ?? '' })),
    (path) => {
      disabled(path, () => this.resource.isLoading());
    },
  );

  protected onSearch(): void {
    submit(
      //รับค่า (Arguments) 2 ตัวหลักๆ ตัวฟอร์ม แอ็กชันที่จะให้ทำ
      this.form,
      async (form) =>
        void this.router.navigate([], {
          queryParams: purnEmptyProperties(form().value()),
          replaceUrl: true,
        }),
    );
  }

  protected clearSearch(): void {
    this.form.search().value.set('');
    this.onSearch();
  }
}
