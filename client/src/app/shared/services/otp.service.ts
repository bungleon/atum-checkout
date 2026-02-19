import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class OtpService {
  otpDataChange$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  otpData$: BehaviorSubject<any>;
  constructor(private storageService: StorageService) {
    this.otpData$ = new BehaviorSubject(this.storageService.getData('otpData'));
  }
  setOtpData(payload: any) {
    this.storageService.setData('otpData', payload);
    this.otpData$.next(payload);
    this.otpDataChange$.next(true);
  }
}
