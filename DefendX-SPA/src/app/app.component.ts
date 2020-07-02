import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/reducers';
import { select, Store } from '@ngrx/store';
import { isLoggedIn, isAdmin } from 'src/app/ngrx/selectors/auth.selector';
import { ProgressbarService } from 'src/app/services/common/progressbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'DefendX';
  public progress: number;
  public isLoggedIn$: Observable<boolean>;
  public isAdmin$: Observable<boolean>;
  private progressbarSub: Subscription;

  constructor(
    private store: Store<AppState>,
    private progressbarService: ProgressbarService
  ) {}

  //#region Lifecycle Hook Functions

  ngOnInit() {
    this.progress = 0;
    this.progressbarSub = this.progressbarService.currentProgress.subscribe(p =>
      {
        this.progress = p;
      } );
    this.isLoggedIn$ = this.store.pipe(select(isLoggedIn));

    this.isAdmin$ = this.store.pipe(select(isAdmin));
  }

  ngOnDestroy() {
    this.progressbarSub.unsubscribe();
  }

  //#endregion Lifecycle Hook Functions


}
