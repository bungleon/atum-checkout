import { Component } from '@angular/core';
import { AuthService } from '@shared/services/';
import { TransactionsService } from '@core/http/index';
import { finalize, take, takeUntil } from 'rxjs';
import { StepService } from '@core/services/step-redirect.service';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoadingService } from '@shared/services/loading.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-next-flow',
  templateUrl: './next-flow.component.html',
  styleUrls: ['next-flow.component.scss'],
})
export class NextFlowComponent {
  constructor(
    public authService: AuthService,
    private transactionsService: TransactionsService,
    private stepService: StepService,
    public bsModalService: BsModalService,
    public loadingService: LoadingService,
    public translateService: TranslateService
  ) {
    this.transactionData = this.authService.auth;
  }
  flows = [];
  flow = null;
  loading = false;
  showAllFlows = false;
  transactionData = null;
  ngOnInit() {
    this.showAllFlows = this.transactionData.showAllFlows || false;
    this.flow = this.transactionData.flow;
    this.flows.push(
      this.transactionData['flow'],
      this.transactionData['nextFlow']
    );
  }

  onFlowChange(flow: string) {
    const confirmModal = this.bsModalService.show(ConfirmModalComponent, {
      class: 'modal-dialog-centered modal-md modal-confirm',
      initialState: {
        initialParams: {
          content: 'Akışı degiştirmek istediginize emin misiniz?',
        },
      },
    });
    confirmModal.content.onClose.pipe(take(1)).subscribe((result) => {
      if (!result) {
        this.flow = this.transactionData.flow;
        return true;
      } else {
        this.loadingService.loading$.next(true);
        this.translateService
          .get('flow_change_loading_message', {
            value: this.transactionData.nextFlow,
          })
          .pipe(take(1))
          .subscribe((res: string) => {
            this.loadingService.loadingText$.next(res);
          });
        this.transactionsService
          .checkNextFlow(this.transactionData['id'])
          .pipe(
            finalize(() => {
              this.loadingService.loading$.next(false);
              this.loadingService.loadingText$.next('');
            })
          )
          .pipe(take(1))
          .subscribe((res) => {
            const data = {
              id: this.transactionData.id,
              ...this.authService.auth,
              ...res,
            };
            this.authService.auth = data;
            this.stepService.redirect(data);
          });
      }
    });
  }
}
