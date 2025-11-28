import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

interface AuthResponse {
    token: string;
    username?: string;
}

interface JwtPayload {
    sub: string;
    exp: number;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl = 'http://localhost:8080/api/auth';

    // reactive username observable
    private usernameSubject = new BehaviorSubject<string | null>(this.decodeUsername());
    username$ = this.usernameSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) { }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email, password });
    }

    setToken(token: string) {
        localStorage.setItem('jwt', token);
        this.usernameSubject.next(this.decodeUsername());
    }

    getToken(): string | null {
        return localStorage.getItem('jwt');
    }

    logout() {
        localStorage.removeItem('jwt');
        this.usernameSubject.next(null);
        this.router.navigate(['/login']);
    }

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

    async getUsername(): Promise<string | null> {
        return this.decodeUsername();
    }

    private decodeUsername(): string | null {
        const token = this.getToken();
        if (!token) return null;
        try {
            const decoded = jwt_decode(token) as JwtPayload & any;
            // try common fields in order
            return decoded.sub ?? decoded.username ?? decoded.email ?? null;
        } catch (e) {
            console.error('Invalid JWT', e);
            return null;
        }
    }
}
