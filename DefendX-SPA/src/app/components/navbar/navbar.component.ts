import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { Logout } from 'src/app/ngrx/actions/auth.actions';
import { Observable } from 'rxjs';
import { select } from '@ngrx/store';
import { isLoggedIn, isAdmin } from 'src/app/ngrx/selectors/auth.selector';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public isAdmin$: Observable<boolean>;

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.isAdmin$ = this.store.pipe(select(isAdmin));

  // this.isLoggedOut$ = this.store
  //   .pipe(
  //     select(isLoggedOut)
  //   );
  }

  onLogout() {
    this.store.dispatch(new Logout());
  }

}
