// src/app/services/movie.service.ts
import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private storageKey = 'movies';
  private movies: Movie[] = [];

  private selectedMoviesSubject = new BehaviorSubject<Movie[]>([]); 
  movies$ = this.selectedMoviesSubject.asObservable();

  constructor(private userService : UserService) { 
    this.movies = this.loadMovies();
    this.selectedMoviesSubject.next(this.movies);
  }

  

  private loadMovies(): Movie[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  getMovies(): Movie[] {
    const movies = localStorage.getItem(this.storageKey);
    return movies ? JSON.parse(movies) : [];
  }

  saveMovies(movies: Movie[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(movies));
  }

  addMovie(movie: Movie): void {
    const movies = this.getMovies();
    movies.push(movie);
    this.saveMovies(movies);
  }

  private saveAndEmit(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.movies));  // Save movies to localStorage
    this.selectedMoviesSubject.next(this.movies); // Emit the updated list to subscribers
  }

  updateMovie(updatedMovie: Movie): void {
    const index = this.movies.findIndex(movie => movie.id === updatedMovie.id);
    if (index !== -1) {
      this.movies[index] = { ...updatedMovie };  // Update the movie object
      this.saveAndEmit();  // Save to localStorage and emit the update
    }
  }
  removeMovie(id: number): void {
    let movies = this.getMovies();
    movies = movies.filter(movie => movie.id !== id);
    this.saveMovies(movies);
  }
  updateSelectedMovies(movies: Movie[]) {
    this.selectedMoviesSubject.next(movies);
  }
  updateUserSelectedMovies(updatedMovie: Movie): void {
    const currentUser = this.userService.getUsers().find((user: User) => user.username === 'admin'); // Assume 'admin' user
    if (currentUser) {
      const selectedMovies = currentUser.myList || [];
      const movieIndex = selectedMovies.findIndex((movie) => movie.id === updatedMovie.id);

      if (movieIndex !== -1) {
        // Update the movie rating if the movie exists in the user's selected list
        selectedMovies[movieIndex] = { ...updatedMovie };
      }

      // Emit updated selected movies list
      currentUser.myList = selectedMovies;
      this.userService.updateUser(currentUser); // Save user updates
      this.selectedMoviesSubject.next(selectedMovies); // Emit updated selected movies
    }
  }
  getSelectedMoviesStream() {
    return this.movies$;
  }
}
