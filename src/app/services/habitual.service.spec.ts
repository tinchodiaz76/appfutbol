import { TestBed } from '@angular/core/testing';

import { HabitualesService } from './habitual.service';

describe('HabitualesService', () => {
  let service: HabitualesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HabitualesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
