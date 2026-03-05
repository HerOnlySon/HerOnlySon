import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  error = '';
  isSubmitting = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error = '';
    this.isSubmitting = true;
    this.auth.signIn(this.form.getRawValue() as { email: string; password: string }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = err?.error?.error ?? 'Sign in failed. Please check your details.';
      }
    });
  }
}
