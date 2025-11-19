import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaTransferService {
  // serverUrl refers to backend URL
  private apiURL = `${environment.serverUrl}/media-transfer`;


  constructor(private httpClient: HttpClient) { }

  // Upload File
  uploadFile(username: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient.post(`${this.apiURL}/upload-files/${username}`, formData);
  }

  // Send all the files to the backend
  uploadMultipleFiles(username: string, uid: string, files: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('uid', uid);
    files.forEach(file => {
      formData.append('files', file);
    });

    return this.httpClient.post(`${this.apiURL}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  // Download File
  downloadFile(username: string, fileId: string): Observable<any> {
    return this.httpClient.get(`${this.apiURL}/get-media-link/${username}/${fileId}`, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  getDownloadUrl(username: string, fileId: string): string {
    return `${this.apiURL}/get-media-link/${username}/${fileId}`;
  }

  checkFileExists(username: string, fileId: string): Observable<any> {
    return this.httpClient.head(`${this.apiURL}/get-media-link/${username}/${fileId}`, { observe: 'response' });
  }

  ensureUserDirectory(username: string): Promise<any> {
    return this.httpClient.post(`${this.apiURL}/ensure-directory/${username}`, {}).toPromise();
  }

  // Send Email (updated by Jisan 3/25/2025)
  sendEmail(username: string, uid: string, fileName: string, subject?: string, body?: string, sender?: string): Observable<any> {
    let params = new HttpParams()
      .set ('email', username)
      .set('uid', uid)
      .set ('fileName', fileName);

    if (subject){
params = params.set('subject', subject);
}
    if (body){
params = params.set('body', body);
}
    if (sender){
params = params.set('sender', sender);
}

    return this.httpClient.get(`${this.apiURL}/send-email-info`, { params });
  }

}
