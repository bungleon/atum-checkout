import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthorized$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    @Inject('systemConfig') public SystemConfig,
    private permissionsService: NgxPermissionsService,
    private storageService: StorageService,
    private router: Router
  ) {}

  authCheck() {
    const user = this.storageService.getData(
      this.SystemConfig.authServiceKey || 'user',
      this.SystemConfig.authStorageType || 'local'
    );
    if (!user) {
      this.isAuthorized$.next(false);
    } else if (user && user.exp && user.exp < Date.now() / 1000) {
      this.isAuthorized$.next(false);
    } else {
      if (user.roles && user.roles.length) {
        this.permissionsService.addPermission(user.roles);
      }
      this.isAuthorized$.next(true);
    }
  }

  flush() {
    this.isAuthorized$.next(false);
    this.storageService.flush(
      this.SystemConfig.authServiceKey || 'user',
      this.SystemConfig.authStorageType || 'local'
    );
    this.permissionsService.flushPermissions();
  }

  flushAndRedirect() {
    this.flush();
    this.router.navigate([this.SystemConfig.unauthorizedRedirectTo]);
  }

  set auth(data: any) {
    if (data.roles) {
      data.roles.push('AUTHORIZED');
    } else {
      data['roles'] = ['AUTHORIZED'];
    }
    this.storageService.setData(
      this.SystemConfig.authServiceKey || 'user',
      data,
      this.SystemConfig.authStorageType || 'local'
    );
    this.authCheck();
  }

  get auth() {
    const _data = this.storageService.getData(
      this.SystemConfig.authServiceKey || 'user',
      this.SystemConfig.authStorageType || 'local'
    );
    if (_data) {
      return _data;
    } else {
      return null;
    }
  }
}
