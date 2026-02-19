import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { exhaustMap, finalize, interval, Subject, take, takeUntil } from 'rxjs';
import { TransactionsService } from '@core/http/index';
import { StepService } from '@core/services/step-redirect.service';
import { StorageService } from '@shared/services/';
import {ConfirmModalComponent} from "@shared/components/confirm-modal/confirm-modal.component";
import {BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-mobile-approve',
  templateUrl: './mobile-approve.component.html',
  styleUrls: ['./mobile-approve.component.css'],
})
export class MobileApproveComponent implements OnInit {
  constructor(
    public stepService: StepService,
    public transactionsService: TransactionsService,
    public storageService: StorageService,
    public bsModalService: BsModalService
  ) { }

  @Input()
  transactionData: any = {};
  @Input()
  otpData: any = {};

  formParams = {
    otp: '',
    otpType: '',
  };

  ngOnInit() {
    this.formParams.otpType = this.otpData.otpType;
    this.formParams.otp = this.otpData.otpType;
    this.interval();
  }

  interval() {
    const stopInterval$: Subject<any> = new Subject<any>();
    stopInterval$.next(false);
    const otp$ = this.transactionsService.otp(
      this.transactionData['id'],
      this.formParams
    );
    interval(Number(this.otpData['timeout']) | 3000)

      .pipe(take(10))
      .pipe(takeUntil(stopInterval$))
      .pipe(exhaustMap(() => otp$))
      .subscribe((res) => {
        if (res.otpType !== null && res.otpType === 'SMS_LOGIN') {
          stopInterval$.next(true);
          this.storageService.flush('otpData');
          this.stepService.redirect(res);
        }
        if (!this.stepService.isStep(res, 'OTP')) {
          stopInterval$.next(true);
          this.storageService.flush('otpData');
          this.stepService.redirect(res);
        }
      });
  }

  backToMerchant() {
    debugger;
    const confirmModal = this.bsModalService.show(ConfirmModalComponent, {
      class: 'modal-dialog-centered modal-md modal-confirm',
      initialState: {
        initialParams: {
          content: this.otpData.messages.manualTransferWarningAfterDeclined,
          buttons: this.otpData
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
    this.transactionsService
      .userCancelled(this.transactionData['id'])
      .pipe()
      .subscribe((res) =>
        this.stepService.redirect({...res, id: this.transactionData['id']})
      );
  }
}
