import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as tus from 'tus-js-client';

@Injectable({
  providedIn: 'root',
})
export class BunnystreamService {
  private apiUrl = environment.apiUrlBS;
  private apiKey = environment.apiKeyBS;
  private libraryId = 263508;

  constructor(private http: HttpClient) {}

  getCollectionList(): Observable<any> {
    const url = `${this.apiUrl}/collections?page=1&itemsPerPage=100&orderBy=date`;
    const headers = { AccessKey: this.apiKey };
    return this.http.get(url, { headers });
  }

  getCollection(collectionId: string): Observable<any> {
    const url = `${this.apiUrl}/collections/${collectionId}`;
    const headers = { AccessKey: this.apiKey };
    return this.http.get(url, { headers });
  }

  getVideosList(amount?: string): Observable<any> {
    const url = `${this.apiUrl}/videos?page=1&itemsPerPage=${
      amount ? amount : '100'
    }&orderBy=date`;
    const headers = { AccessKey: this.apiKey };
    return this.http.get(url, { headers });
  }

  getCollectionVideosList(collection: string): Observable<any> {
    const url = `${this.apiUrl}/videos?page=1&itemsPerPage=100&collection=${collection}&orderBy=date`;
    const headers = { AccessKey: this.apiKey };
    return this.http.get(url, { headers }).pipe(
      tap((response) => {}),
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

  getVideo(videoId: any): Observable<any> {
    const url = `${this.apiUrl}/videos/${videoId}`;
    const headers = { AccessKey: this.apiKey };
    return this.http.get(url, { headers }).pipe(
      tap((response) => {}),
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

  private signatureExpireSeconds = 3600; // 1 hour from now

  /**
   * Creates a video entry on Bunny.net
   */
  createVideo(title: string, collectionId: string, thumbnailTime?: number) {
    const url = `${this.apiUrl}/videos`;
    const headers = { AccessKey: this.apiKey };
    const body = {
      title,
      collectionId,
      thumbnailTime,
    };
    return this.http
      .post<any>(url, body, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Uploads a video using the TUS protocol with metadata (e.g., difficulty and subcategory)
   */
  // uploadVideoWithTus(
  //   file: File,
  //   videoId: string,
  //   title: string,
  //   collectionId: string,
  //   difficulty: string,
  //   subcategory: string
  // ) {
  //   const expirationTimestamp =
  //     Math.floor(Date.now() / 1000) + this.signatureExpireSeconds;
  //   const signature = this.generateSignature(
  //     this.libraryId,
  //     this.apiKey,
  //     expirationTimestamp,
  //     videoId
  //   );

  //   const upload = new tus.Upload(file, {
  //     endpoint: 'https://video.bunnycdn.com/tusupload',
  //     retryDelays: [0, 3000, 5000, 10000, 20000, 60000],
  //     headers: {
  //       AuthorizationSignature: signature,
  //       AuthorizationExpire: expirationTimestamp.toString(),
  //       VideoId: videoId,
  //       LibraryId: this.libraryId.toString(),
  //     },
  //     metadata: {
  //       filetype: file.type,
  //       title: title,
  //       collection: collectionId,
  //       difficulty,
  //       subcategory,
  //     },
  //     onError: (error: any) => {
  //       console.error('TUS Upload error:', error);
  //     },
  //     onProgress: (bytesUploaded: number, bytesTotal: number) => {
  //       const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
  //       console.log(`Uploaded ${percentage}%`);
  //     },
  //     onSuccess: () => {
  //       console.log('TUS Upload complete!');
  //     },
  //   });

  //   upload.start();
  // }

  async uploadVideoWithTus(
    file: File,
    videoId: string,
    title: string,
    collectionId: string,
    onSuccess?: () => void,
    onError?: (err: any) => void,
    onProgress?: (percent: number) => void
  ) {
    const expirationTimestamp =
      Math.floor(Date.now() / 1000) + this.signatureExpireSeconds;
    const signature = await this.generateSignature(
      this.libraryId,
      this.apiKey,
      expirationTimestamp,
      videoId
    );
    console.log(signature);

    const upload = new tus.Upload(file, {
      endpoint: 'https://video.bunnycdn.com/tusupload',
      retryDelays: [0, 3000, 5000, 10000, 20000, 60000],
      headers: {
        AuthorizationSignature: signature,
        AuthorizationExpire: expirationTimestamp.toString(),
        VideoId: videoId,
        LibraryId: this.libraryId.toString(),
      },
      metadata: {
        filetype: file.type,
        title: title,
        collection: collectionId,
      },
      onError: (error) => {
        console.error('TUS Upload error:', error);
        if (onError) onError(error);
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        const percent = (bytesUploaded / bytesTotal) * 100;
        if (onProgress) onProgress(percent);
      },
      onSuccess: () => {
        console.log('TUS Upload complete!');
        if (onSuccess) onSuccess();
      },
    });

    upload.start();
  }

  /**
   * Creates a SHA256-based signature for the TUS upload
   */
  private async generateSignature(
    libraryId: number,
    apiKey: string,
    expireTime: number,
    videoId: string
  ) {
    const message = `${libraryId}${apiKey}${expireTime}${videoId}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    // Use the Web Crypto API to generate a real SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert the hash to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return hashHex;
  }

  /**
   * Placeholder SHA256 - Replace with real hash logic or API call to backend
   */

  // createVideo(title: string, collectionId: string, thumbnailTime?: number) {
  //   const url = `${this.apiUrl}/videos`;
  //   const headers = { AccessKey: this.apiKey };
  //   const body = {
  //     title: title,
  //     collectionId: collectionId,
  //     thumnailTime: thumbnailTime,
  //   };
  //   return this.http
  //     .post(url, body, { headers })
  //     .pipe(catchError(this.handleError));
  // }

  // uploadVideo(videoId: string, file: File, thumbnailTime?: number) {
  //   const url = `${this.apiUrl}/videos/${videoId}`;
  //   const headers = {
  //     AccessKey: this.apiKey,
  //   };
  //   const formData = new FormData();
  //   formData.append('file', file, file.name);

  //   return this.http
  //     .put(url, file, { headers })
  //     .pipe(catchError(this.handleError));
  // }

  deleteVideo(videoId: string) {
    const url = `${this.apiUrl}/videos/${videoId}`;
    const headers = {
      AccessKey: this.apiKey,
    };

    return this.http
      .delete(url, { headers })
      .pipe(catchError(this.handleError));
  }

  getVideoStatistics(videoGuid: string) {
    const url = `${this.apiUrl}/statistics?hourly=false&videoGuid=${videoGuid}`;
    console.log(url);

    const headers = {
      AccessKey: this.apiKey,
    };

    return this.http.get(url, { headers }).pipe(catchError(this.handleError));
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

  setMetadata(videoId: string, metadata: { [key: string]: string }) {
    const headers = { AccessKey: this.apiKey };

    return this.http
      .post(`${this.apiUrl}/videos/${videoId}/metadata`, metadata, { headers })
      .pipe(
        tap((response) => {}),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('Unauthorized: Check your BunnyStream API key.');
          } else if (error.status === 404) {
            console.error('Not Found: Verify the video ID and URL.');
          } else {
            console.error('An error occurred:', error.message);
          }
          return throwError('Failed to add metadata');
        })
      );
  }
}
