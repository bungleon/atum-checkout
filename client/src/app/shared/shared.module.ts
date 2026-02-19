import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxIbanModule } from 'ngx-iban';
import { IConfig, NgxMaskModule } from 'ngx-mask';

// plugins
import { ClipboardModule } from 'ngx-clipboard';
import { CodeInputModule } from 'angular-code-input';
import { ModalModule } from 'ngx-bootstrap/modal';
// components
import { NextFlowComponent } from '@shared/components/next-flow/next-flow.component';
import { NotfoundComponent } from '@shared/components/not-found/not-found.component';
import { UnauthorizedComponent } from '@shared/components/unauthorized/unauthorized.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { AlertComponent } from './components/alert/alert.component';
import { LoadingComponent } from './components/loading/loading.component';
// directives
import { LoadingDirective } from '@shared/directives/loading.directive';
import { fullNameValidator } from '@shared/directives/full-name.directive';
import { AllowNumbersOnlyDirective } from '@shared/directives/numbers-only.directive';

import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
// pipes
import { BeautifulEnumPipe } from './pipes/beautiful-enum.pipe';
import { TrimDirective } from './directives/trim.directive';
import { PhoneComponent } from './components/phone/phone.component';
import { NgSelectModule } from '@ng-select/ng-select';

const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  imports: [
    // core
    RouterModule,
    CommonModule,
    FormsModule,
    // plugins
    ClipboardModule,
    CodeInputModule,
    TranslateModule.forChild(),
    ModalModule.forRoot(),
    NgSelectModule,
    NgxIbanModule,
    NgxMaskModule.forRoot(maskConfig),
  ],
  declarations: [
    NotfoundComponent,
    UnauthorizedComponent,
    LoadingDirective,
    AllowNumbersOnlyDirective,
    fullNameValidator,
    HeaderComponent,
    AlertComponent,
    ConfirmModalComponent,
    BeautifulEnumPipe,
    NextFlowComponent,
    PageTitleComponent,
    LoadingComponent,
    TrimDirective,
    PhoneComponent,
  ],
  exports: [
    // components
    NextFlowComponent,
    NotfoundComponent,
    UnauthorizedComponent,
    HeaderComponent,
    AlertComponent,
    ConfirmModalComponent,
    PageTitleComponent,
    LoadingComponent,
    BeautifulEnumPipe,
    // core
    CommonModule,
    FormsModule,
    // modules
    TranslateModule,
    ModalModule,
    ClipboardModule,
    NgSelectModule,
    NgxIbanModule,
    NgxMaskModule,
    // directives
    LoadingDirective,
    fullNameValidator,
    AllowNumbersOnlyDirective,
    TrimDirective,
    PhoneComponent,
  ],
  entryComponents: [],
})
export class SharedModule {}
