import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtherDetailComponent } from './modules/main/routes/other/other-detail/other-detail.component';
import { OtherListComponent } from './modules/main/routes/other/other-list/other-list.component';
import { UserListComponent } from './modules/main/routes/user/user-list/user-list.component';

const appRoutes: Routes = [

  { path: 'user', component: UserListComponent },
  { path: 'others/:entity', component: OtherListComponent },
  { path: 'others/:entity/:id', component: OtherDetailComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
