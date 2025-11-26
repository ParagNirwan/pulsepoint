import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup {
  signupForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });
  }


  // Getters for template (avoids deprecated ngIf pattern)
  get username() { return this.signupForm.get('username'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  //Password Validation
  passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const confirm = group.get('confirmPassword');

    if (password && confirm) {
      if (password.value !== confirm.value) {
        // set the error on confirmPassword control
        confirm.setErrors({ ...confirm.errors, passwordsMismatch: true });
      } else {
        // remove only the passwordsMismatch error, keep other errors
        if (confirm.hasError('passwordsMismatch')) {
          const errors = { ...confirm.errors };
          delete errors['passwordsMismatch'];
          confirm.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
    }
    return null; // form group error not needed
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { username, email, password } = this.signupForm.value;

      this.http.post(
        'http://localhost:8080/public/create',
        { username, email, password },
        { responseType: 'text' }
      ).subscribe({
        next: (res) => {

          alert(res);
          this.signupForm.reset();
          this.router.navigate(['/login']);
        },
        error: (err) => {

          alert('Signup failed. Try again.');
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

}
