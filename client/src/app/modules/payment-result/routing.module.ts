import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentResultComponent } from './payment-result.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentResultComponent,
    data: { routeConfig: 'payment-result' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
