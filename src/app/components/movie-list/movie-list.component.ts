// src/app/components/movie-list/movie-list.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.sass'],
  standalone: false,
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  searchForm!: FormGroup;
  // Predefined genres for the dropdown
  availableGenres: string[] = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance'];
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Retrieve the list of movies from the service
    this.movies = this.movieService.getMovies();
    this.filteredMovies = this.movies;

    // Initialize the reactive form for filtering
    this.searchForm = this.fb.group({
      search: [''],
      genres: [[]] // No genres selected initially
    });

    // Subscribe to changes to update the filtered list
    this.searchForm.get('search')?.valueChanges.subscribe(() => {
      this.filterMovies();
    });
    this.searchForm.get('genres')?.valueChanges.subscribe(() => {
      this.filterMovies();
    });

    // Determine if the current user is an admin
    this.isAdmin = this.authService.currentUser?.role === 'admin';
  }

  filterMovies(): void {
    const searchTerm: string = (this.searchForm.get('search')?.value || '').toLowerCase();
    const selectedGenres: string[] = this.searchForm.get('genres')?.value || [];
    this.filteredMovies = this.movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm);
      const matchesGenre =
        selectedGenres.length === 0 || selectedGenres.includes(movie.genre);
      return matchesSearch && matchesGenre;
    });
  }

  // For admin: Navigate to the update movie page
  updateMovie(movie: Movie): void {
    this.router.navigate([`/add-movie/${movie.id}`]);
  }

  toggleSelection(movie: Movie): void {
  const user = this.authService.currentUser;
  if (!user) return;

  // Ensure myList is initialized
  user.myList ??= [];

  const index = user.myList.findIndex(m => m.id === movie.id);

  if (index > -1) {
    // Deselect: remove from myList
    user.myList.splice(index, 1);
  } else {
    // Select: add to myList
    user.myList.push({ ...movie });
  }

  // Persist changes in AuthService
  this.authService.updateCurrentUser(user);

  // Notify any components using the user data that it has changed
  this.authService.notifyUserListChange();
}

  
  isSelected(movie: Movie): boolean {
    const user = this.authService.currentUser;
    return user?.myList?.some(m => m.id === movie.id) ?? false;
  }
  
  rateMovie(movie: Movie, rating: number): void {
    movie.rating = rating;
    this.movieService.updateMovie(movie); // Save globally
  
    const user = this.authService.currentUser;
    if (!user) return;
  
    // Ensure user's myList is initialized
    user.myList ??= [];
  
    const index = user.myList.findIndex(m => m.id === movie.id);
    if (index > -1) {
      user.myList[index].rating = rating; // Update if selected
    }
  
    this.userService.updateUser(user); // Save user
  }
  
}
