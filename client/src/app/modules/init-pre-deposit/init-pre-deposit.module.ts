import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
// routings
import { RoutingModule } from './routing.module';
// components
import { InitPreDepositComponent } from './init/init-pre-deposit.component';

@NgModule({
  declarations: [InitPreDepositComponent],
  imports: [SharedModule, RoutingModule],
})
export class InitPreDepositModule {}
