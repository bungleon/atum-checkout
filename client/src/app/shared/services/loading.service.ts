import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loading$: BehaviorSubject<boolean>;
  loadingText$: BehaviorSubject<string>;
  constructor() {
    this.loading$ = new BehaviorSubject(false);
    this.loadingText$ = new BehaviorSubject('');
  }
  // setData(state: boolean) {
  //   this.loading$.next(state);
  // }
}
