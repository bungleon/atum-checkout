import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.scss'],
})
export class ForgotPasswordModalComponent implements OnInit, OnDestroy {
  onClose = new Subject<boolean>();
  isConfirmed = false;

  constructor(public bsModalRef: BsModalRef) {}

  initialParams: any = {};

  public ngOnInit(): void {}
  confirm() {
    this.isConfirmed = true;
    this.bsModalRef.hide();
  }
  decline() {
    this.isConfirmed = false;
    this.bsModalRef.hide();
  }

  ngOnDestroy() {
    this.onClose.next(this.isConfirmed);
    this.bsModalRef.hide();
  }
}
