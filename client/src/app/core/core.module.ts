import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// modules
import { SharedModule } from '@shared/shared.module';
// configs
import { routeConfig, systemConfig } from './configs/index';

@NgModule({
  imports: [RouterModule, FormsModule, HttpClientModule, SharedModule],

  providers: [
    { provide: 'routeConfig', useValue: routeConfig },
    { provide: 'systemConfig', useValue: systemConfig },
  ],
})
export class CoreModule {}
