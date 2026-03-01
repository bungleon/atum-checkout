import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { RoutingModule } from './routing.module';
import { SelectAmountComponent } from './select-amount.component';

@NgModule({
  declarations: [SelectAmountComponent],
  imports: [SharedModule, RoutingModule],
})
export class SelectAmountModule {}
