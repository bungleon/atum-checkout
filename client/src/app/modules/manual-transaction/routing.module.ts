import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManualTransactionComponent } from './manual-transaction.component';
const routes: Routes = [
  {
    path: '',
    component: ManualTransactionComponent,
    data: { routeConfig: 'manual-transaction' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
