import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { Observable } from 'rxjs';
import { isAdmin } from 'src/app/ngrx/selectors/auth.selector';
import { tap } from 'rxjs/operators';

@Injectable()
export class AdminGuard implements CanActivate {


  constructor(private store: Store<AppState>, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean>  {
        return this.store
            .pipe(
                select(isAdmin),
                tap(a => {
                    if (!a) {
                        this.router.navigateByUrl('/licenses');
                    }
                })
            );
    }
}
