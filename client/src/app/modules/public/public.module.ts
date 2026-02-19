import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
// routings
import { RoutingModule } from './routing.module';
// components
import { InitComponent } from './init/init.component';

@NgModule({
  declarations: [InitComponent],
  imports: [SharedModule, RoutingModule],
})
export class PublicModule {}
