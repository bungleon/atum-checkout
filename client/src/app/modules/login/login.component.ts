import {Component, OnInit} from '@angular/core';
import {exhaustMap, finalize, of, take} from 'rxjs';
import {StepService} from '@core/services/step-redirect.service';
import {AuthService, RouteService, StorageService} from '@shared/services/';
import {TransactionsService} from '@core/http/index';
import {LoadingService} from '@shared/services/loading.service';
import {TranslateService} from '@ngx-translate/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ConfirmModalComponent} from "@shared/components/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    public transactionsService: TransactionsService,
    public stepService: StepService,
    public storageService: StorageService,
    public routeService: RouteService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private translateService: TranslateService,
    public bsModalService: BsModalService
  ) {
    this.transactionData = this.authService.auth;
  }

  loading: any = {};
  formParams = [];
  loginInputs: any;
  transactionData = null;
  isAreaCode = false;

  ngOnInit(): void {
    if (!this.transactionData) {
      this.stepService.onStepError();
      return;
    }
    this.onLoad();
  }

  onLoad() {
    this.loading['FORM'] = true;
    const getStep$ = this.transactionsService.getStep(
      this.transactionData['id']
    );
    const getInput$ = this.transactionsService.getLoginInput(
      this.transactionData['id']
    );
    getStep$
      .pipe(
        exhaustMap((res) => {
          if (
            this.stepService.isStep(res, 'LOGIN') ||
            this.stepService.isStep(res, 'LOGIN_INPUTS')
          ) {
            return of(false);
          }
          return of(true);
        })
      )
      .pipe(
        exhaustMap((hasError) => {
          if (hasError) {
            return of(false);
          }
          return getInput$;
        })
      )
      .pipe(take(1))
      .pipe(finalize(() => (this.loading['FORM'] = false)))
      .subscribe((res) => {
        if (!res) {
          return this.stepService.onStepError({...res, nextStep: 'ERROR'});
        }
        this.loginInputs = res;
        this.isAreaCode =
          this.loginInputs.inputs.find((item: any) => item.name === 'areaCode') ||
          false;
      });
  }

  onSubmit(): void {
    const phone = this.formParams['phone'] || undefined;
    if (phone) {
      let phone_number = phone.split('-');
      if (phone_number[1]) {
        this.formParams['areaCode'] = phone_number[0];
        this.formParams['phone'] = phone_number[1];
      }
    }
    this.loading['SUBMIT'] = true;
    const params = {...this.formParams};
    this.transactionsService
      .login(this.transactionData['id'], params)
      .pipe(take(1))
      .pipe(finalize(() => (this.loading['SUBMIT'] = false)))
      .subscribe((res) => {
        this.loginInputs = res;
        this.stepService.redirect(res);
      });
  }

  backToMerchant() {
    debugger;
    const confirmModal = this.bsModalService.show(ConfirmModalComponent, {
      class: 'modal-dialog-centered modal-md modal-confirm',
      initialState: {
        initialParams: {
          content: this.loginInputs.messages.manualTransferWarningAfterDeclined,
          buttons: this.loginInputs
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
