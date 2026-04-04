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
      console.log('Success' + JSON.stringify(this.loginForm.value));
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('Spring Boot Response:', res);
          if (res.token) {
            localStorage.setItem('token', res.token);
          }
        },
        error: (err) => console.error('Login failed', err)
      });
    } else {
      console.log(this.loginForm.errors);
    }
  }
}
