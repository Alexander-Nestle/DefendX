import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AccountType, ACCOUNT_TYPES } from 'src/app/models/user/accountType';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { tap, startWith, map, filter } from 'rxjs/operators';
import { selectAccountTypes } from 'src/app/ngrx/selectors/user.selector';
import { isAdmin, currentUser } from 'src/app/ngrx/selectors/auth.selector';
import { AllAccountTypesRequested, FaqAddedSuccess, FaqEditedSuccess, FaqDeletedSuccess } from 'src/app/ngrx/actions/user.actions';
import { UsersService } from 'src/app/services/users/users.service';
import { SnackbarService } from 'src/app/services/common/snackbar.service';
import { User } from 'src/app/models/user/user';
import { GenericInputDialogComponent, InputDialogTypes, InputDialogData } from 'src/app/components/common/generic-input-dialog/generic-input-dialog.component';
import { GenericDialogComponent, DialogTypes } from 'src/app/components/common/generic-dialog/generic-dialog.component';
import { AppDataService } from '../../../services/common/appData.service';
import { Faq } from 'src/app/models/user/faq';
import { Update } from '@ngrx/entity';

@Component({  
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
  public loading$: Observable<boolean>;
  public accountTypes$: Observable<AccountType[]>;
  public isAdmin$: Observable<boolean>;
  public addLoading: boolean;
  public userSub: Subscription;
  public user: User;
  public ACCOUNT_TYPES: any = ACCOUNT_TYPES;
  public newFaq: Faq;

  constructor(
    public dialog: MatDialog,
    private store: Store<AppState>,
    private userService: UsersService,
    private appDataService: AppDataService,
    private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.isAdmin$ = this.store.pipe(select(isAdmin));
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
        select(currentUser),
        tap(retrievedCurrentUser => {
          this.user = retrievedCurrentUser;
        })
      ).subscribe();
  }

  addFaq(accountType: AccountType) {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      title: 'Add FAQ',
      type: InputDialogTypes.Add,
      subject: '',
      description: ''
    };

    dialogConfig.width = '50%';

    const dialogRef = this.dialog.open(GenericInputDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data: InputDialogData) => {
      if (data != null) {
        this.appDataService.SaveFaq({id: 0, question: data.subject, answer: data.description, accountTypeId: accountType.id}).subscribe(
            (faq) => {
              this.store.dispatch(new FaqAddedSuccess({ faq: faq }));
              this.snackbarService.displaySuccessFeedback("FAQ successfully added.");
            },
            error => {
              this.snackbarService.displayErrorFeedback("Error occurred while adding FAQ.");
              console.log(error);
            }
          );
      }
    });
  }

  editFaq(faq) {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      title: 'Edit FAQ',
      type: InputDialogTypes.Edit,
      subject: faq.question,
      description: faq.answer
    };

    dialogConfig.width = '50%';

    const dialogRef = this.dialog.open(GenericInputDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data: InputDialogData) => {
      if (data != null) {
        this.appDataService.UpdateFaq({id: faq.id, question: data.subject, answer: data.description, accountTypeId: faq.accountTypeId, accountType: faq.accountType}).subscribe(
          (faq) => {
            if (faq !== null && (<Faq>faq).id) {
              this.store.dispatch(new FaqEditedSuccess({ faq: faq }));
              this.snackbarService.displaySuccessFeedback("FAQ edited successfully.");
            }
          },
          error => {
            this.snackbarService.displayErrorFeedback("Error occurred while editing FAQ.");
            console.log(error);
          }
        );
      }
    });
  }

  deleteFaq(faq) {
    if (faq != null) {
      const confirmDialogRef = this.dialog.open(GenericDialogComponent, {
        width: '30%',
        data: {
          title: 'Confim',
          message: 'Are you sure you want to delete this FAQ?', 
          type: DialogTypes.Confirm }
      });

      confirmDialogRef.afterClosed().subscribe(data => {
        if (typeof data === 'boolean' && data === true) {
          this.appDataService.DeleteFaq(faq).subscribe(
            () => {
              console.log(faq);
              this.store.dispatch(new FaqDeletedSuccess({faq : faq}));
              this.snackbarService.displaySuccessFeedback("FAQ successfully deleted.");
            }, error => {
              this.snackbarService.displayErrorFeedback("Error occurred while deleting FAQ.");
            }
          );
        }
      });
    }
  }



}
