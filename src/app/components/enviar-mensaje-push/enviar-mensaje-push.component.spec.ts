import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarMensajePushComponent } from './enviar-mensaje-push.component';

describe('EnviarMensajePushComponent', () => {
  let component: EnviarMensajePushComponent;
  let fixture: ComponentFixture<EnviarMensajePushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnviarMensajePushComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnviarMensajePushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
