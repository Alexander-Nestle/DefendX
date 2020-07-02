import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { UserSearchResult } from 'src/app/models/user/userSearchResult';
import { AppState } from 'src/app/reducers';
import { Store } from '@ngrx/store';
import { AbstractDataSource } from './abstract.datasource';
import { BehaviorSubject, Subscription, of } from 'rxjs';
import { PageQuery } from 'src/app/models/app/pageQuery';
import { UserSearchEnded, UserAccountsPageRequested } from 'src/app/ngrx/actions/user.actions';
import { select } from '@ngrx/store';
import { selectUserSearchPage } from 'src/app/ngrx/selectors/user.selector';
import { tap, catchError } from 'rxjs/operators';


export class UsersDataSource extends AbstractDataSource<UserSearchResult[]> implements DataSource<UserSearchResult> {

    private usersSearchResultsSub: Subscription;

    constructor(store: Store<AppState>) {
        super(store, new BehaviorSubject<UserSearchResult[]>([]));
    }

    public load (queryString: string, page: PageQuery): void {
        // Clears memory of previous search
        this.unsubscribe();
        this.store.dispatch(new UserSearchEnded());
        this.subject.next([]);

        this.usersSearchResultsSub = this.store
          .pipe<UserSearchResult[]>(
            select(selectUserSearchPage(queryString, page)),
            tap(users => {
              // TODO if params == null
              if (users.length > 0) {
                this.subject.next(users);
              } else {
                this.store.dispatch(new UserAccountsPageRequested({ queryString, page }));
              }
            }),
            catchError(() => of([]))
          ).subscribe();
      }

      protected unsubscribe(): void {
        if (this.usersSearchResultsSub != null) {
          this.usersSearchResultsSub.unsubscribe();
        }
      }

      // descruted tabel should auto call disconnect();  error causes this to not happpen
      // disconnectManual() it a temporary solution
      disconnectManual(): void {
        super.disconnectManual();
        this.store.dispatch(new UserSearchEnded());
      }

      disconnect(collectionViewer: CollectionViewer): void {
       super.disconnect(collectionViewer);
        this.store.dispatch(new UserSearchEnded());
      }

}

