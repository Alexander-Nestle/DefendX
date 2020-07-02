import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { selectUserRequestLoading, selectUserById, selectAccountTypes } from 'src/app/ngrx/selectors/user.selector';
import { User } from 'src/app/models/user/user';
import { tap, startWith, map, filter } from 'rxjs/operators';
import { UserRequested, UserUpdateRequested, UserUpdated, AllAccountTypesRequested, UserUpdateCancelled } from 'src/app/ngrx/actions/user.actions';
import { UsersService } from 'src/app/services/users/users.service';
import { Update } from '@ngrx/entity';
import { SnackbarService } from 'src/app/services/common/snackbar.service';
import { AccountType } from 'src/app/models/user/accountType';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Unit } from 'src/app/models/mil/unit';
import { selectUnitByName } from 'src/app/ngrx/selectors/appData.selector';
import { UnitsByNameRequested } from 'src/app/ngrx/actions/appData.actions';

export interface ViewAccountDialogData {
  dodId: number;
}

@Component({
  selector: 'app-view-account-dialog',
  templateUrl: './view-account-dialog.component.html',
  styleUrls: ['./view-account-dialog.component.css']
})
export class ViewAccountDialogComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public loading$: Observable<boolean>;
  public units$: Observable<Unit[]>;
  public accountTypes$: Observable<AccountType[]>;
  public retrievedUser: User;
  private dodId: number;
  private userSub: Subscription;
  private formChangeSub: Subscription;
  private unitsRequested: boolean; // stops action dispatch in results are [];

  constructor(
    public dialog: MatDialog,
    private store: Store<AppState>,
    private userService: UsersService,
    private fb: FormBuilder,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<ViewAccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: ViewAccountDialogData
  ) {
    this.dodId = data.dodId;
    this.form = fb.group({
      dodId: [0],
      accountTypeId: ['', [Validators.required]],
      unitId: ['', [this.unitConfirming.bind(this)]]
    });

  }

  //#region Lifecycle Hooks

  ngOnInit() {
    this.loading$ = this.store.pipe(select(selectUserRequestLoading));
    this.accountTypes$ = this.store
      .pipe(
        select(selectAccountTypes),
        tap(accountTypes => {
          if (accountTypes.length === 0) {
            this.store.dispatch(new AllAccountTypesRequested);
          }
        })
      );
    
    this.userSub = this.store
    .pipe<User>(
      select(selectUserById(this.dodId)),
      tap(user => {
        if (user != null) {
          this.retrievedUser = user;
          this.mapUserToForm(this.retrievedUser);
        } else {
          this.store.dispatch(new UserRequested({ id: this.dodId }));
        }
      })
    ).subscribe();

    this.formChangeSub = this.form.controls['unitId'].valueChanges
      .pipe(
        startWith<string | Unit>(''),
        map(value => {
          if (value == null) {
            return 'undefined';
          }
          return typeof value === 'string' ? value : value.name;
        }),
        filter(value => typeof value !== 'undefined'),
        map(value => {
          if (typeof value !== null) {
            this.unitsRequested = false;
            this.loadUnits(value);
          }
        })
      ).subscribe();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.formChangeSub.unsubscribe();
  }

  //#endregion Lifecycle Hooks

  //#region Public Interface Functions

  public onSubmit() {
    this.store.dispatch(new UserUpdateRequested());

    if (this.form.get('unitId').value && (<Unit>this.form.get('unitId').value).id) {
      this.form.patchValue({
        unitId: this.form.get('unitId').value.id
      });
    }

    this.userService
        .updateUser(this.form.value)
        .subscribe(
            (user) => {
                if (user && (<User>user).dodId) {
                    const changes = user as User;

                    const updatedUser: Update<User> = {
                      id: this.retrievedUser.dodId,
                      changes
                    };
                    this.store.dispatch(new UserUpdated({user: updatedUser}));
                    this.snackbarService.displaySuccessFeedback('Save Successful');
                    this.dialogRef.close();
                }
            }, error => {
                this.snackbarService.displayErrorFeedback(error);
                this.store.dispatch(new UserUpdateCancelled());
            }
        );
  }

  public onDisplayUnit(unit?: Unit): string | undefined {
    return unit ? unit.name : undefined;
  }

  //#endregion Public Interface Functions

  //#region Private Implementation Functions

  private mapUserToForm(user: User) {
    this.form.patchValue({
      dodId: user.dodId,
      accountTypeId: user.account.accountTypeId,
      unitId: user.unit
    });
  }

  private unitConfirming(c: FormControl): { [s: string]: boolean } {
    const unit = c.value;
    if ((unit !== '') && (unit != null) && !(<Unit>unit).id) {
      return { invalid: true };
    }
    return null;
  }

  private loadUnits(name: string): void {
    this.units$ = this.store
      .pipe(
        select(selectUnitByName(name)),
        tap(units => {
          if (units.length === 0 && !this.unitsRequested && name.length >= 2) {
            this.unitsRequested = true;
            this.store.dispatch(new UnitsByNameRequested({ name }));
          }
        })
      );
  }

  //#endregion Private Implementation Functions

}
