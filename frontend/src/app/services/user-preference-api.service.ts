import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserPreferencesRequest {
  country: string;
  languages: string[];
  categories: string[];
}

export interface UserPreferencesResponse {
  country: string;
  languages: string[];
  categories: string[];
}

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesApiService {
  private readonly baseUrl = `${environment.apiUrl}/api/user/preferences`;

  constructor(private http: HttpClient) {}

  getPreferences(): Observable<UserPreferencesResponse> {
    return this.http.get<UserPreferencesResponse>(this.baseUrl);
  }

  savePreferences(payload: UserPreferencesRequest): Observable<UserPreferencesResponse> {
    return this.http.post<UserPreferencesResponse>(this.baseUrl, payload);
  }
}
