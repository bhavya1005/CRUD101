package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")  // allow Angular dev server
@RestController
@RequestMapping("/api/notes")
public class NoteController {
  private final NoteRepository repo;
  public NoteController(NoteRepository repo) { this.repo = repo; }

  @GetMapping
  public List<Note> getAll() { return repo.findAll(); }

  @PostMapping
  public Note create(@RequestBody Note note) { return repo.save(note); }

  @PutMapping("/{id}")
  public Note update(@PathVariable Long id, @RequestBody Note note) {
    note.setId(id);
    return repo.save(note);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) { repo.deleteById(id); }
}
