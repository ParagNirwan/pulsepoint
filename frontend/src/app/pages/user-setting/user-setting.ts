import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../components/confirm-dialog/confirm-dialog';
import { AuthService, PlanType } from '../../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StripeService } from '../../services/stripe.service';
import { UserPreferencesPageComponent } from '../../components/user-preferences/user-preferences';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    CommonModule,
    SettingsSidebarComponent,
    MatButtonModule,
    MatDialogModule,
    UserPreferencesPageComponent,
  ],
  templateUrl: './user-setting.html',
  styleUrls: ['./user-setting.css']
})
export class UserSettingsComponent {

  //In a real app I would fetch price ID from backend. 
  // Hardcoding for demo purposes as I only have one product,
  // I did not wanted to create an entire endpoint and table for it. 

  subscribe() {
    console.log('Subscribing user to premium plan');
    const PRICE_ID = 'price_1SpPG5A6cwPZWI34Dw6VwG3V'; // your Stripe priceId
    this.stripeService.subscribe(PRICE_ID);
  }


  cancelSubscription() {
    throw new Error('Method not implemented.');
  }


  selectedCategory = 'news';
  username$: Observable<string | null>;
  plantype$: Observable<PlanType>;


  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private stripeService: StripeService
  ) {
    this.username$ = this.authService.username$;
    this.plantype$ = this.authService.planType$;
  }


  onCategoryChange(category: string) {
    this.selectedCategory = category;
  }

  openDeleteDialog() {
    const data: ConfirmDialogData = {
      title: 'Delete Account',
      message: 'Are you sure you want to delete your account?',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      requirePassword: false // password not needed anymore
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return //console.log('Delete cancelled');

      this.authService.deleteAccount().subscribe({
        next: () => {

          alert('Your account has been deleted.');
          this.authService.logout(); // clears JWT + reloads
        },
        error: (err: HttpErrorResponse) => {

          alert('Failed to delete account. Please try again.');
        }
      });
    });
  }
}
