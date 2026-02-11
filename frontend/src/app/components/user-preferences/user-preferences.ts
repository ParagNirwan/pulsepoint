import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { UserPreferencesApiService } from '../../services/user-preference-api.service';



@Component({
  selector: 'app-user-preferences-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-preferences.html',
  styleUrl: './user-preferences.css',
})
export class UserPreferencesPageComponent implements OnInit {
  isSaving = false;

  countries = [
    { code: 'us', name: 'United States' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'de', name: 'Germany' },
    { code: 'in', name: 'India' },
  ];

  languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'German' },
    { code: 'hi', name: 'Hindi' },
  ];

  categories = [
    { code: 'business', name: 'Business' },
    { code: 'general', name: 'General' },
    { code: 'technology', name: 'Technology' },
  ];

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private userPreferencesApi: UserPreferencesApiService
  ) {
    this.form = this.fb.group({
      country: ['de', [Validators.required]],
      languages: [['en'], [Validators.required]],
      categories: [['general'], [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.userPreferencesApi.getPreferences().subscribe({
      next: (prefs) => {
        this.form.patchValue({
          country: prefs.country ?? 'de',
          languages: prefs.languages ?? ['en'],
          categories: prefs.categories ?? ['general'],
        });
      },
      error: () => {
        this.snackBar.open('Could not load preferences.', 'OK', { duration: 2000 });
      },
    });
  }

  savePreferences(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Please fill all preferences.', 'OK', { duration: 2500 });
      return;
    }

    this.isSaving = true;

    const payload = {
      country: this.form.value.country,
      languages: this.form.value.languages,
      categories: this.form.value.categories,
    };

    this.userPreferencesApi
      .savePreferences(payload)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Preferences saved successfully ✅', 'OK', { duration: 2500 });
        },
        error: () => {
          this.snackBar.open('Failed to save preferences ❌', 'OK', { duration: 2500 });
        },
      });
  }

  resetToDefaults(): void {
    this.form.reset({
      country: 'de',
      languages: ['en'],
      categories: ['general'],
    });
    this.snackBar.open('Reset to defaults.', 'OK', { duration: 2000 });
  }
}
