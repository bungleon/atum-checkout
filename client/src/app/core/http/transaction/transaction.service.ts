import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService, StorageService } from '@shared/services';

const cacheBuster$ = new Subject<void>();
@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  constructor(
    protected http: HttpClient,
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  getStep(id: string): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/current-step`;
    return this.http.get<any>(url);
  }

  transactionInitialize(id: string): Observable<any> {
    this.authService.flush();
    this.storageService.flush('otpData');
    const url = `/ngx-giza/api/v1/engine/${id}/transaction`;
    return this.http.get<any>(url).pipe(
      map((res) => {
        const transactionData = { id, ...res };
        this.authService.auth = transactionData;
        return transactionData;
      })
    );
  }



  getTransferDetail(id: string): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/manual-transfer`;
    return this.http.get<any>(url);
  }

  manualTransferApprove(id: string, params: any): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/customer-manual-transfer-response`;
    return this.http.post<any>(url, params);
  }

  getLoginInput(id: string): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/login-inputs`;
    return this.http.get<any>(url);
  }

  userInfo(id: string, params: any): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/user-info`;
    return this.http.post<any>(url, params);
  }

  getUserInfo(id: string): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/user-info`;
    return this.http.get<any>(url);
  }

  login(id: string, params: any): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/login`;
    return this.http.post<any>(url, params);
  }

  otp(id: string, params: any): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/otp`;
    return this.http.post<any>(url, params);
  }

  accounts(id: string): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/accounts`;
    return this.http.get<any>(url);
  }

  transfer(id: string, params: any): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/transfer`;
    return this.http.post<any>(url, params);
  }

  transferPapara(id: string): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/transfer`;
    return this.http.post<any>(url, { accountId: 9999 });
  }

  checkNextFlow(id: string): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/check-next-flow`;
    return this.http.get<any>(url);
  }
  mailApprove(id: string): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/mail-approve`;
    return this.http.get<any>(url);
  }
  userCancelled(id: string): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/user-cancelled`;
    return this.http.get<any>(url);
  }

  preTransactionInitialize(id: string): Observable<any> {
    this.authService.flush();
    this.storageService.flush('otpData');
    const url = `/ngx-giza/api/v1/engine/${id}/pre-transaction`;
    return this.http.get<any>(url).pipe(
      map((res) => {
        const transactionData = { id, ...res };
        this.authService.auth = transactionData;
        return transactionData;
      })
    );
  }

  getBanks(id: string): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/pre-transaction-get-banks`;
    return this.http.get<any>(url);
  }

  setBank(id: string, params: any): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/pre-transaction-set-bank`;
    return this.http.post<any>(url, params);
  }

  getAmounts(id: string): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/pre-transaction-get-amounts`;
    return this.http.get<any>(url);
  }

  setAmount(id: string, params: any): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/pre-transaction-set-amount`;
    return this.http.post<any>(url, params);
  }

  preTransactionUserCancelled(id: string): Observable<any> {
    const url = `/ngx-giza/api/v1/engine/${id}/pre-transaction-user-cancelled`;
    return this.http.get<any>(url);
  }

}
