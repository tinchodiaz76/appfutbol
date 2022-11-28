import { TestBed } from '@angular/core/testing';

import { JueganService } from './juegan.service';

describe('JueganService', () => {
  let service: JueganService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JueganService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
