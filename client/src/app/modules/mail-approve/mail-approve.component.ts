import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  exhaustMap,
  finalize,
  interval,
  Subject,
  take,
  takeUntil,
  timeout,
} from 'rxjs';
import { StepService } from '@core/services/step-redirect.service';
import { RouteService, AuthService } from '@shared/services/';
import { TransactionsService } from '@core/http/index';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '@shared/services/alert.service';

@Component({
  selector: 'app-mail-approve',
  templateUrl: './mail-approve.component.html',
})
export class MailApproveComponent implements OnInit {
  constructor(
    public transactionsService: TransactionsService,
    public stepService: StepService,
    public routeService: RouteService,
    private authService: AuthService,
    public bsModalService: BsModalService,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {
    this.transactionData = this.authService.auth;
  }

  loading = false;
  transactionData = null;
  timeout: number = 0;

  ngOnInit(): void {
    if (!this.transactionData) {
      this.stepService.onStepError();
      return;
    }
    this.timeout = this.route.snapshot.queryParams['timeout'] || 0;
    this.checkAutoMailApprove(this.timeout);
  }

  onSubmit(): void {
    const confirmModal = this.bsModalService.show(ConfirmModalComponent, {
      class: 'modal-dialog-centered modal-md modal-confirm',
      initialState: {
        initialParams: {
          content: 'Mailinizden girişinizi onayladınız mı?',
        },
      },
    });
    confirmModal.content.onClose.pipe(take(1)).subscribe((result) => {
      if (result) {
        this.onMailApprove();
      }
    });
  }

  onMailApprove(): void {
    this.loading = true;
    this.transactionsService
      .mailApprove(this.transactionData['id'])
      .pipe(take(1))
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res['nextStep'] !== null && res['nextStep'] === 'MAIL_APPROVE') {
          this.alertService.setNotice(
            'Mail onayı başarısız. Lütfen mailinize gelen linke tıklayarak girişinizi onaylayın!',
            'warning'
          );
          return;
        }
        this.authService.auth = {
          ...{ id: this.transactionData.id ?? null },
          ...this.authService.auth,
          ...res,
        };
        this.stepService.redirect(res);
      });
  }

  checkAutoMailApprove(timeout: number | 0): void {
    if (timeout > 0) {
      const stopInterval$: Subject<any> = new Subject<any>();
      const approve$ = this.transactionsService.mailApprove(
        this.transactionData['id']
      );
      interval(timeout)
        .pipe(takeUntil(stopInterval$))
        .pipe(exhaustMap(() => approve$))
        .subscribe((res) => {
          if (res['nextStep'] !== null && res['nextStep'] !== 'MAIL_APPROVE') {
            stopInterval$.next(true);
            this.authService.auth = {
              ...{ id: this.transactionData.id ?? null },
              ...this.authService.auth,
              ...res,
            };
            this.stepService.redirect(res);
          }
        });
    }
  }

  ngOnDestroy() {}
}
