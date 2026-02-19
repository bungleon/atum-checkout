import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { RoutingModule } from './routing.module';
import { ManualTransactionComponent } from './manual-transaction.component';
import { NoticeComponent } from './notice/notice.component';
import { DefaultComponent } from './default/default.component';

@NgModule({
  declarations: [
    ManualTransactionComponent,
    NoticeComponent,
    DefaultComponent,
  ],
  imports: [SharedModule, RoutingModule],
})
export class ManualTransactionModule {}
