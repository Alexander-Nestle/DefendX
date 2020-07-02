import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthModule } from 'src/app/modules/auth/auth.module';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from 'src/app/modules/app-routing/app-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorInterceptorProvider } from 'src/app/common/error.interceptor';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatExpansionModule, MatSnackBarModule, MatDialogModule, MatGridListModule, MatDividerModule, MatProgressSpinnerModule, MatProgressBarModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { PrintQueueComponent } from './components/print-queue/print-queue.component';
import { GenericDialogComponent } from 'src/app/components/common/generic-dialog/generic-dialog.component';
import { SnackbarService } from 'src/app/services/common/snackbar.service';
import { ViewLicenseDialogComponent } from 'src/app/components/licenses/license-view/view-license-dialog/view-license-dialog.component';
import { ProgressbarService } from 'src/app/services/common/progressbar.service';
import { AdminGuard } from 'src/app/guards/admin.guard';
import { PendingScanDialogComponent } from 'src/app/components/common/pending-scan-dialog/pending-scan-dialog.component';
import { AppDataService } from './services/common/appData.service';
import { servicesReducer } from './ngrx/reducers/service.reducer';
import { unitsReducer } from './ngrx/reducers/unit.reducer';
import { GenericInputDialogComponent } from 'src/app/components/common/generic-input-dialog/generic-input-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export function getAccessToken(): string {
  return localStorage.getItem('token');

}

export const jwtConfig = {
  tokenGetter: getAccessToken,
  whitelistedDomains: ['localhost:5000']
};


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PrintQueueComponent,
    GenericDialogComponent,
    GenericInputDialogComponent,
    ViewLicenseDialogComponent,
    PendingScanDialogComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatExpansionModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatGridListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTableModule,
    MatSortModule,
    JwtModule.forRoot({
      config: jwtConfig
    }),
    AuthModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
    StoreModule.forFeature('services', servicesReducer),
    StoreModule.forFeature('units', unitsReducer)
  ],
  providers: [
    ErrorInterceptorProvider,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 5000}},
    SnackbarService,
    ProgressbarService,
    AppDataService,
    AdminGuard
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    GenericDialogComponent,
    GenericInputDialogComponent,
    ViewLicenseDialogComponent,
    PendingScanDialogComponent
  ]
})
export class AppModule { }
