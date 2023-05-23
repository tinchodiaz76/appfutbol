import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnotarseComponent } from './anotarse.component';

describe('AnotarseComponent', () => {
  let component: AnotarseComponent;
  let fixture: ComponentFixture<AnotarseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnotarseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnotarseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
