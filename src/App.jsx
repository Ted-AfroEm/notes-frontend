import { useState, useEffect } from "react";
import noteService from "./services/notes";
import Note from "./components/Note";
import Notification from "./components/Notification";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      // id: notes.length + 1,
    };

    noteService.create(noteObject).then((returnedNote) => {
      setNotes([...notes, returnedNote]);
      setNewNote("");
    });
  };
  const handleChange = (event) => {
    setNewNote(event.target.value);
  };

  const tootleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const chnagedNote = { ...note, important: !note.important };

    noteService
      .update(id, chnagedNote)
      .then((returnedNote) => {
        setNotes(notes.map((n) => (n.id !== id ? n : returnedNote)));
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already deleted from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };
  const notesToshow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  const label = showAll ? "show important" : "show All";
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <button
        onClick={() => {
          setShowAll(!showAll);
        }}
      >
        {label}
      </button>
      <ul>
        {notesToshow.map((note) => (
          <Note
            key={note.id}
            note={note}
            tootleImportance={() => tootleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;
