import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { RoutingModule } from './routing.module';
import { AccountComponent } from './account.component';

@NgModule({
  declarations: [AccountComponent],
  imports: [SharedModule, RoutingModule],
})
export class AccountModule {}
