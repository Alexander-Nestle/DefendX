/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LicenseResolver } from './license.resolver';

describe('Service: LicenseResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LicenseResolver]
    });
  });

  it('should ...', inject([LicenseResolver], (service: LicenseResolver) => {
    expect(service).toBeTruthy();
  }));
});
