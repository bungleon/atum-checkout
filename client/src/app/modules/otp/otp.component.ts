import { Component, OnInit, OnDestroy } from '@angular/core';
import { StepService } from '@core/services/step-redirect.service';
import { finalize, take } from 'rxjs';
import { TransactionsService } from '@core/http/index';
import { StorageService, AuthService } from '@shared/services/';
import { ActivatedRoute } from '@angular/router';
import { OtpService } from '@shared/services/';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
})
export class OtpComponent implements OnInit, OnDestroy {
  constructor(
    public stepService: StepService,
    public transactionsService: TransactionsService,
    public storageService: StorageService,
    public authService: AuthService,
    private otpService: OtpService
  ) {
    this.otpService.otpDataChange$.subscribe(() => {
      this.initializeComponent();
    });
  }

  loading = false;
  transactionData = null;
  otpData = null;
  otpType = null;

  ngOnInit() {}

  initializeComponent() {
    this.loading = true;
    this.otpData = this.storageService.getData('otpData');
    this.transactionData = this.authService.auth;
    if (!this.transactionData || !this.otpData) {
      this.stepService.onStepError();
      return;
    }
    this.transactionsService
      .getStep(this.transactionData['id'])
      .pipe(finalize(() => (this.loading = false)))
      .pipe(take(1))
      .subscribe((res) => {
        if (!this.stepService.isStep(res, 'OTP')) {
          return this.stepService.onStepError({ ...this.transactionData, res });
        }
        this.otpType = this.otpData['otpType'];
      });
  }

  ngOnDestroy() {}
}
