import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { LoginComponent } from './login.component';
import { RoutingModule } from './routing.module';
import { FaceIdModalComponent } from './face-id-modal/face-id-modal.component';
import { ForgotPasswordModalComponent } from './forgot-password/forgot-password-modal.component';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordModalComponent,
    FaceIdModalComponent,
  ],
  imports: [SharedModule, RoutingModule],
})
export class LoginModule {}
