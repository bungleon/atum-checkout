import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { AlertService } from '@shared/services/alert.service';
import { StepService } from './step-redirect.service';
@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    public alertService: AlertService,
    public stepService: StepService
  ) {}
  handleError(error: Error | HttpErrorResponse) {
    console.log(error);
    if (!navigator.onLine) {
      return this.alertService.setNotice('No internet connection', 'warning');
    }
    if (error.hasOwnProperty('error')) {
      if (
        error['error'].hasOwnProperty('nextStep') &&
        error['error']['nextStep'] === 'ERROR'
      ) {
        return this.stepService.redirect(error['error']);
      }
    }

    let message = '';
    if (error['error'] && typeof error['error'] === 'string') {
      message = error['error'];
    }

    if (
      error['error'] &&
      error['error']['message'] &&
      typeof error['error']['message'] === 'string'
    ) {
      message = error['error']['message'];
    }

    if (
      error['error'] &&
      error['error']['errorMessage'] &&
      typeof error['error']['errorMessage'] === 'string'
    ) {
      message = error['error']['errorMessage'];
    }
    this.alertService.setNotice(message, 'warning');
  }
}
