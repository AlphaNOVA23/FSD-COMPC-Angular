import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordMatchvValidator } from '../../../utils/passwordValidators';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { 
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchvValidator });
  }

  ngOnInit(): void {
  }

  registerSubmit() {
    if (this.registerForm.valid) {
      //it will return true when all the validations are verified including angular (length, reuqired, email) and custom (pasword matching)
      console.log('Success' + this.registerForm.value);
      //this will not be able to print the object, so write the following code
      console.log('Success' + JSON.stringify(this.registerForm.value));

      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          console.log('Spring Boot Response:', res);
          if (res.token) {
            localStorage.setItem('token', res.token);
          }
        },
        error: (err) => console.error('Register failed', err)
      });
    } else {
      console.log(this.registerForm.errors);
      this.printErrors();
    }
  }

  printErrors() {
    const controls = this.registerForm.controls;
    // am I accessing / trying to get controlelrs array
    
    for (const controllerName in controls) {
      const control = controls[controllerName];
      if (control.invalid && control.touched) {
        const errors = control.errors;
        if (errors) {
          console.log(`${controllerName} has the following errors:`);
          for (const error in errors) {
            console.log(`- ${error}: ${JSON.stringify(errors[error])}`);
          }
        }
      }
    }
  }
}
