import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileUpdateComponent } from 'src/app/components/users/profile/profile-update/profile-update.component';
import { UsersRoutingModule } from 'src/app/modules/users/users-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBarModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatDialogModule,
  MatGridListModule,
  MatDividerModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatExpansionModule
} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UsersService } from 'src/app/services/users/users.service';
import { AccountViewComponent } from 'src/app/components/users/accounts/account-view/account-view.component';
import { AccountSearchComponent } from 'src/app/components/users/accounts/account-search/account-search.component';
import { AccountNavComponent } from 'src/app/components/users/accounts/account-nav/account-nav.component';
import {
  ViewAccountDialogComponent
} from 'src/app/components/users/accounts/account-view/view-account-dialog/view-account-dialog.component';
import { StoreModule } from '@ngrx/store';
import { usersReducer } from 'src/app/ngrx/reducers/user.reducer';
import { usersSearchReducer } from 'src/app/ngrx/reducers/user-search.reducer';
import { UserEffects } from 'src/app/ngrx/effects/user.effects';
import { EffectsModule } from '@ngrx/effects';
import { accountTypesReducer } from 'src/app/ngrx/reducers/accountType.reducer';
import { AppDataEffects } from 'src/app/ngrx/effects/appData.effects';
import { ProfileViewComponent } from 'src/app/components/users/profile/profile-view/profile-view.component';
import { SupportComponent } from '../../components/users/support/support.component';
import { RequestAccounttypeDialogComponent } from 'src/app/components/users/profile/request-accounttype-dialog/request-accounttype-dialog.component';
import { TruncatePipe } from 'src/app/pipes/truncate.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UsersRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatDialogModule,
    MatGridListModule,
    MatDividerModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatExpansionModule,
    StoreModule.forFeature('users', usersReducer),
    StoreModule.forFeature('usersSearch', usersSearchReducer),
    StoreModule.forFeature('accountTypes', accountTypesReducer),
    EffectsModule.forFeature([UserEffects]),
    EffectsModule.forFeature([AppDataEffects])
  ],
  declarations: [
    ProfileUpdateComponent,
    ProfileViewComponent,
    AccountNavComponent,
    AccountSearchComponent,
    AccountViewComponent,
    ViewAccountDialogComponent,
    SupportComponent,
    RequestAccounttypeDialogComponent,
    TruncatePipe
  ],
  providers: [
    UsersService
  ],
  entryComponents: [
      ViewAccountDialogComponent,
      RequestAccounttypeDialogComponent
  ]
})
export class UsersModule { }
