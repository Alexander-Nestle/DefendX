
import {throwError as observableThrowError,  Observable, noop } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpEvent,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HTTP_INTERCEPTORS
} from '@angular/common/http';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { Router } from '@angular/router';
import { Login } from 'src/app/ngrx/actions/auth.actions';
import { SnackbarService } from 'src/app/services/common/snackbar.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private auth: AuthService,
        private store: Store<AppState>,
        private router: Router,
        private snackBarService: SnackbarService
    ) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(catchError(error => {
            console.log(error);
            if (error instanceof HttpErrorResponse) {
                const applicationError = error.headers.get('Application-Error');
                if (applicationError) {
                    return observableThrowError(applicationError);
                }

                if (error.status === 401) {
                    this.auth.login().pipe(
                        tap(authUser => {
                          this.store.dispatch(new Login({authUser}));
                          this.snackBarService.displaySuccessFeedback('Token renewed');
                          // TODO automatically resend request
                          // return next.handle(req);
                        })
                      )
                      .subscribe(
                        noop,
                        () => {
                            alert('Authentication Failed');
                          this.router.navigateByUrl('/login');
                        }
                      );
                } else if (error.status === 403) {
                    this.snackBarService.displayErrorFeedback('Unauthorized');
                }

                const serverError = error.error;
                let modelStateErrors = '';
                if (serverError && typeof serverError === 'object') {
                    for (const key in serverError) {
                        if (serverError[key]) {
                            modelStateErrors += serverError[key] + '\n';
                        }
                    }
                }
                return observableThrowError(
                    modelStateErrors || serverError || 'Server Error'
                );
            }
        }));
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};
