import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileUpdateComponent } from 'src/app/components/users/profile/profile-update/profile-update.component';
import { AccountNavComponent } from 'src/app/components/users/accounts/account-nav/account-nav.component';
import { AccountSearchComponent } from 'src/app/components/users/accounts/account-search/account-search.component';
import { AdminGuard } from 'src/app/guards/admin.guard';
import { ProfileViewComponent } from 'src/app/components/users/profile/profile-view/profile-view.component';
import { SupportComponent } from 'src/app/components/users/support/support.component';

const routes: Routes =
[
  {
    path: '', canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'accounts',
        pathMatch: 'full'
      },
      {
        path: 'accounts',
        component: AccountNavComponent,
        children: [
          {
            path: '',
            component: AccountSearchComponent,
            pathMatch: 'full'
          }
        ]
      }
    ]
  },
  {
    path: 'profile',
    children: [
      {
        path: '',
        component: ProfileViewComponent
      },
      {
        path: 'update',
        component: ProfileUpdateComponent
      }
    ]
  },
  {
    path: 'support',
    children: [
      {
        path: '',
        component: SupportComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
