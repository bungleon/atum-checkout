import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { AlertService } from '@shared/services/alert.service';
import { TransactionsService } from '@core/http/index';
import { StepService } from '@core/services/step-redirect.service';
import {finalize, take} from 'rxjs';
import { StorageService } from '@shared/services/';
import {ConfirmModalComponent} from "@shared/components/confirm-modal/confirm-modal.component";
import {BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-sms-approve',
  templateUrl: './sms-approve.component.html',
  styleUrls: ['./sms-approve.component.css'],
})
export class SmsApproveComponent implements OnInit {
  constructor(
    public alertService: AlertService,
    public stepService: StepService,
    public transactionsService: TransactionsService,
    public storageService: StorageService,
    public bsModalService: BsModalService
  ) {}
  @Input()
  transactionData: any = {};
  @Input()
  otpData: any = {};
  @Input()
  otpType: string = null;

  loading = false;
  formParams = {
    otp: '',
    otpType: '',
  };

  ngOnInit() {
    this.formParams.otpType = this.otpType;
  }

  onSubmit() {
    this.loading = true;
    const params = { ...this.formParams };
    this.transactionsService
      .otp(this.transactionData['id'], params)
      .pipe(
        finalize(() => {
          this.storageService.flush('otpData');
          this.loading = false;
        })
      )
      .subscribe((res) => {
        this.stepService.redirect(res);
      });
  }

  backToMerchant() {
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
    this.loading = true;
    this.transactionsService
      .userCancelled(this.transactionData['id'])
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) =>
        this.stepService.redirect({...res, id: this.transactionData['id']})
      );
  }

  ngOnDestroy() {}
}
