import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionsService } from '@core/http/index';
import { finalize, take, takeUntil } from 'rxjs';
import { StepService } from '@core/services/step-redirect.service';
@Component({
  selector: 'app-init',
  templateUrl: './init-deposit.component.html',
})
export class InitDepositComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    public transactionsService: TransactionsService,
    private stepService: StepService
  ) {}
  transactionId = null;
  loading = false;

  ngOnInit(): void {
    this.loading = true;
    this.transactionId = this.route.snapshot.params['id'];
    this.transactionsService
      .transactionInitialize(this.transactionId)
      .pipe(finalize(() => (this.loading = false)))
      .pipe(take(1))
      .subscribe((res) => this.stepService.redirect(res));
  }
}
