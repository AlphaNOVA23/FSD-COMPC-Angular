import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() applicationName: string = '';

  constructor(
    private router: Router, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  get isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  get userRole(): string {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = token.split('.')[1];
          const decoded = JSON.parse(atob(payload));
          return decoded.role || 'ROLE_USER';
        } catch (e) { return 'ROLE_USER'; }
      }
    }
    return 'ROLE_USER';
  }

  get isAdmin(): boolean {
    return this.userRole === 'ROLE_ADMIN';
  }

  get dashboardRoute(): string {
    return this.isAdmin ? '/admin' : '/my-profile';
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/auth/login']);
  }
}

