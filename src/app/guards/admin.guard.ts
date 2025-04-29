// src/app/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.currentUser;
    if (user && user.role === 'admin') {
      return true;
    }
    // Redirect non-admin users to their dashboard or another allowed page
    this.router.navigate(['/user-dashboard']);
    return false;
  }
}
