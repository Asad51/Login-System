import { TestBed } from '@angular/core/testing';

import { NoAuthService } from './no-auth.service';

describe('NoAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoAuthService = TestBed.get(NoAuthService);
    expect(service).toBeTruthy();
  });
});
