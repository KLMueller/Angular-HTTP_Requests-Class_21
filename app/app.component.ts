import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movie } from './movie.model';
import { MoviesService } from './movie.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loadedMovies: Movie[] = [];
  //Exercise 1.3: Add a loading icon when sending a get request to firebase
  isFetching = false;
  // Exercise 1.5: Output an error message when retrieving an error response
  error = null;

  constructor(private http: HttpClient, private MoviesService: MoviesService) {}

  ngOnInit() {
    this.onFetchMovies();
  }

  onCreateMovie(movieData: Movie) {
    // moved to movie.services
    // Exercise 1.1: Send a Post request to firebase to add movie data
    // Exercise 1.6: Separate the logic of HTTP requests into a service
    this.MoviesService.createMovie(movieData.title, movieData.genre);
  }

  onFetchMovies() {
    // Send Http request
    this.fetchMovies();
  }
  onClearMovies() {
    // Send Http request
    this.MoviesService.deleteMovies().subscribe(() => (this.loadedMovies = []));
  }
  // Exercise 1.4: Send a delete request to delete all movie data
  fetchMovies() {
    // Notice difference here from the previous lesson:
    // Return the Observable. HTTP request is not sent at this point since
    // subscribe is not called here. It is now called in the AppComponent.
    return this.http.get<{ [key: string]: Movie }>(MoviesService.url).pipe(
      map((responseData) => {
        const MoviesArray: Movie[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            MoviesArray.push({ ...responseData[key], id: key });
          }
        }
        return MoviesArray;
