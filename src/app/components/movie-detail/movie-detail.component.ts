// src/app/components/movie-detail/movie-detail.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.sass'],
  standalone: false,

})
export class MovieDetailComponent implements OnInit {
  movie!: Movie;
  ratingForm!: FormGroup;


  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Retrieve the movie id from the route parameters
    const movieId = Number(this.route.snapshot.paramMap.get('id'));
    const movies = this.movieService.getMovies();
    this.movie = movies.find(m => m.id === movieId)!;

    // Initialize the form group with a rating control
    this.ratingForm = this.fb.group({
      rating: [this.movie.rating || 0, [Validators.required, Validators.min(0), Validators.max(5)]]
    });
  }

  rateMovie(): void {
    if (this.ratingForm.valid) {
      // Update the movie rating with the value from the form control
      this.movie.rating = this.ratingForm.get('rating')?.value;
      this.movieService.updateMovie(this.movie);
      this.snackBar.open('Rating saved!', 'Close', { duration: 3000 });
    }
  }
}
