/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppDataService } from './appData.service';

describe('Service: Mil', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppDataService]
    });
  });

  it('should ...', inject([AppDataService], (service: AppDataService) => {
    expect(service).toBeTruthy();
  }));
});
