import { Component, OnInit, OnChanges, ViewChild, Input, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { UsersDataSource } from 'src/app/services/DataSource/users.datasource';
import { Observable } from 'rxjs';
import { PageQuery } from 'src/app/models/app/pageQuery';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { UserSearchResult } from 'src/app/models/user/userSearchResult';
import { ViewAccountDialogComponent, ViewAccountDialogData } from './view-account-dialog/view-account-dialog.component';
import { selectUsersSearchLoading, selectUserSearchCount } from 'src/app/ngrx/selectors/user.selector';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() queryString: string;

  dataSource: UsersDataSource;
  displayedColumns = ['name', 'dodId', 'lastLoginDate', 'accountType'];

  loading$: Observable<boolean>;
  totalCount$: Observable<number>;

  initialPage: PageQuery = {
    pageIndex: 0,
    pageSize: 10
  };

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.loading$ = this.store.pipe(select(selectUsersSearchLoading));
    this.totalCount$ = this.store.pipe(select(selectUserSearchCount));
    this.dataSource = new UsersDataSource(this.store);
  }

  ngOnDestroy() {
    this.paginator.page.unsubscribe();

    // descruted tabel should auto call disconnect();  error causes this to not happpen
    // disconnectManual() it a temporary solution
    this.dataSource.disconnectManual();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {

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
        tap(() => this.loadUsersPage())
      )
      .subscribe();
  }

  loadUsersPage() {
    const newPage: PageQuery = {
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize
    };

    this.dataSource.load(this.queryString, newPage);
  }

  viewUser(user: UserSearchResult) {
    const dialogRef = this.dialog.open(ViewAccountDialogComponent, {
      width: '70%',
      autoFocus: false,
      data: { dodId: user.dodId } as ViewAccountDialogData
    });

    dialogRef.afterClosed().subscribe(data => {
        this.loadUsersPage();
    });
  }
}
