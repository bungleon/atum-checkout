import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
  onClose = new Subject<boolean>();
  isConfirmed = false;

  constructor(public bsModalRef: BsModalRef) {}

  initialParams: any = null;

  public ngOnInit(): void {
  }
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
