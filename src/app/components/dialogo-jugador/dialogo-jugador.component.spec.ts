import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoJugadorComponent } from './dialogo-jugador.component';

describe('DialogoJugadorComponent', () => {
  let component: DialogoJugadorComponent;
  let fixture: ComponentFixture<DialogoJugadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoJugadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoJugadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
