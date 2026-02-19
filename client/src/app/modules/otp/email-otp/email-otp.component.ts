import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { AlertService } from '@shared/services/alert.service';
import { TransactionsService } from '@core/http/index';
import { StepService } from '@core/services/step-redirect.service';
import { finalize } from 'rxjs';
import { StorageService } from '@shared/services/';

@Component({
  selector: 'app-email-otp',
  templateUrl: './email-otp.component.html',
  styleUrls: ['./email-otp.component.css'],
})
export class EmailOtpComponent implements OnInit {
  constructor(
    public alertService: AlertService,
    public stepService: StepService,
    public transactionsService: TransactionsService,
    public storageService: StorageService
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

  ngOnDestroy() {}
}
