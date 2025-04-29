// src/app/components/add-update-movie/add-update-movie.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.sass'],
  standalone: false,
})
export class AddMovieComponent implements OnInit {
  movieForm!: FormGroup;
  availableGenres: string[] = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance'];
  isEditMode: boolean = false;
  movieId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the reactive form
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      genre: ['', Validators.required],
      details: ['']
    });

    // Check for an 'id' parameter to determine if we're in edit mode
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.movieId = Number(idParam);
        // Load movie details to update
        const movies = this.movieService.getMovies();
        const movie = movies.find(m => m.id === this.movieId);
        if (movie) {
          this.movieForm.patchValue({
            title: movie.title,
            genre: movie.genre,
            details: movie.details || ''
          });
        } else {
          this.snackBar.open('Movie not found', 'Close', { duration: 3000 });
          this.router.navigate(['/movies']);
        }
      }
    });
  }

  submitMovie(): void {
    if (this.movieForm.invalid) return;

    if (this.isEditMode) {
      // Update existing movie
      const updatedMovie: Movie = {
        id: this.movieId,
        ...this.movieForm.value
      };
      this.movieService.updateMovie(updatedMovie);
      this.snackBar.open('Movie updated successfully', 'Close', { duration: 3000 });
    } else {
      // Add new movie; generate a new id using Date.now()
      const newMovie: Movie = {
        id: Date.now(),
        ...this.movieForm.value
      };
      this.movieService.addMovie(newMovie);
      this.snackBar.open('Movie added successfully', 'Close', { duration: 3000 });
    }
    this.router.navigate(['/movies']);
  }
}
