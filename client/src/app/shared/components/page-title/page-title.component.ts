import { Component } from '@angular/core';
import { AuthService } from '@shared/services/';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['page-title.component.scss'],
})
export class PageTitleComponent {
  constructor(public authService: AuthService) {
    this.transactionData = this.authService.auth;
  }
  transactionData = null;
  ngOnInit() {}
  ngOnDestroy() {}
}
