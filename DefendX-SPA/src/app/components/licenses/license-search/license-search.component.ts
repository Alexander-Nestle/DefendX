import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { Observable, Subscription } from 'rxjs';
import { currentUser, isBasicUser } from 'src/app/ngrx/selectors/auth.selector';
import { User } from 'src/app/models/user/user';
import { selectLicenseSearchCount } from 'src/app/ngrx/selectors/license.selector';
import { ACCOUNT_TYPES } from 'src/app/models/user/accountType';
import { MatDialog } from '@angular/material';
import { GenericDialogComponent, DialogTypes } from '../../common/generic-dialog/generic-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-license-search',
  templateUrl: './license-search.component.html',
  styleUrls: ['./license-search.component.css']
})
export class LicenseSearchComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public search: string;
  public isBasicUser$: Observable<boolean>;
  private currentUser: User;
  private totalLicenseCount: number;
  private subCurrentUser: Subscription;
  private subSelectLicenseSearchCount: Subscription;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.form = fb.group({
      search: [null]
    });
  }

  //#region Lifecycle Hook Functions

  ngOnInit() {
    this.isBasicUser$ = this.store.pipe(select(isBasicUser));
    this.subCurrentUser = this.store
      .pipe(select(currentUser))
      .subscribe(user => this.currentUser = user);
    this.subSelectLicenseSearchCount = this.store
      .pipe(select(selectLicenseSearchCount))
      .subscribe(count => this.totalLicenseCount = count);
  }

  ngOnDestroy() {
    this.subCurrentUser.unsubscribe();
    this.subSelectLicenseSearchCount.unsubscribe();
  }

  //#endregion Lifecycle Hook Functions

  //#region Public Implementation Functions

  public onSearch() {
    this.search = this.form.get('search').value;
  }

  public onAddLicense() {
    // Basic Users Accounts cann't search, and search results are themselves and dependents,
    // meaning count is how many licenses that they added.
    if (
        this.currentUser.account.accountTypeId === ACCOUNT_TYPES.User
        && this.totalLicenseCount >= 15
    ) {
      this.dialog.open(GenericDialogComponent, {
        width: '25%',
        data: {
          title: 'Maxed',
          message: 'You have added the max number of licenses.  Please contact 18 SFS to add additional licenses', 
          type: DialogTypes.Message }
      });
      return;
    }
    this.router.navigateByUrl('/licenses/edit');
  }

  //#endregion Public Implementation Functions

}
