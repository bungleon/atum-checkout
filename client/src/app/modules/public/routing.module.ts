import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitComponent } from '@app/modules/public/init/init.component';

// components
import { UnauthorizedComponent } from '@app/shared/components/unauthorized/unauthorized.component';
import { NotfoundComponent } from '@shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: InitComponent,
    data: { routeConfig: 'initialize' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
