import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ViewChild } from '@angular/core';
import { LicenseDataSource } from 'src/app/services/DataSource/licenses.datasource';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectLicensesSearchLoading, selectLicenseSearchCount } from 'src/app/ngrx/selectors/license.selector';
import { PageQuery } from 'src/app/models/app/pageQuery';
import { tap } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { LicenseSearchResult } from 'src/app/models/license/licenseSearchResult';
import {
  ViewLicenseDialogComponent,
  ViewLicenseDialogActions
} from 'src/app/components/licenses/license-view/view-license-dialog/view-license-dialog.component';
import { isAdmin } from 'src/app/ngrx/selectors/auth.selector';
import { LicenseService } from 'src/app/services/licenses/license.service';
import { SnackbarService } from 'src/app/services/common/snackbar.service';
import { LicensePrintQueueManyAdded, LicenseDeletedMany } from 'src/app/ngrx/actions/license.actions';
import { GenericDialogComponent, DialogTypes } from 'src/app/components/common/generic-dialog/generic-dialog.component';

@Component({
  selector: 'app-license-view',
  templateUrl: './license-view.component.html',
  styleUrls: ['./license-view.component.css']
})
export class LicenseViewComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() queryString: string;

  dataSource: LicenseDataSource;
  public displayedColumns = ['select', 'name', 'dodId', 'service', 'permitNumber', 'isAuthenticated'];
  selectionModel: SelectionModel<LicenseSearchResult>;

  public loading$: Observable<boolean>;
  public totalCount$: Observable<number>;
  public isAdmin$: Observable<boolean>;

  private initialPage: PageQuery = {
    pageIndex: 0,
    pageSize: 10
  };

  constructor(
    public dialog: MatDialog,
    private store: Store<AppState>,
    private snackbarService: SnackbarService,
    private licenseService: LicenseService
  ) { }

  //#region Lifecycle Hook Functions

  ngOnInit() {
    this.loading$ = this.store.pipe(select(selectLicensesSearchLoading));
    this.isAdmin$ = this.store.pipe(select(isAdmin));
    this.totalCount$ = this.store.pipe(select(selectLicenseSearchCount));
    this.dataSource = new LicenseDataSource(this.store);
    this.dataSource.load(null, this.initialPage);
    // used by table to track checkbox selection
    // new SelectionModel<LicenseSearchResult>(allowMultiSelect, initialSelection);
    this.selectionModel = new SelectionModel<LicenseSearchResult>(true, []);
  }

  ngOnDestroy() {
    this.paginator.page.unsubscribe();

    // descruted tabel should auto call disconnect();  error causes this to not happpen
    // disconnectManual() it a temporary solution
    this.dataSource.disconnectManual();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {

      if (property === 'queryString'
        && changes[property].currentValue !== ''
        && changes[property].currentValue != null) {
        this.dataSource.load(changes[property].currentValue, this.initialPage);
      }
    }
  }

  ngAfterViewInit() {

    this.paginator.page
      .pipe(
        tap(() => this.loadLicensesPage())
      )
      .subscribe();
  }

  //#endregion Lifecycle Hook Functions



  /** Whether the number of selected elements matches the total number of rows. */
  public isAllSelected() {
    const numSelected = this.selectionModel.selected.length;
    const numRows = this.dataSource.getData().length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public masterToggle() {
    this.isAllSelected() ?
      this.selectionModel.clear() :
      this.dataSource.getData().forEach(row => this.selectionModel.select(row));
  }

  public onLicenseClick(license: LicenseSearchResult) {
    const dialogRef = this.dialog.open(ViewLicenseDialogComponent, {
      width: '70%',
      autoFocus: false,
      data: { id: license.id }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (Object.values(ViewLicenseDialogActions).includes(data)) {
        switch (data) {
          case ViewLicenseDialogActions.Delete:
            this.dataSource.load(this.queryString, this.initialPage);
            break;
          default: { return; }
        }
      }
    });
  }

  public onAddSelectedToQueue() {
    const selectedIds = this.selectionModel.selected.map(s => s.id);

    if (selectedIds.length < 1) {
      return;
    }

    this.licenseService.addToPrintQueueMany(selectedIds)
      .subscribe(
        () => {
          this.store.dispatch(new LicensePrintQueueManyAdded({ ids: selectedIds }));
          this.snackbarService.displaySuccessFeedback('Successfully added to print queue');
        }, error => {
          this.snackbarService.displayErrorFeedback(error);
        }
      );

  }


  public onDeleteSelectedItems() {
    const selectedIds = this.selectionModel.selected.map(s => s.id);

    if (selectedIds.length < 1) {
      return;
    }

    const confirmDialogRef = this.dialog.open(GenericDialogComponent, {
      width: '30%',
      data: {
        title: 'Confim',
        message: 'Are you sure you want to delete ' + selectedIds.length  + ' selected license(s)?', 
        type: DialogTypes.Confirm }
    });

    confirmDialogRef.afterClosed().subscribe(data => {
      if (typeof data === 'boolean' && data === true) {

        this.licenseService.deleteManyLicenses(selectedIds)
          .subscribe(
            () => {
              this.store.dispatch(new LicenseDeletedMany({ ids: selectedIds }));
              this.snackbarService.displaySuccessFeedback('License successfully deleted');
            }, error => {
              this.snackbarService.displayErrorFeedback(error);
            }
          );
      }
    });
  }

  //#region Private Implementation Functions

  private loadLicensesPage() {
    const newPage: PageQuery = {
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize
    };
    this.dataSource.load(this.queryString, newPage);
  }

  //#endregion Private Implementation Functions
}
