import {
  Component,
  Input,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NoticeComponent {
  constructor() { }
  @Input()
  formData: any = null;
  @Output()
  eSubmit = new EventEmitter();
}
