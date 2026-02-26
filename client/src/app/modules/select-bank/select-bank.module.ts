import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { RoutingModule } from './routing.module';
import { SelectBankComponent } from './select-bank.component';

@NgModule({
  declarations: [SelectBankComponent],
  imports: [SharedModule, RoutingModule],
})
export class SelectBankModule {}
