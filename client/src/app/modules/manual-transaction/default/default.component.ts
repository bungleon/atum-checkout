import { Component, Input, EventEmitter, Output } from '@angular/core';
import { AlertService } from '@shared/services/alert.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css'],
})
export class DefaultComponent {
  constructor(public alertService: AlertService) {}
  @Input()
  formData: any = {};
  @Input()
  loading: any = false;
  @Output()
  eSubmit = new EventEmitter();
  @Output()
  eCancel = new EventEmitter();
}
