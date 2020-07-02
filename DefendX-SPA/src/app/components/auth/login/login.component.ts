import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { Login } from 'src/app/ngrx/actions/auth.actions';
import { noop, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { ProgressbarService } from 'src/app/services/common/progressbar.service';
import { selectIsAuthLoading } from 'src/app/ngrx/selectors/auth.selector';
import { MatDialog } from '@angular/material';
import { GenericDialogComponent, DialogTypes } from 'src/app/components/common/generic-dialog/generic-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loading: boolean;
  private authSub: Subscription;

  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private store: Store<AppState>,
    private router: Router,
    private progressbarService: ProgressbarService
  ) { }

  //#region Lifecycle Hook Functions

  ngOnInit() {
    this.loading = false;
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

  //#endregion Lifecycle Hook Functions

  //#region Public Interface Functions

  public logIn(): void {
    this.progressbarService.simProgressUpdate(0, 95, 3000);
    this.loading = true;
    this.authSub = this.auth.login()
      .pipe(
        tap(authUser => {
          this.progressbarService.updateProgress(100);
          this.loading = false;
          this.store.dispatch(new Login({authUser}));
          this.router.navigateByUrl('/licenses');
        })
      )
      .subscribe(
        noop,
        () => {
          const dialogRef = this.dialog.open(GenericDialogComponent, {
            width: '25%',
            data: {title: 'Login Failed', message: 'Ensure to select DoD Certificate, NOT Email Certificate', type: DialogTypes.Message}
          });
          this.progressbarService.updateProgress(100);
          this.loading = false;
        },
      );
  }

  //#endregion Public Interface Functions

}
