import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetList } from './planet-list';

describe('PlanetList', () => {
  let component: PlanetList;
  let fixture: ComponentFixture<PlanetList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanetList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
