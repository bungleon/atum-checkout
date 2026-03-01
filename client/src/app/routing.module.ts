import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '@shared/components/not-found/not-found.component';
import { UnauthorizedComponent } from '@shared/components/unauthorized/unauthorized.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'otp',
    loadChildren: () =>
      import('./modules/otp/otp.module').then((m) => m.OtpModule),
  },
  {
    path: 'accounts',
    loadChildren: () =>
      import('./modules/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'payment-result',
    loadChildren: () =>
      import('./modules/payment-result/payment-result.module').then(
        (m) => m.PaymentResultModule
      ),
  },
  {
    path: 'manual-transaction',
    loadChildren: () =>
      import('./modules/manual-transaction/manual-transaction.module').then(
        (m) => m.ManualTransactionModule
      ),
  },
  {
    path: 'user-info',
    loadChildren: () =>
      import('./modules/user-info/user-info.module').then(
        (m) => m.UserInfoModule
      ),
  },
  {
    path: 'select-bank',
    loadChildren: () =>
      import('./modules/select-bank/select-bank.module').then(
        (m) => m.SelectBankModule
      ),
  },
  {
    path: 'select-amount',
    loadChildren: () =>
      import('./modules/select-amount/select-amount.module').then(
        (m) => m.SelectAmountModule
      ),
  },
  {
    path: 'mail-approve',
    loadChildren: () =>
      import('./modules/mail-approve/mail-approve.module').then(
        (m) => m.MailApproveModule
      ),
  },
  {
    path: 'initialize-deposit/:id',
    loadChildren: () =>
      import('@modules/init-deposit/init-deposit.module').then((m) => m.InitDepositModule),
  },
  {
    path: 'initialize-pre-deposit/:id',
    loadChildren: () =>
      import('@modules/init-pre-deposit/init-pre-deposit.module').then((m) => m.InitPreDepositModule),
  },
  {
    path: '**',
    redirectTo: '404',
  },
  {
    path: '404',
    component: NotfoundComponent,
  },
  {
    path: '401',
    component: UnauthorizedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
