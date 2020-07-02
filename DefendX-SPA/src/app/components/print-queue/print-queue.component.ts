import { Component, OnInit, OnDestroy } from '@angular/core';
import { License } from '../../models/license/license';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import {
  LicensePrintQueueRequested,
  LicensePrintQueueEntryRemoved,
  AllLicensePrintQueueEntyiesRemoved,
  LicensesPageRequested
} from 'src/app/ngrx/actions/license.actions';
import { select } from '@ngrx/store';
import { selectPrintQueueLicenses, selectLicenseSearchQueryString, selectPrintQueueCount } from 'src/app/ngrx/selectors/license.selector';
import { tap, catchError } from 'rxjs/operators';
import { LicenseService } from 'src/app/services/licenses/license.service';
import { Observable, Subscription, of } from 'rxjs';
import { MatSnackBarConfig, MatSnackBar, MatDialog } from '@angular/material';
import { SnackbarService } from 'src/app/services/common/snackbar.service';
import { GenericDialogComponent, DialogTypes } from 'src/app/components/common/generic-dialog/generic-dialog.component';
import { PrintService } from 'src/app/services/print/print.service';
import { currentUser } from 'src/app/ngrx/selectors/auth.selector';
import { User } from 'src/app/models/user/user';
import {
  ViewLicenseDialogComponent,
  ViewLicenseDialogActions
} from 'src/app/components/licenses/license-view/view-license-dialog/view-license-dialog.component';

@Component({
  selector: 'app-print-queue',
  templateUrl: './print-queue.component.html',
  styleUrls: ['./print-queue.component.css']
})
export class PrintQueueComponent implements OnInit, OnDestroy {
    public queueCount$: Observable<number>;
    printQueueSub: Subscription;
    printQueue: License[];
    removeFromPrintQueueSub: Subscription;
    removeAllSub: Subscription;
    userSub: Subscription;
    user: User;
    private queryStringSub: Subscription;
    private queryString: string;

    private actionDispatched: boolean;

  constructor(
    public dialog: MatDialog,
    private store: Store<AppState>,
    private licensesService: LicenseService,
    private snackbarService: SnackbarService,
    private printService: PrintService
  ) { }

  //#region Lifecycle Hooks Functions

  ngOnInit() {
    // Effect runs before the ngrx store is init, so the request isn't sent
    setTimeout(() => {
      this.store.dispatch(new LicensePrintQueueRequested());
    }, 1000);

    this.actionDispatched = true;

    this.printQueueSub = this.store
    .pipe(
      select(selectPrintQueueLicenses)
    )
    .subscribe(
      (queue) => {
        if (queue.indexOf(undefined) < 0) {
          this.printQueue = queue;
          this.actionDispatched = true;
        } else if ( this.actionDispatched) {
          this.store.dispatch(new LicensePrintQueueRequested());
          this.actionDispatched = false;
        }
      }, error => console.log(error)
    );

    this.userSub = this.store
    .pipe<User>(
      select(currentUser),
      tap( retrievedCurrentUser => {
        this.user = retrievedCurrentUser;
      })
    ).subscribe();

     this.queueCount$ = this.store.pipe(select(selectPrintQueueCount));
  }

  ngOnDestroy() {
    if (this.removeFromPrintQueueSub) {
      this.removeFromPrintQueueSub.unsubscribe();
    }

    if (this.removeAllSub) {
        this.removeAllSub.unsubscribe();
    }

    if (this.queryStringSub) {
      this.queryStringSub.unsubscribe();
    }
    this.printQueueSub.unsubscribe();
    this.userSub.unsubscribe();
  }

  //#endregion Lifecycle Hooks Functions

  //#region Public Interface Functions

  public onPrint(): void {
    if (this.user == null || this.user.signatureData == null || this.user.signatureData == '') {
        const confirmDialogRef = this.dialog.open(GenericDialogComponent, {
          width: '25%',
          data: {
            title: 'No User Signature',
            message: 'You have not yet added a signature.\nPlease add a user signature prior to printing', 
            type: DialogTypes.Message}
        });
        return;
      }

      const successful = this.printService.printLicenses(this.printQueue, this.user);
      if (!successful) {
        const confirmDialogRef = this.dialog.open(GenericDialogComponent, {
          width: '25%',
          data: {
            title: 'Print Failed',
            message: 'Ensure all licenses are authenticated prior to printing', 
            type: DialogTypes.Message}
        });
      }
  }

  public onRemove(licenseId: number) {
    this.removeFromPrintQueueSub = this.licensesService.removeFromPrintQueue(licenseId)
      .subscribe(
        () => {
          this.store.dispatch(new LicensePrintQueueEntryRemoved({licenseId}));
          this.snackbarService.displaySuccessFeedback('License Successfully Removed');
        }, error => {
            this.snackbarService.displayErrorFeedback(error);
        }
      );
  }

  public onRemoveAll(): void {
    const confirmDialogRef = this.dialog.open(GenericDialogComponent, {
        width: '25%',
        data: {title: 'Confirm', message: 'Are you sure you want to clear license print queue?', type: DialogTypes.Confirm}
      });
  
    confirmDialogRef.afterClosed().subscribe(data => {
        if ( typeof data === 'boolean' && data === true ) {
            this.removeAllSub = this.licensesService.removeAllFromPrintQueue()
              .subscribe(
                  () => {
                      this.store.dispatch(new AllLicensePrintQueueEntyiesRemoved());
                      this.snackbarService.displaySuccessFeedback('Queue Successfully Cleared');
                  }, error => {
                      this.snackbarService.displayErrorFeedback(error);
                  }
              );
        }
      });

  }

  public onLicenseClick(license: License) {
    const dialogRef = this.dialog.open(ViewLicenseDialogComponent, {
      width: '70%',
      autoFocus: false,
      data: { id: license.id }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (Object.values(ViewLicenseDialogActions).includes(data)) {
        switch (data) {
          case ViewLicenseDialogActions.Delete:
            this.store.pipe(select(selectLicenseSearchQueryString))
              .subscribe(
                (queryString) => {
                  if (queryString) {
                    this.store.dispatch(new LicensesPageRequested({
                        queryString,
                        page: {
                          pageIndex: 0,
                          pageSize: 10
                        }
                      })
                    );
                  }
                }
              );
            break;
          default: { return; }
        }
      }
    });
  }

  //#endregion Public Interface Functions
}
