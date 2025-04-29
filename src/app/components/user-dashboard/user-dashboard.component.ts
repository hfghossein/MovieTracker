import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Movie } from '../../models/movie.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.sass'],
  standalone: false,
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  currentUser: any; // To hold the current user data
  selectedMovies: Movie[] = [];
  private subscription!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to currentUser$ to get updates when myList changes
    this.subscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.selectedMovies = user?.myList || []; // Update selectedMovies with myList
    });
  }

  ngOnDestroy(): void {
    // Clean up the subscription to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
