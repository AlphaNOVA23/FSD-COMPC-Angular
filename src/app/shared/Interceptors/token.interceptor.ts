import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  let token: string | null = null;
  // SSR Failsafe: Ensure we are in a browser before touching localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    token = localStorage.getItem('token');
  }
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // 401 = Invalid or expired token — purge and force re-login
        console.warn('Security Interceptor: Token expired or invalid. Redirecting to Login.');
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem('token');
        }
        router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        // 403 = Valid identity but insufficient role
        // Avoid redirect loop: don't redirect to /my-profile if the failing request IS the profile endpoint
        const url = error.url || req.url || '';
        if (!url.includes('/employees/me')) {
          console.warn('Security Interceptor: Access denied (insufficient role). Redirecting to profile.');
          router.navigate(['/my-profile']);
        } else {
          console.warn('Security Interceptor: Profile endpoint returned 403. Not redirecting to avoid loop.');
        }
      }
      return throwError(() => error);
    })
  );
};
