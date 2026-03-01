import {Component, OnDestroy, OnInit} from '@angular/core';
import {StepService} from '@core/services/step-redirect.service';
import {AuthService, OtpService, RouteService, StorageService,} from '@shared/services/';
import {TransactionsService} from '@core/http/index';
import {exhaustMap, finalize, of, take} from 'rxjs';
import {ConfirmModalComponent} from "@shared/components/confirm-modal/confirm-modal.component";
import {BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-account',
  templateUrl: './select-amount.component.html',
  styleUrls: ['./select-amount.component.css'],
})
export class SelectAmountComponent implements OnInit, OnDestroy {
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
  amounts = null;
  buttonValue = null;
  cancelTransactionValue = null;
  id:bigint = null;

  ngOnInit() {
    this.loading = true;
    if (!this.transactionData) {
      this.stepService.onStepError();
      return;
    }
    this.onLoad();
  }

  onLoad() {
    debugger;
    const getStep$ = this.transactionsService.getStep(
      this.transactionData['id']
    );
    const getAccount$ = this.transactionsService.getAmounts(
      this.transactionData['id']
    );
    getStep$
      .pipe(
        exhaustMap((res) => {
          debugger;
          if (!this.stepService.isStep(res, 'AMOUNT_SELECT')) {
            return of(true);
          }
          return of(false);
        })
      )
      .pipe(
        exhaustMap((hasError) => {
          debugger;
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
          debugger;
          return this.stepService.onStepError({...res, nextStep: 'ERROR'});
        }
        this.buttonValue =res.messages.continueButton;
        this.cancelTransactionValue =res.messages.cancelTransaction;
        this.amounts = res.amounts;
        this.accountResponse = res;
      });
  }

  onSubmit(): void {
    this.loading = true;
    this.transactionsService
      .setAmount(this.transactionData['id'], {
        amountId: this.id,
      })
      .pipe(finalize(() => (this.loading = false)))
      .pipe(take(1))
      .subscribe((res) => {
        if (this.stepService.isStep(res, 'ERROR')) {
          this.onError(res);
          return;
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
      .preTransactionUserCancelled(this.transactionData['id'])
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) =>
        this.stepService.redirect({...res, id: this.transactionData['id']})
      );
  }

  ngOnDestroy() {
  }
}
