import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
// routings
import { RoutingModule } from './routing.module';
// components
import { InitDepositComponent } from './init/init-deposit.component';

@NgModule({
  declarations: [InitDepositComponent],
  imports: [SharedModule, RoutingModule],
})
export class InitDepositModule {}
