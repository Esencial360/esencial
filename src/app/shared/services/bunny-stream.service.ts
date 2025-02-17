import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BunnystreamService {
  private apiUrl = 'https://video.bunnycdn.com/library/263508';
  private apiKey = 'ef2617f6-6d44-4df4-a35b942cef57-555c-4302';

  constructor(private http: HttpClient) { }

  getCollectionList(): Observable<any> {
    const url = `${this.apiUrl}/collections?page=1&itemsPerPage=100&orderBy=date`;
    const headers = { 'AccessKey': this.apiKey };
    return this.http.get(url, { headers });
  }
  
  getCollection(collectionId: string): Observable<any> {
    const url = `${this.apiUrl}/collections/${collectionId}`;
    const headers = { 'AccessKey': this.apiKey };
    return this.http.get(url, { headers });
  }

  getVideosList(): Observable<any> {
    const url = `${this.apiUrl}/videos?page=1&itemsPerPage=100&orderBy=date`;
    const headers = { 'AccessKey': this.apiKey };
    return this.http.get(url, { headers });
  }

  
getCollectionVideosList(collection: string): Observable<any> {
    console.log(collection);
    
    const url = `${this.apiUrl}/videos?page=1&itemsPerPage=100&collection=${collection}&orderBy=date`;
    const headers = { 'AccessKey': this.apiKey };
    return this.http.get(url, { headers }).pipe(   
      tap(response => {
      console.log('Full response:', response); 
    }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error('Unauthorized: Check your BunnyStream API key.');
        } else if (error.status === 404) {
          console.error('Not Found: Verify the video ID and URL.');
        } else {
          console.error('An error occurred:', error.message);
        }
        return throwError('Failed to fetch video');
      })
    );
  }

  // getVideo(videoId: string): Observable<any> {
  //   console.log(videoId)
  //   const url = `https://video.bunnycdn.com/library/248742/videos/8a68a656-e0b1-4341-aa55-a96a979e0a9c`
  //   const headers = { 'AccessKey': this.apiKey };
  //   return this.http.get(url, { headers });
  // }
  getVideo(videoId: any): Observable<any> {
    const url = `${this.apiUrl}/videos/${videoId}`;
    const headers = { 'AccessKey': this.apiKey };
    return this.http.get(url, { headers }).pipe(   
      tap(response => {
      console.log('Full response:', response); 
      console.log('Video data:', response);
    }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error('Unauthorized: Check your BunnyStream API key.');
        } else if (error.status === 404) {
          console.error('Not Found: Verify the video ID and URL.');
        } else {
          console.error('An error occurred:', error.message);
        }
        return throwError('Failed to fetch video'); // Or handle the error differently
      })
    );
  }

  createVideo(title: string, collectionId: string, thumbnailTime?: number) {
    const url = `${this.apiUrl}/videos`;
    const headers = { 'AccessKey': this.apiKey };
    const body = {
      title: title,
      collectionId: collectionId,
      thumnailTime: thumbnailTime
    };
    return this.http.post(url, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  uploadVideo(videoId: string, file: File, thumbnailTime?: number) {
    const url = `${this.apiUrl}/videos/${videoId}`;
    const headers = {
      'AccessKey': this.apiKey
    };
    const formData = new FormData();
    formData.append('file', file, file.name);
  
    return this.http.put(url, file, { headers  }).pipe(
      catchError(this.handleError)
    );
  }

  deleteVideo(videoId: string) {
    const url = `${this.apiUrl}/videos/${videoId}`;
    const headers = {
      'AccessKey': this.apiKey
    };

    return this.http.delete(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getVideoStatistics(videoGuid: string) {
    const url = `${this.apiUrl}/statistics?hourly=false&videoGuid=${videoGuid}`;
    console.log(url);
    
    const headers = {
      'AccessKey': this.apiKey
    };

    return this.http.get(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}