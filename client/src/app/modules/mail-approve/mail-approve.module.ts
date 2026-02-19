import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { MailApproveComponent } from './mail-approve.component';
import { RoutingModule } from './routing.module';

@NgModule({
  declarations: [MailApproveComponent],
  imports: [SharedModule, RoutingModule],
})
export class MailApproveModule {}
