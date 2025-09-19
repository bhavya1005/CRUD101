import { Component } from '@angular/core';
import { NotesComponent } from './notes/notes.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NotesComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
