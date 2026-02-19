import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MailApproveComponent } from './mail-approve.component';

const routes: Routes = [
  {
    path: '',
    component: MailApproveComponent,
    data: { routeConfig: 'mail-approve' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
