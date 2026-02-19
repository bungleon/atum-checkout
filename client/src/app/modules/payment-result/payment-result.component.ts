import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionsService } from '@core/http/index';
import { StateService, AuthService, StorageService } from '@shared/services';
import { finalize, interval, take, takeUntil, tap, timeout } from 'rxjs';
import { Router } from '@angular/router';
import { paymentResultSteps } from '@app/core/http/enum/enum.interface';
import { LoadingService } from '@shared/services/loading.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.css'],
})
export class PaymentResultComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public transactionsService: TransactionsService,
    public storageService: StorageService,
    public stateService: StateService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private translateService: TranslateService
  ) {
    this.transactionData = this.authService.auth;
  }

  stateData = null;
  transactionData = null;
  redirectUrl = null;
  type = null;
  steps = paymentResultSteps;

  ngOnInit() {
    debugger;
    this.type = this.route.snapshot.queryParams['type'];
    this.stateData = this.stateService.data;
    if (
      !this.steps.hasOwnProperty(this.type) ||
      !this.type ||
      !this.transactionData
    ) {
      this.router.navigate(['/404']);
    } else {
      interval(20000)
        .pipe(take(1))
        .subscribe(() => this.backToMerchant());
    }
  }

  backToMerchant() {
    this.loadingService.loading$.next(true);
    this.translateService
      .get('payment_result.please_wait_redirecting')
      .subscribe((res: string) => this.loadingService.loadingText$.next(res));
    this.storageService.flush('otpData');
    this.authService.flush();
    window.location.href = this.transactionData['redirectUrl'];
  }

  ngOnDestroy() {}
}
