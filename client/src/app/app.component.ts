import { Component } from '@angular/core';
import {
  LanguageService,
  RouteService,
  AuthService,
  LoadingService,
} from '@shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(
    private languageService: LanguageService,
    public routeService: RouteService,
    public authService: AuthService,
    public loadingService: LoadingService
  ) {}
  ngOnInit() {
    this.routeService.routeCheck();
    this.languageService.langCheck();
    this.authService.authCheck();
  }
  title = 'Giza Checkout';
}
