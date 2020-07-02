import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LicenseViewComponent } from 'src/app/components/licenses/license-view/license-view.component';
import { LicenseSearchComponent } from 'src/app/components/licenses/license-search/license-search.component';
import { LicenseNavComponent } from 'src/app/components/licenses/license-nav/license-nav.component';
import { LicenseAddEditComponent } from '../../components/licenses/license-addEdit/license-addEdit.component';
import { LicenseResolver } from 'src/app/resolvers/license.resolver';

// TODO add param to :id route to pass in object
const routes: Routes =
[
  {
    path: '',
    component: LicenseNavComponent,
    children: [
      {
        path: '',
        component: LicenseSearchComponent,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'edit',
    children: [
      {
        path: '',
        component: LicenseAddEditComponent
      },
      {
        path: ':id',
        component: LicenseAddEditComponent,
        resolve: {
          license: LicenseResolver
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicensesRoutingModule { }
