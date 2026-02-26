import {Component, OnDestroy, OnInit, Renderer2, RendererFactory2} from '@angular/core';
import {StepService} from '@core/services/step-redirect.service';
import {exhaustMap, finalize, of, take} from 'rxjs';
import {TransactionsService} from '@core/http/index';
import {ConfirmModalComponent} from '@shared/components/confirm-modal/confirm-modal.component';
import {BsModalService} from 'ngx-bootstrap/modal';
import {AuthService, StorageService} from '@shared/services';

@Component({
  selector: 'app-manual-transaction',
  templateUrl: './manual-transaction.component.html',
  styleUrls: ['./manual-transaction.component.css'],
})
export class ManualTransactionComponent implements OnInit, OnDestroy {
  private renderer: Renderer2;

  constructor(
    public stepService: StepService,
    public transactionsService: TransactionsService,
    public bsModalService: BsModalService,
    public storageService: StorageService,
    private authService: AuthService,
    rendererFactory: RendererFactory2
  ) {
    this.transactionData = this.authService.auth;
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  loading = false;
  paymentType = null;
  transactionData = null;
  formLoading: boolean = false;
  formData = null;
  cancelData = null;
  isNoticeConfirm = false;

  ngOnInit() {
    if (!this.transactionData) {
      return this.stepService.onStepError();
    }
    this.loading = true;
    const getStep$ = this.transactionsService.getStep(
      this.transactionData['id']
    );
    const getDetail$ = this.transactionsService.getTransferDetail(
      this.transactionData['id']
    );
    getStep$
      .pipe(
        exhaustMap((res) => {
          if (this.stepService.isStep(res, 'MANUAL_TRANSACTION')) {
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
          return getDetail$;
        })
      )
      .pipe(finalize(() => (this.loading = false)))
      .pipe(take(1))
      .subscribe((res) => {
        if (!res) {
          return this.stepService.onStepError({...res, nextStep: 'ERROR'});
        }
        this.formData = {...res, ...this.transactionData};
      });
  }

  onApprove() {
    this.formLoading = true;
    const confirmModal = this.bsModalService.show(ConfirmModalComponent, {
      class: 'modal-dialog-centered modal-md modal-confirm',
      initialState: {
        initialParams: {
          content: this.formData.messages.manualTransferWarningAfterContinue,
          buttons: this.formData
        },
      },
    });
    confirmModal.content.onClose.pipe(take(1)).subscribe((result) => {
      if (!result) {
        this.formLoading = false;
        return true;
      }
      this.submitTransaction('APPROVED');
    });
  }

  onCancel() {

    const confirmModal = this.bsModalService.show(ConfirmModalComponent, {
      class: 'modal-dialog-centered modal-md modal-confirm',
      initialState: {
        initialParams: {
          content: this.formData.messages.manualTransferWarningAfterDeclined,
          buttons: this.formData
        },
      },
    });
    confirmModal.content.onClose.pipe(take(1)).subscribe((result) => {
      if (result) {
        this.cancelTransaction();
      }
    });
  }

  onNoticeConfirm() {
    this.isNoticeConfirm = !this.isNoticeConfirm;
  }

  submitTransaction(submitType: string) {
    this.loading = true;
    const params = {result: submitType};
    this.transactionsService
      .manualTransferApprove(this.transactionData['id'], params)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) =>
        this.stepService.redirect({...res, id: this.transactionData['id']})
      );
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
