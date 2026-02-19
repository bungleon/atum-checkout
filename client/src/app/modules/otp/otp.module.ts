import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { RoutingModule } from './routing.module';
import { OtpComponent } from './otp.component';
import { MobileApproveComponent } from './mobile-approve/mobile-approve.component';
import { SmsApproveComponent } from './sms-approve/sms-approve.component';
import { EmailOtpComponent } from './email-otp/email-otp.component';
@NgModule({
  declarations: [
    OtpComponent,
    MobileApproveComponent,
    SmsApproveComponent,
    EmailOtpComponent,
  ],
  imports: [SharedModule, RoutingModule],
})
export class OtpModule {}
