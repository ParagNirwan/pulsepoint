import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(private http: HttpClient) {}

  subscribe(priceId: string): void {
    console.log('Initiating Stripe subscription for priceId:', priceId);
    const token = localStorage.getItem('jwt');
    console.log('JWT:', token );

    if (!token) return;

    this.http.post<{ url: string }>(
      `${environment.apiUrl}/api/stripe/create-checkout-session`,
      { priceId },
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }
    ).subscribe({
      next: (res) => {
        if (res.url) {
          window.location.href = res.url;
        }
      },
      error: (err) => {
        console.error('Stripe checkout failed', err);
      }
    });
  }
}
