import { Component } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet
} from '@angular/router';
import { filter } from 'rxjs';
import { animate, query, style, transition, trigger } from '@angular/animations';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeFade', [
      transition('* <=> *', [
        query(
          ':enter',
          [style({ opacity: 0, transform: 'translateY(8px)' }), animate('260ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))],
          { optional: true }
        )
      ])
    ])
  ]
})
export class AppComponent {
  readonly navItems = [
    { label: 'Home', path: '/', exact: true },
    { label: 'Dashboard', path: '/dashboard', exact: false },
    { label: 'Profile', path: '/profile', exact: false },
    { label: 'Insurance', path: '/insurance', exact: false },
    { label: 'Reports', path: '/reports', exact: false }
  ];
  isRouteLoading = false;

  constructor(
    public readonly auth: AuthService,
    private readonly router: Router
  ) {
    this.router.events
      .pipe(
        filter((event) =>
          event instanceof NavigationStart ||
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        )
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.isRouteLoading = true;
          return;
        }

        window.setTimeout(() => {
          this.isRouteLoading = false;
        }, 220);
      });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/signin');
  }

  prepareRoute(outlet: RouterOutlet): string {
    return outlet?.activatedRouteData?.['animation'] ?? 'Page';
  }
}
