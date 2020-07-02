import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { SupportComponent } from 'src/app/components/users/support/support.component';

const appRoutes: Routes = [
  {
    path: '', canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'licenses', pathMatch: 'full' },
      {
        path: 'licenses',
        loadChildren: 'src/app/modules/licenses/licenses.module#LicensesModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'users',
        loadChildren: 'src/app/modules/users/users.module#UsersModule',
        canActivate: [AuthGuard]
      }
    ]
}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
