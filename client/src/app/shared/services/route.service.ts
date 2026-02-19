import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  onRouteChange$ = new BehaviorSubject(null);

  constructor(
    @Inject('routeConfig') public routeConfig,
    @Inject('systemConfig') public systemConfig,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private browserTitle: Title
  ) {}

  routeCheck() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .pipe(filter((route) => route.outlet === 'primary'))
      .pipe(mergeMap((route) => route.data))
      .subscribe((route) => {
        if (route && route['routeConfig']) {
          const data = this.routeConfig[route['routeConfig']];
          if (data.title && data.title.length > 0) {
            this.browserTitle.setTitle(data.title);
          } else if (this.systemConfig.siteTitle) {
            this.browserTitle.setTitle(this.systemConfig.siteTitle);
          }
          this.onRouteChange$.next(route);
        }
      });

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
