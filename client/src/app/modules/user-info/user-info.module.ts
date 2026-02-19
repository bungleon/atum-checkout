import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { UserInfoComponent } from './user-info.component';
import { RoutingModule } from './routing.module';
import { SelectAccountComponent } from './select-account/select-account.component';

@NgModule({
  declarations: [UserInfoComponent, SelectAccountComponent],
  imports: [SharedModule, RoutingModule],
})
export class UserInfoModule {}
