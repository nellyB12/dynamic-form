import { TestBed } from '@angular/core/testing';

import { LayoutFactoryService } from './layout-factory.service';

describe('LayoutFactoryService', () => {
  let service: LayoutFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
