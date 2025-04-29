// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  standalone: false,
})
export class AppComponent implements OnInit {
  showNavbar = true;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Hide navbar on the login page
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showNavbar = event.url !== '/login';
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Helper function to check if the current user is an admin.
  isAdmin(): boolean {
    return this.authService.currentUser?.role === 'admin';
  }
}
