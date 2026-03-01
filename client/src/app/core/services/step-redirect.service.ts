import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, RouteService, AuthService } from '@shared/services/';
import { TransactionsService } from '@core/http/transaction/transaction.service';
import { finalize, take } from 'rxjs';
import { OtpService, StateService, LoadingService } from '@shared/services/';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class StepService {
  constructor(
    private router: Router,
    private stateService: StateService,
    private storageService: StorageService,
    private transactionsService: TransactionsService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private translateService: TranslateService,
    private otpService: OtpService,
    private _ngZone: NgZone
  ) {}
  redirect(data: any) {
    switch (data['nextStep']) {
      case 'LOGIN':
      case 'LOGIN_INPUTS':
        this.router.navigate(['/login']);
        return true;
      case 'OTP':
        this.otpService.setOtpData(data);
        this.router.navigate(['/otp']);
        return true;
      case 'ACCOUNT':
        this.router.navigate(['/accounts']);
        return true;
      case 'GET_USER_INFO':
        this.router.navigate(['/user-info']);
        return true;
      case 'MANUAL_TRANSACTION':
        this.router.navigate(['/manual-transaction'], {
          queryParams: { id: data.id },
        });
        return true;
      case 'CHECK_NEXT_FLOW':
        const transactionData = this.authService.auth;
        if (transactionData.id) {
          this.loadingService.loading$.next(true);
          this.translateService
            .get('flow_change_loading_message', {
              value: transactionData.nextFlow ?? 'MANUAL',
            })
            .pipe(take(1))
            .subscribe((res: string) =>
              this.loadingService.loadingText$.next(res)
            );

          this.transactionsService
            .checkNextFlow(transactionData.id)
            .pipe(take(1))
            .pipe(
              finalize(() => {
                this.loadingService.loading$.next(false);
                this.loadingService.loadingText$.next('');
              })
            )
            .subscribe({
              next: (res) => {
                const auth = {
                  id: transactionData.id,
                  ...this.authService.auth,
                  ...res,
                };
                this.authService.auth = auth;
                this.redirect(res);
              },
              error: (err: any) => {
                let _err = { ...err['error'] };
                if (data['message']) {
                  _err = {
                    ...err['error'],
                    ...{ message: data.message },
                  };
                }
                this.onStepError(_err);
              },
            });
          return true;
        } else {
          this.onStepError();
          return true;
        }
      case 'MANUAL_CHECK':
        this.stateService.data = data;
        this.router.navigate(['/payment-result'], {
          queryParams: { type: data['nextStep'] },
        });
        return true;
      case 'TRANSFER':
        const _data = this.authService.auth;
        if (_data.id) {
          this.loadingService.loading$.next(true);
          this.transactionsService
            .transferPapara(_data.id)
            .pipe(take(1))
            .pipe(
              finalize(() => {
                this.loadingService.loading$.next(false);
                this.loadingService.loadingText$.next('');
              })
            )
            .subscribe((res) => {
              const auth = { id: _data.id, ...this.authService.auth, ...res };
              this.authService.auth = auth;
              this.redirect(res);
            });
          return true;
        } else {
          this.onStepError();
          return true;
        }
      case 'MAIL_APPROVE':
        this.router.navigate(['/mail-approve'], {
          queryParams: { timeout: data.timeout },
        });
        return true;
      case 'SUCCESS':
      case 'MANUAL_TRANSACTION_RESULT_DONE':
        this.stateService.data = data;
        this.router.navigate(['/payment-result'], {
          queryParams: { type: data['nextStep'] },
        });
        return true;
      case 'BANK_SELECT':
        this.router.navigate(['/select-bank'], {
          queryParams: { timeout: data.timeout },
        });
        return true;
      case 'AMOUNT_SELECT':
        this.router.navigate(['/select-amount'], {
          queryParams: { timeout: data.timeout },
        });
        return true;
      case 'ERROR':
      case 'DECLINED':
      case 'MANUAL_TRANSACTION_RESULT_DECLINED':
      case 'USER_CANCELLED':
      default:
        this._ngZone.run(() => {
          this.stateService.data = data;
          this.router.navigate(['/payment-result'], {
            queryParams: { type: data['nextStep'] },
          });
        });
        return true;
    }
  }
  isStep(data: any = {}, step: string) {
    if (!data.hasOwnProperty('nextStep') || data['nextStep'] === step) {
      return true;
    }
    return false;
  }
  onStepError(
    data: any = { nextStep: 'ERROR', message: 'İşleminize devam edilemiyor.' }
  ) {
    this.redirect(data);
  }
}
