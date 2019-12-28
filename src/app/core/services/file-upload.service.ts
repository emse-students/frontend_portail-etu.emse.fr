import { Injectable } from '@angular/core';
import { FileDTO, FileToUpload } from '../models/file.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  public uploadImg(file: FileToUpload): Observable<FileDTO> {
    const formData: FormData = new FormData();
    formData.append('file', file.file);
    formData.append('filename', file.filename);
    const url = `${environment.apiUrl}/img_objects`;
    return this.http.post<FileDTO>(url, formData);
  }
}
