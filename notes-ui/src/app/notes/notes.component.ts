import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../services/note.service';
import { Note } from '../models/note';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>Enter a New Note</h2>

      <form (ngSubmit)="save()" #f="ngForm" class="form">
        <input
          name="title"
          [(ngModel)]="form.title"
          placeholder="Title"
          required
        />
        <input
          name="content"
          [(ngModel)]="form.content"
          placeholder="Content"
          required
        />
        <button class="btn" [disabled]="f.invalid || saving()">Save</button>
      </form>

      <p *ngIf="saving()" class="muted">Saving...</p>

      <h3>Saved Notes</h3>
      <table *ngIf="rows().length" class="notes-table">
        <thead>
          <tr><th>ID</th><th>Title</th><th>Content</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let n of rows()">
            <td>{{ n.id }}</td>
            <td><input [(ngModel)]="n.title" name="t{{n.id}}" /></td>
            <td><input [(ngModel)]="n.content" name="c{{n.id}}" /></td>
            <td>
              <button class="btn small" (click)="update(n)">Update</button>
              <button class="btn danger small" (click)="remove(n)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p *ngIf="!rows().length" class="muted">No notes yet. Add your first one!</p>
    </div>
  `,
  styles: [`
    .card {
      max-width: 760px;
      margin: 20px auto;
      padding: 24px;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      text-align: center;
    }
    h2, h3 { margin: 0 0 16px; color: #2c3e50; }
    .muted { color: #666; margin: 8px 0 0; }

    .form {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 12px;
      margin-bottom: 20px;
      align-items: center;
    }
    input {
      padding: 10px;
      border: 1px solid #dcdcdc;
      border-radius: 8px;
      font-size: 14px;
    }
    .btn {
      background: #3478f6;
      color: #fff;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: background .2s;
    }
    .btn:hover { background: #2b67d1; }
    .btn.small { padding: 6px 10px; font-size: 13px; }
    .btn.danger { background: #e74c3c; }
    .btn.danger:hover { background: #c0392b; }

    .notes-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    .notes-table th, .notes-table td {
      border: 1px solid #eee;
      padding: 10px;
      text-align: left;
    }
    .notes-table th { background: #f9fafb; }
    .notes-table input {
      width: 100%;
      box-sizing: border-box;
      padding: 8px;
    }
  `]
})
export class NotesComponent {
  private api = inject(NoteService);

  rows = signal<Note[]>([]);
  saving = signal(false);
  form: Note = { title: '', content: '' };

  constructor() {
    this.refresh();
  }

  refresh() {
    this.api.list().subscribe(data => this.rows.set(data));
  }

  save() {
    this.saving.set(true);
    this.api.create(this.form).subscribe({
      next: (n) => {
        this.rows.update(arr => [n, ...arr]);
        this.form = { title: '', content: '' };
        this.saving.set(false);
      },
      error: () => this.saving.set(false)
    });
  }

  update(n: Note) {
    if (!n.id) return;
    this.api.update(n.id, n).subscribe(() => this.refresh());
  }

  remove(n: Note) {
    if (!n.id) return;
    this.api.delete(n.id).subscribe(() =>
      this.rows.update(arr => arr.filter(x => x.id !== n.id))
    );
  }
}
