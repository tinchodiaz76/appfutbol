import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoHabitualesComponent } from './listado-habituales.component';

describe('ListadoHabitualesComponent', () => {
  let component: ListadoHabitualesComponent;
  let fixture: ComponentFixture<ListadoHabitualesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoHabitualesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoHabitualesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
