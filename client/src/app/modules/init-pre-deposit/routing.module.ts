import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitDepositComponent } from '@modules/init-deposit/init/init-deposit.component';
import {InitPreDepositComponent} from "@modules/init-pre-deposit/init/init-pre-deposit.component";

const routes: Routes = [
  {
    path: '',
    component: InitPreDepositComponent,
    data: { routeConfig: 'initialize-pre-deposit' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
