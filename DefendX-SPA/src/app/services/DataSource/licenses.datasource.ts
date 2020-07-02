import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AppState } from '../../reducers';
import { select, Store } from '@ngrx/store';
import { LicenseSearchResult } from 'src/app/models/license/licenseSearchResult';
import { LicensesPageRequested, LicenseSearchEnded, UserLicensesPageRequested } from 'src/app/ngrx/actions/license.actions';
import { selectAllLicensesSearch, selectLicenseSearchPage } from 'src/app/ngrx/selectors/license.selector';
import { PageQuery } from '../../models/app/pageQuery';
import { AbstractDataSource } from './abstract.datasource';

export class LicenseDataSource extends AbstractDataSource<LicenseSearchResult[]> implements DataSource<LicenseSearchResult> {

  private licensesSearchResultsSub: Subscription;
  private queryString: string;
  private ngrxStateChange: boolean;

  constructor(store: Store<AppState>) {
    super(store, new BehaviorSubject<LicenseSearchResult[]>([]));
  }

  // TODO will reload but will also main tain subscriptions which then populate the table
  public load (queryString: string = null, page: PageQuery): void {
    // Prevents multiple observables
    this.unsubscribe();
    // License Search Ended clears ngrx store, which breaks paginiation
    if (this.queryString !== queryString) {
      this.store.dispatch(new LicenseSearchEnded());
      this.subject.next([]);
    }
    this.queryString = queryString;

    this.ngrxStateChange = false;
    
    this.licensesSearchResultsSub = this.store
      .pipe<LicenseSearchResult[]>(
        select(selectLicenseSearchPage(page)),
        tap(licenses => {
          if (this.ngrxStateChange) {
            this.subject.next([]);
          }
          if (licenses.length > 0) {
            this.subject.next(licenses);
          } else {
            if (queryString) {
              this.store.dispatch(new LicensesPageRequested({ queryString, page }));
            } else {
              this.store.dispatch(new UserLicensesPageRequested());
            }
          }
          this.ngrxStateChange = true;
        }),
        catchError(() => of([]))
      ).subscribe();
  }

  protected unsubscribe(): void {
    if (this.licensesSearchResultsSub != null) {
      this.licensesSearchResultsSub.unsubscribe();
    }
  }

  // descruted tabel should auto call disconnect();  error causes this to not happpen
  // disconnectManual() it a temporary solution
  disconnectManual(): void {
    super.disconnectManual();
    this.store.dispatch(new LicenseSearchEnded());
  }

  disconnect(collectionViewer: CollectionViewer): void {
   super.disconnect(collectionViewer);
    this.store.dispatch(new LicenseSearchEnded());
  }

}

