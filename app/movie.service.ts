// Exercise 1.6: Separate the logic of HTTP requests into a service
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Movie } from './Movie.model';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  static readonly url =
    'https://movies-project-505d9-default-rtdb.firebaseio.com/movies.json';
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createMovie(title: string, genre: string) {
    // Exercise 1.1: Send a Post request to firebase to add movie data
    // Send Http request
    const MovieData: Movie = { title: title, genre: genre };
    this.http
      .post<{ name: string }>(MoviesService.url, MovieData)
      // subscribe to the result of the request. Normally we would
      // do this in the AppComponent. We only do it here as this is a rare case
      // where we do not care about the response in the AppComponent.
      .subscribe(
        (responseData) => console.log(responseData),
        (error: HttpErrorResponse) => this.error.next(error.message)
      );
  }

  fetchMovies() {
    // Return the Observable. HTTP request is not sent at this point since
    // subscribe is not called here. It is now called in the AppComponent.
    // Exercise 1.2: Send a get request to firebase to retrieve movie data
    return this.http.get<{ [key: string]: Movie }>(MoviesService.url).pipe(
      map((responseData) => {
        const MoviesArray: Movie[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            MoviesArray.push({ ...responseData[key], id: key });
          }
        }
        return MoviesArray;
      })
    );
  }
  // Exercise 1.4: Send a delete request to delete all movie data
  deleteMovies() {
    return this.http.delete(MoviesService.url);
  }
}

// this.MoviesService.fetchMovies().subscribe(
//   (movies) => {
//     this.isFetching = false;
//     this.loadedMovies = movies;
//   },
//   (error) => {
//     this.error = error.message;
//   }
// );
