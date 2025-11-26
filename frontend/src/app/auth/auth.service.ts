import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

interface AuthResponse {
    token: string;
    username?: string;
}

interface JwtPayload {
    sub: string; // username
    exp: number;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl = 'http://localhost:8080/api/auth';

    constructor(private http: HttpClient, private router: Router) { }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email, password });
    }

    setToken(token: string) {
        localStorage.setItem('jwt', token);
    }

    getToken(): string | null {
        return localStorage.getItem('jwt');
    }

    logout() {
        localStorage.removeItem('jwt');
        this.router.navigate(['/login']);
    }

    deleteAccount(): Observable<void> {
        const token = this.getToken();
        if (!token) throw new Error('No JWT token found');

        return this.http.delete<void>(
            'http://localhost:8080/user', // adjust if your backend route uses /api/user
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    }






    async getUsername(): Promise<string | null> {
        const token = this.getToken();
        if (!token) return null;

        try {
            const decoded = jwt_decode(token) as JwtPayload;
            return decoded.sub;
        } catch (e) {
            console.error('Invalid JWT', e);
            return null;
        }
    }
}
