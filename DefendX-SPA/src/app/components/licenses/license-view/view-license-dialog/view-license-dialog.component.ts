import { Component, OnInit, Inject, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { Store } from '@ngrx/store';
import { LicenseService } from 'src/app/services/licenses/license.service';
import { AppState } from 'src/app/reducers';
import { License } from 'src/app/models/license/license';
import { select } from '@ngrx/store';
import { selectLicenseById, selectLicenseRequestLoading } from 'src/app/ngrx/selectors/license.selector';
import { LicenseRequested, LicenseDeleted, LicensePrintQueueEntryAdded } from 'src/app/ngrx/actions/license.actions';
import { tap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { GenericDialogComponent, DialogTypes } from 'src/app/components/common/generic-dialog/generic-dialog.component';
import { PrintService } from 'src/app/services/print/print.service';
import { User } from 'src/app/models/user/user';
import { currentUser, isAdmin } from 'src/app/ngrx/selectors/auth.selector';
import { SnackbarService } from 'src/app/services/common/snackbar.service';
import { Router } from '@angular/router';
import { LicenseIssue } from 'src/app/models/license/licenseIssue';

export interface ViewLicenseDialogData {
  id: number;
}

export enum ViewLicenseDialogActions {
  Print = 'print',
  AddtoQueue = 'printQueue',
  Delete = 'delete',
  Edit = 'edit'
}

@Component({
  selector: 'app-view-license-dialog',
  templateUrl: './view-license-dialog.component.html',
  styleUrls: ['./view-license-dialog.component.css']
})
export class ViewLicenseDialogComponent implements OnInit, OnDestroy {
  @ViewChild('cnv') myCanvas: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  public context: CanvasRenderingContext2D;
  public displayedColumns = ['user', 'issueDate'];
  public dataSource: MatTableDataSource<LicenseIssue>;
  public loading$: Observable<boolean>;
  public isAdminSub: Subscription;
  public isAdmin: boolean;
  public readonly SPACE_HTML = '<p>&nbsp</p>';

  private licenseSub: Subscription;
  public retrievedLicense: License;

  private userSub: Subscription;
  private user: User;
  private id: number;

  // TODO unsub from obervables
  constructor(
    public dialog: MatDialog,
    private store: Store<AppState>,
    private snackbarService: SnackbarService,
    private licenseService: LicenseService,
    private printService: PrintService,
    private router: Router,
    private dialogRef: MatDialogRef<ViewLicenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: ViewLicenseDialogData
  ) {
    this.id = data.id;
  }

  ngOnInit() {
    this.loading$ = this.store.pipe(select(selectLicenseRequestLoading));
    this.isAdminSub = this.store.pipe(select(isAdmin)).subscribe((isAdmin) => this.isAdmin = isAdmin);

    this.licenseSub = this.store
    .pipe<License>(
      select(selectLicenseById(this.id)),
      tap(license => {
        if (license != null) {
          this.retrievedLicense = license;
          this.initDataSource();
        } else {
          this.store.dispatch(new LicenseRequested({ id: this.id }));
        }
      })
    ).subscribe(license => {
      if (license) {
        this.sigLoad();
      }
    }
  );

  this.userSub = this.store
    .pipe<User>(
      select(currentUser),
      tap( retrievedCurrentUser => {
        this.user = retrievedCurrentUser;
      })
    ).subscribe();
}

ngOnDestroy(): void {
  this.licenseSub.unsubscribe();
  this.userSub.unsubscribe();
  this.isAdminSub.unsubscribe();
}

private initDataSource(): void{
  this.dataSource = new MatTableDataSource(this.retrievedLicense.issues);
  this.dataSource.sort = this.sort;
  this.dataSource.sortingDataAccessor = (item, property) => {
    switch (property) {
      case 'issueDate': return new Date(item.issueDate);
      case 'user': return item.user.lastName;
      default: return item[property];
    }
  };
}

sigLoad(): void {
  setTimeout(() => {
    if (this.retrievedLicense.signatureData == null) {
      return;
      }

      this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
      let image = new Image();
      image.onload = () => {
        this.context.drawImage(image, 0, 0);
      };
      image.src = this.retrievedLicense.signatureData;
    }, 10);
  }

  onDelete() {
    const confirmDialogRef = this.dialog.open(GenericDialogComponent, {
      width: '25%',
      data: {title: 'Confim', message: 'Are you sure you want to delete this license?', type: DialogTypes.Confirm}
    });

    confirmDialogRef.afterClosed().subscribe(data => {
      if ( typeof data === 'boolean' && data === true ) {
        this.dialogRef.close(ViewLicenseDialogActions.Delete);

        this.licenseService
        .deleteLicense(this.retrievedLicense.id).subscribe(
          () => {
            this.licenseSub.unsubscribe();
            this.store.dispatch(new LicenseDeleted({ id: this.retrievedLicense.id }));
            this.snackbarService.displaySuccessFeedback('Delete Successful');
            this.dialogRef.close(ViewLicenseDialogActions.Delete);
          }, error => {
            this.snackbarService.displayErrorFeedback(error);
          }
        );
      }
    });
  }

  onEdit() {
    this.router.navigate(['/licenses/edit', this.retrievedLicense.id]);
    this.dialogRef.close(ViewLicenseDialogActions.Edit);
  }

  onPrint() {
    if (this.user == null || this.user.signatureData == null || this.user.signatureData === '') {
      const confirmDialogRef = this.dialog.open(GenericDialogComponent, {
        width: '25%',
        data: {
          title: 'No User Signature',
          message: 'You have not yet added a signature.\nPlease add a user signature prior to printing', 
          type: DialogTypes.Message}
      });
      return;
    }

    if (this.retrievedLicense.signatureData == null || this.retrievedLicense.signatureData === '') {
      const dialogRef = this.dialog.open(GenericDialogComponent, {
        width: '18%',
        data: {title: 'Missing Signature', message: 'License signature is required prior to printing', type: DialogTypes.Message}
      });
      return;
    }
    const successful = this.printService.printLicenses([this.retrievedLicense], this.user);
    if (!successful) {
      const confirmDialogRef = this.dialog.open(GenericDialogComponent, {
        width: '25%',
        data: {
          title: 'Print Failed',
          message: 'Ensure license is authenticated prior to printing', 
          type: DialogTypes.Message}
      });
    }
  }

  onAddToQueue() {
    if (this.retrievedLicense.signatureData == null || this.retrievedLicense.signatureData === '') {
      const dialogRef = this.dialog.open(GenericDialogComponent, {
        width: '18%',
        data: {title: 'Missing Signature', message: 'License signature is required prior to printing', type: DialogTypes.Message}
      });
      return;
    }

    this.licenseService
      .addToPrintQueue(this.retrievedLicense.id).subscribe(
        () => {
          this.store.dispatch(new LicensePrintQueueEntryAdded({ id: this.retrievedLicense.id}));
          this.snackbarService.displaySuccessFeedback('Successfully Added to Queue');
          this.dialogRef.close(ViewLicenseDialogActions.AddtoQueue);
        },  error => {
          this.snackbarService.displayErrorFeedback(error);
        }
      );
  }
}
