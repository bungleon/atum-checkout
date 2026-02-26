import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitDepositComponent } from '@modules/init-deposit/init/init-deposit.component';

const routes: Routes = [
  {
    path: '',
    component: InitDepositComponent,
    data: { routeConfig: 'initialize-deposit' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
