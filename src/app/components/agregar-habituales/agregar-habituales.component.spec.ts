import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarHabitualesComponent } from './agregar-habituales.component';

describe('AgregarHabitualesComponent', () => {
  let component: AgregarHabitualesComponent;
  let fixture: ComponentFixture<AgregarHabitualesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarHabitualesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarHabitualesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
