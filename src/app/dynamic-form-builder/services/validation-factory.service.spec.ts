import { TestBed } from '@angular/core/testing';

import { ValidationFactoryService } from './validation-factory.service';

describe('ValidationFactoryService', () => {
  let service: ValidationFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
