package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {
  private final NoteRepository repo;

  public NoteController(NoteRepository repo) { this.repo = repo; }

  @GetMapping
  public List<Note> getAll() {
    return repo.findAll();
  }

  @PostMapping
  public Note create(@RequestBody Note note) {
    if (note.getText() == null || note.getText().trim().isEmpty()) {
      note.setText("(empty)");
    }
    return repo.save(note);
  }
}
