import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.currentUser) {
      // If user is already logged in, redirect to dashboard
      this.router.navigate(['/user-dashboard']);
      return false;
    }
    return true;
  }
}
