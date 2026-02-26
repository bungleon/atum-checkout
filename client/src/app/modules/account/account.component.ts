import {Component, OnDestroy, OnInit} from '@angular/core';
import {StepService} from '@core/services/step-redirect.service';
import {AuthService, OtpService, RouteService, StorageService,} from '@shared/services/';
import {TransactionsService} from '@core/http/index';
import {exhaustMap, finalize, of, take} from 'rxjs';
import {ConfirmModalComponent} from "@shared/components/confirm-modal/confirm-modal.component";
import {BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit, OnDestroy {
  constructor(
    public transactionsService: TransactionsService,
    public stepService: StepService,
    public storageService: StorageService,
    public bsModalService: BsModalService,
    private authService: AuthService,
    private otpService: OtpService
  ) {
    this.transactionData = this.authService.auth;
  }

  loading = false;
  transactionData = null;
  accountResponse = null;
  accounts = null;
  buttonValue = null;
  cancelTransactionValue = null;
  accountId = null;

  ngOnInit() {
    this.loading = true;
    if (!this.transactionData) {
      this.stepService.onStepError();
      return;
    }
    this.onLoad();
  }

  onLoad() {
    const getStep$ = this.transactionsService.getStep(
      this.transactionData['id']
    );
    const getAccount$ = this.transactionsService.accounts(
      this.transactionData['id']
    );
    getStep$
      .pipe(
        exhaustMap((res) => {
          if (!this.stepService.isStep(res, 'ACCOUNT')) {
            return of(true);
          }
          return of(false);
        })
      )
      .pipe(
        exhaustMap((hasError) => {
          if (hasError) {
            return of(false);
          }
          return getAccount$;
        })
      )
      .pipe(finalize(() => (this.loading = false)))
      .pipe(take(1))
      .subscribe((res) => {
        if (!res) {
          return this.stepService.onStepError({...res, nextStep: 'ERROR'});
        }
        this.buttonValue =res.messages.continueButton;
        this.cancelTransactionValue =res.messages.cancelTransaction;
        this.accounts = res.accounts;
        this.accountResponse = res;
      });
  }

  onSubmit(): void {
    this.loading = true;
    this.transactionsService
      .transfer(this.transactionData['id'], {
        accountId: this.accountId,
      })
      .pipe(finalize(() => (this.loading = false)))
      .pipe(take(1))
      .subscribe((res) => {
        if (this.stepService.isStep(res, 'ERROR')) {
          this.onError(res);
          return;
        }
        if (this.stepService.isStep(res, 'OTP')) {
          this.otpService.setOtpData({
            id: this.transactionData['id'],
            ...res,
          });
        }
        this.stepService.redirect(res);
      });
  }

  onError(data: any = {nextStep: 'ERROR'}) {
    data = {
      ...data,
      id: this.transactionData?.id,
    };
    this.stepService.redirect(data);
  }

  backToMerchant() {
    const confirmModal = this.bsModalService.show(ConfirmModalComponent, {
      class: 'modal-dialog-centered modal-md modal-confirm',
      initialState: {
        initialParams: {
          content: this.accountResponse.messages.manualTransferWarningAfterDeclined,
          buttons: this.accountResponse
        },
      },
    });
    confirmModal.content.onClose.pipe(take(1)).subscribe((result) => {
      if (result) {
        this.cancelTransaction();
      }
    });
  }

  cancelTransaction() {
    this.loading = true;
    this.transactionsService
      .userCancelled(this.transactionData['id'])
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) =>
        this.stepService.redirect({...res, id: this.transactionData['id']})
      );
  }

  ngOnDestroy() {
  }
}
