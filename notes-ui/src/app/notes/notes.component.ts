import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../services/note.service';
import { Note } from '../models/note';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Enter Data</h2>

    <form (ngSubmit)="save()" #f="ngForm" class="form">
      <label>
        Title
        <input name="title" [(ngModel)]="form.title" required />
      </label>

      <label>
        Content
        <input name="content" [(ngModel)]="form.content" required />
      </label>

      <button [disabled]="f.invalid || saving()">Save</button>
    </form>

    <p *ngIf="saving()">Saving...</p>

    <h3>Saved Rows</h3>
    <table *ngIf="rows().length">
      <thead><tr><th>ID</th><th>Title</th><th>Content</th><th>Actions</th></tr></thead>
      <tbody>
        <tr *ngFor="let n of rows()">
          <td>{{ n.id }}</td>
          <td><input [(ngModel)]="n.title" name="t{{n.id}}" /></td>
          <td><input [(ngModel)]="n.content" name="c{{n.id}}" /></td>
          <td>
            <button (click)="update(n)">Update</button>
            <button (click)="remove(n)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    .form { display:grid; grid-template-columns: 1fr 1fr; gap:12px; max-width:640px; }
    label { display:flex; flex-direction:column; gap:4px; }
    table { margin-top:16px; border-collapse:collapse; }
    th, td { border:1px solid #ccc; padding:6px 8px; }
    button { margin-right:6px; }
  `]
})
export class NotesComponent {
  private api = inject(NoteService);

  rows = signal<Note[]>([]);
  saving = signal(false);
  form: Note = { title: '', content: '' };

  constructor() { this.refresh(); }

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
