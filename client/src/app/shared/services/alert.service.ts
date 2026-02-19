import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  onNoticeChanged$: ReplaySubject<Notice>;
  constructor() {
    this.onNoticeChanged$ = new ReplaySubject(null);
  }
  setNotice(message: string, type?: string, isPopup?: boolean) {
    this.onNoticeChanged$.next({
      message: message,
      type: type,
      isPopup: isPopup,
    });
  }
}

interface Notice {
  message: string;
  type: string;
  isPopup?: boolean;
}
