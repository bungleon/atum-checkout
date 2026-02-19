import { Component } from '@angular/core';
import { AuthService } from '@shared/services/';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['header.component.css'],
})
export class HeaderComponent {
  constructor(public authService: AuthService) {
    this.transactionData = this.authService.auth;
  }
  transactionData = null;
}
