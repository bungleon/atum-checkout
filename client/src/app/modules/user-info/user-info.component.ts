import {Component, OnInit, ViewChild} from '@angular/core';
import {finalize, forkJoin, take} from 'rxjs';
import {StepService} from '@core/services/step-redirect.service';
import {AuthService, RouteService, StorageService} from '@shared/services/';
import {TransactionsService} from '@core/http/index';
import {BsModalService} from 'ngx-bootstrap/modal';
import {SelectAccountComponent} from './select-account/select-account.component';
import {NgModel} from '@angular/forms';
import {LoadingService} from '@shared/services/loading.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
})
export class UserInfoComponent implements OnInit {
  constructor(
    public transactionsService: TransactionsService,
    public stepService: StepService,
    public storageService: StorageService,
    private authService: AuthService,
    private loadingService: LoadingService,
    public bsModalService: BsModalService,
    private translateService: TranslateService
  ) {
    this.transactionData = this.authService.auth;
  }

  @ViewChild('customerName') customerName: NgModel;

  loading = false;
  formParams = {
    accountNumber: null,
    customerName: null,
    phoneNumber: null,
  };
  transactionData = null;
  userInfo = null;
  continueButton = null;
  cancelButton = null;

  ngOnInit(): void {
    if (!this.transactionData) {
      this.stepService.onStepError();
      return;
    }
    this.onLoad();
  }

  onLoad() {
    this.loading = true;
    const getStep$ = this.transactionsService.getStep(
      this.transactionData['id']
    );

    const getUserInfo$ = this.transactionsService.getUserInfo(
      this.transactionData['id']
    );

    forkJoin([getStep$, getUserInfo$])
      .pipe(take(1))
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(([step, userInfo]) => {
        if (!this.stepService.isStep(step, 'GET_USER_INFO')) {
          return this.stepService.onStepError({...step, nextStep: 'ERROR'});
        }
        this.continueButton= userInfo.messages.continueButton;
        this.cancelButton= userInfo.messages.cancelTransaction;
        this.userInfo = userInfo;
      });
  }

  selectAccount() {
    const selectModal = this.bsModalService.show(SelectAccountComponent, {
      class: 'modalSelect',
      initialState: {initialParams: this.userInfo},
    });
    selectModal.content.onClose.pipe(take(1)).subscribe((res: any) => {
      if (res) {
        this.formParams = {...this.formParams, ...res};
      }
    });
  }

  onSubmit(): void {
    const params = {...this.formParams};
    if (this.transactionData.paymentMethod === 'PAPARA') {
      delete params['phoneNumber'];
    }
    if (this.validateUserName()) {
      this.loading = true;
      this.transactionsService
        .userInfo(this.transactionData['id'], params)
        .pipe(take(1))
        .pipe(finalize(() => (this.loading = false)))
        .subscribe((res) => this.stepService.redirect(res));
    }
  }

  validateUserName() {
    if (this.formParams.customerName) {
      const fullName = this.formParams.customerName.split(' ');
      if (fullName.length >= 2) {
        if (
          this.customerName.control.errors &&
          this.customerName.control.errors.hasOwnProperty('fullName')
        ) {
          delete this.customerName.control.errors['fullName'];
          this.customerName.control.updateValueAndValidity();
        }
        return true;
      } else {
        this.customerName.control.setErrors({
          fullName: 'Please enter your First Name and Last Name',
        });
        return false;
      }
    }
  }

  backToMerchant() {
    this.loadingService.loading$.next(true);
    this.translateService
      .get('payment_result.please_wait_redirecting')
      .pipe(take(1))
      .subscribe((res: string) => this.loadingService.loadingText$.next(res));
    this.storageService.flush('otpData');
    this.authService.flush();
    window.location.href = this.transactionData['redirectUrl'];
  }

  ngOnDestroy() {
  }
}
