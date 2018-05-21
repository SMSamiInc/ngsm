import { TestBed, inject } from '@angular/core/testing';

import { NgsmService } from './ngsm.service';

describe('NgsmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgsmService]
    });
  });

  it('should be created', inject([NgsmService], (service: NgsmService) => {
    expect(service).toBeTruthy();
  }));
});
