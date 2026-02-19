import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserInfoComponent } from './user-info.component';

const routes: Routes = [
  {
    path: '',
    component: UserInfoComponent,
    data: { routeConfig: 'user-info' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
