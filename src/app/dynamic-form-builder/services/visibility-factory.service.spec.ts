import { TestBed } from '@angular/core/testing';

import { VisibilityFactoryService } from './visibility-factory.service';

describe('VisibilityFactoryService', () => {
  let service: VisibilityFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisibilityFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
