import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiBase = 'http://localhost:8080/api/auth';
  private readonly tokenKey = 'cardoc_token';

  constructor(private readonly http: HttpClient) {}

  signUp(payload: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBase}/signup`, payload).pipe(
      tap((res) => this.setToken(res.token))
    );
  }

  signIn(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBase}/signin`, payload).pipe(
      tap((res) => this.setToken(res.token))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return Boolean(localStorage.getItem(this.tokenKey));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
}
