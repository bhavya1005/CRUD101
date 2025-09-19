import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Note } from '../models/note';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NoteService {
  private http = inject(HttpClient);
  private base = '/api/notes'; // proxied to 8082

  list(): Observable<Note[]> {
    return this.http.get<Note[]>(this.base);
  }

  create(note: Note): Observable<Note> {
    return this.http.post<Note>(this.base, note);
  }

  update(id: number, note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.base}/${id}`, note);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
