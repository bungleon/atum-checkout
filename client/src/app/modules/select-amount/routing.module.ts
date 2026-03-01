import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectAmountComponent } from './select-amount.component';

const routes: Routes = [
  {
    path: '',
    component: SelectAmountComponent,
    data: { routeConfig: 'select-amount' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
