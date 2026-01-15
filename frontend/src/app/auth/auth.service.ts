import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

export type PlanType = 'FREE' | 'PREMIUM';

interface AuthResponse {
    token: string;
    username?: string;
    planType: PlanType;
}

interface JwtPayload {
    sub: string;
    exp: number;
    planType?: PlanType;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    private baseUrl = 'http://localhost:8080/api/auth';

    private usernameSubject = new BehaviorSubject<string | null>(this.decodeUsername());
    username$ = this.usernameSubject.asObservable();

    private planTypeSubject = new BehaviorSubject<PlanType>(this.getStoredPlanType());
    planType$ = this.planTypeSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {}

    /* =========================
       Auth
       ========================= */

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.baseUrl}/login`, { email, password })
            .pipe(
                tap(res => {
                    this.setSession(res.token, res.planType);
                })
            );
    }

    logout() {
        localStorage.removeItem('jwt');
        localStorage.removeItem('planType');
        this.usernameSubject.next(null);
        this.planTypeSubject.next('FREE');
        this.router.navigate(['/login']);
    }

    /* =========================
       Token handling
       ========================= */

    private setSession(token: string, planType: PlanType) {
        localStorage.setItem('jwt', token);
        localStorage.setItem('planType', planType);

        this.usernameSubject.next(this.decodeUsername());
        this.planTypeSubject.next(planType);
    }

    getToken(): string | null {
        return localStorage.getItem('jwt');
    }

    /* =========================
       Plan helpers (USE THESE)
       ========================= */

    getPlanType(): PlanType {
        return this.planTypeSubject.value;
    }

    isPremium(): boolean {
        return this.getPlanType() !== 'FREE';
    }

    /* =========================
       Account
       ========================= */

    deleteAccount(): Observable<void> {
        const token = this.getToken();
        if (!token) throw new Error('No JWT token found');

        return this.http.delete<void>(
            'http://localhost:8080/user',
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    }

    /* =========================
       JWT decoding
       ========================= */

    private decodeUsername(): string | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const decoded = jwt_decode<JwtPayload>(token);
            return decoded.sub ?? null;
        } catch (e) {
            console.error('Invalid JWT', e);
            return null;
        }
    }

    private getStoredPlanType(): PlanType {
        return (localStorage.getItem('planType') as PlanType) ?? 'FREE';
    }

    /* =========================
       App startup restore
       ========================= */

    restoreSession() {
        const token = this.getToken();
        if (!token) return;

        try {
            const decoded = jwt_decode<JwtPayload>(token);
            const planType = decoded.planType ?? 'FREE';

            localStorage.setItem('planType', planType);
            this.usernameSubject.next(decoded.sub);
            this.planTypeSubject.next(planType);
        } catch {
            this.logout();
        }
    }
}
