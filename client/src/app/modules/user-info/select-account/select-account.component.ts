import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@app/shared/services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-select-account',
  templateUrl: './select-account.component.html',
})
export class SelectAccountComponent implements OnInit, OnDestroy {
  onClose = new Subject<boolean>();
  constructor(
    public bsModalRef: BsModalRef,
    public bsModalService: BsModalService,
    private authService: AuthService
  ) {
    this.transactionData = this.authService.auth;
  }

  initialParams: any = {};
  accounts = [];
  accountId = null;
  transactionData = null;

  public ngOnInit(): void {
    this.accounts = [...this.accounts, ...this.initialParams];
    this.accounts.map((item) => {
      item['id'] = this.accounts.indexOf(item) + 1;
      return item;
    });
  }

  ngOnDestroy() {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

  onSubmit() {
    const _acc =
      this.accounts.find((item) => item.id === Number(this.accountId)) || null;
    if (_acc === null) {
      this.onClose.next(false);
    } else {
      this.onClose.next(_acc);
    }
    this.bsModalRef.hide();
  }
}
