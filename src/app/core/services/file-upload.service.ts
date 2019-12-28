import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileDTO, FileToUpload } from '../models/file.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  public uploadImg(file: FileToUpload): Observable<FileDTO> {
    // eslint-disable-next-line no-undef
    const formData: FormData = new FormData();
    formData.append('file', file.file);
    formData.append('filename', file.filename);
    const url = `${environment.apiUrl}/img_objects`;
    return this.http.post<FileDTO>(url, formData);
  }
}
