/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProgressbarService } from './progressbar.service';

describe('Service: Progressbar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProgressbarService]
    });
  });

  it('should ...', inject([ProgressbarService], (service: ProgressbarService) => {
    expect(service).toBeTruthy();
  }));
});
