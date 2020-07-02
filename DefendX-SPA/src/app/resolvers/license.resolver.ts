import { Injectable } from '@angular/core';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { License } from 'src/app/models/license/license';
import { selectLicenseById } from 'src/app/ngrx/selectors/license.selector';
import { LicenseRequested } from 'src/app/ngrx/actions/license.actions';
import { tap, filter, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LicenseResolver {

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<License> {
    const licenseId = route.params['id'];

    // TODO Reroute doesn't work
    // TODO Currently only retrieves license from store to display, may want to query service directly
    return this.store
      .pipe(
        select(selectLicenseById(licenseId)),
        tap(license => {
          if (!license) {
            this.router.navigate(['/licenses/edit']);
            this.store.dispatch(new LicenseRequested({ id: licenseId }));
          }
        }),
        filter(license => !!license),
        first()
      );
  }
}
