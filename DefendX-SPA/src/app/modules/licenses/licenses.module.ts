import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule, MatNativeDateModule, MatDialogModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { LicensesRoutingModule } from './licenses-routing.module';
import { LicenseViewComponent } from 'src/app/components/licenses/license-view/license-view.component';
import { LicenseNavComponent } from 'src/app/components/licenses/license-nav/license-nav.component';
import { LicenseSearchComponent } from 'src/app/components/licenses/license-search/license-search.component';
import { LicenseAddEditComponent } from 'src/app/components/licenses/license-addEdit/license-addEdit.component';
import { FilterOptionsPipe } from 'src/app/pipes/filterOptions.pipe';
import { StoreModule } from '@ngrx/store';
import { AppDataEffects } from '../../ngrx/effects/appData.effects';
import { EffectsModule } from '@ngrx/effects';
import { SortPipe } from '../../pipes/sort.pipe';
import { LicenseService } from 'src/app/services/licenses/license.service';
import { licensesReducer } from '../../ngrx/reducers/license.reducer';
import { licensesSearchReducer } from 'src/app/ngrx/reducers/license-search.reducer';
import { LicenseEffects } from 'src/app/ngrx/effects/license.effects';
import { RequiredIfDirective } from 'src/app/directives/RequiredIfDirective.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatGridListModule,
    MatDividerModule,
    MatDialogModule,
    LicensesRoutingModule,
    StoreModule.forFeature('licenses', licensesReducer),
    StoreModule.forFeature('licensesSearch', licensesSearchReducer),
    EffectsModule.forFeature([AppDataEffects]),
    EffectsModule.forFeature([LicenseEffects])
  ],
  declarations: [
    LicenseNavComponent,
    LicenseViewComponent,
    LicenseSearchComponent,
    LicenseAddEditComponent,
    RequiredIfDirective,
    FilterOptionsPipe,
    SortPipe
  ],
  providers: [
    LicenseService
  ]
})
export class LicensesModule { }
