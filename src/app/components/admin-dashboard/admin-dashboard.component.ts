// src/app/components/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MovieService } from '../../services/movie.service';
import { User } from '../../models/user.model';
import { Movie } from '../../models/movie.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.sass'],
  standalone: false,
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  movies: Movie[] = [];
 

  constructor(
    private userService: UserService,
    private movieService: MovieService,   
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.users$.subscribe(users => {
      this.users = users;
    });
    this.loadData();
    
  }

  loadData(): void {
    console.log('Loading user data...');
    this.users = this.userService.getUsers();
    this.movies = this.movieService.getMovies();
  }

  // Navigate to Add User Component
  goToAddUser(): void {
    this.router.navigate(['/add-user']);
  }

  // Navigate to Add Movie Component
  goToAddMovie(): void {
    this.router.navigate(['/add-movie']);
  }

  // Remove user with confirmation
  removeUser(username: string): void {
    if (confirm(`Are you sure you want to remove user ${username}?`)) {
      this.userService.removeUser(username);
      this.loadData();
    }
  }

  // Remove movie with confirmation
  removeMovie(id: number): void {
    if (confirm('Are you sure you want to remove this movie/series?')) {
      this.movieService.removeMovie(id);
      this.loadData();
    }
  }
}
