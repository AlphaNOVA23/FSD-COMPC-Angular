import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.errorMessage = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.token) {
            localStorage.setItem('token', res.token);

            // Decode the JWT payload to extract the role
            const role = this.extractRoleFromToken(res.token);
            console.log('Authenticated. Role:', role);

            if (role === 'ROLE_ADMIN') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/my-profile']);
            }
          }
        },
        error: (err) => {
          console.error('Login failed', err);
          this.errorMessage = 'Incorrect email or password. Please try again.';
        }
      });
    }
  }

  /** Decodes the base64 JWT payload and extracts the role claim */
  private extractRoleFromToken(token: string): string {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.role || 'ROLE_USER';
    } catch (e) {
      console.warn('Could not decode JWT, defaulting to ROLE_USER');
      return 'ROLE_USER';
    }
  }
}

