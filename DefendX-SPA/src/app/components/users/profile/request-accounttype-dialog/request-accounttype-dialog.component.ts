import { Component, OnInit, Inject, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { Observable, Subject } from 'rxjs';
import { AccountType } from 'src/app/models/user/accountType';
import { tap, takeUntil } from 'rxjs/operators';
import { selectAccountTypes, selectUserRequestLoading } from 'src/app/ngrx/selectors/user.selector';
import { AllAccountTypesRequested, EmailSendRequest, EmailResponce } from 'src/app/ngrx/actions/user.actions';
import { FormGroup, Validators, FormBuilder, EmailValidator, FormControl } from '@angular/forms';
import { User } from 'src/app/models/user/user';
import { currentUser } from 'src/app/ngrx/selectors/auth.selector';
import { RegexPattern } from 'src/app/models/app/regexPatterns';
import { UsersService } from 'src/app/services/users/users.service';
import { SnackbarService } from 'src/app/services/common/snackbar.service';

@Component({
  selector: 'app-request-accounttype-dialog',
  templateUrl: './request-accounttype-dialog.component.html',
  styleUrls: ['./request-accounttype-dialog.component.css']
})
export class RequestAccounttypeDialogComponent implements OnInit, OnDestroy {
  @ViewChild('file') file;
  public form: FormGroup;
  public accountTypes$: Observable<AccountType[]>;
  public user: User;
  public attachmentErrorMessage: string = '';
  public loading$: Observable<boolean>;
  private destroyed$: Subject<{}> = new Subject();

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private snackbarService: SnackbarService,
    private usersService: UsersService,
    private dialogRef: MatDialogRef<RequestAccounttypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) { 
    this.form = fb.group({
      accountTypeName: ['', [Validators.required]],
      justification: ['', [Validators.maxLength(250)]],
      emailAddress: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(RegexPattern.EMAIL)]],
      attachment: [null, [this.attachmentValidation.bind(this), Validators.required]]
    });

  }

  ngOnInit() {
    this.dialogRef.updatePosition({ right: '3%', bottom: '0' });
    this.accountTypes$ = this.store
      .pipe(
        select(selectAccountTypes),
        tap(accountTypes => {
          if (accountTypes.length === 0) {
            this.store.dispatch(new AllAccountTypesRequested);
          }
        })
      );

    this.store
      .pipe<User>(
        takeUntil(this.destroyed$),
        select(currentUser),
        tap( retrievedCurrentUser => {
          this.user = retrievedCurrentUser;
          if(this.user) {
            this.form.patchValue({ emailAddress: this.user.email });
          }
        })
      ).subscribe();
    this.loading$ = this.store.pipe(select(selectUserRequestLoading));
  }

  ngOnDestroy() {
    this.destroyed$.next(); /* Emit a notification on the subject. */
  }

  public onAttachFileClick(): void {
    this.file.nativeElement.click();
  }

  public onFileSelected(event: any): void {
    // 0.5 GB 
    if (this.file.nativeElement.files[0] != null && (this.file.nativeElement.files[0] as File).size > 500000000) {
      this.attachmentErrorMessage = 'Selected file is too large';
      return;
    }
    this.attachmentErrorMessage = '';
    this.form.patchValue({attachment: this.file.nativeElement.files[0]});
  }

  public onRemoveAttachedFileClick() {
    this.form.patchValue({ attachment: null });
  }

  public onClose() {
    this.dialogRef.close();
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      if (this.form.get('attachment').value == null) {
        this.attachmentErrorMessage = 'Please attach appointment letter or MFR';
      }
      return;
    }
    this.attachmentErrorMessage = '';
    this.form.disable();
    this.store.dispatch(new EmailSendRequest());
    this.usersService.requestAccountTypeChange(this.form.value).subscribe(() => {
      this.store.dispatch(new EmailResponce());
      this.snackbarService.displaySuccessFeedback('Request Sent Successfully to 18 SFS');
      this.dialogRef.close();
    }, (error) => {
      this.store.dispatch(new EmailResponce());
      this.snackbarService.displayErrorFeedback(error);
      this.dialogRef.close();
    });
  }

  private attachmentValidation(c: FormControl): { [s: string]: boolean } {
    const value = c.value;
    if (!(value instanceof File)) {
      return { invalid: true };
    }
    return null;
  }

}
