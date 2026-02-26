import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectBankComponent } from './select-bank.component';

const routes: Routes = [
  {
    path: '',
    component: SelectBankComponent,
    data: { routeConfig: 'select-bank' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
