import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { RoutingModule } from './routing.module';
import { PaymentResultComponent } from './payment-result.component';

@NgModule({
  declarations: [PaymentResultComponent],
  imports: [SharedModule, RoutingModule],
})
export class PaymentResultModule {}
