import React, { useState, useEffect } from 'react';
import Note from './components/Note';
import noteService from './services/notes';

const App = props => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);

  const addNote = event => {
    event.preventDefault();
    console.log('button clicked', event.target);
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5
    };
    noteService.create(noteObject).then(returnedNote => {
      setNotes([...notes, returnedNote]);
      setNewNote('');
    });
  };

  const handleNoteChange = event => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const toggleImportanceOf = id => {
    const note = notes.find(note => note.id === id);
    const changeNote = { ...note, important: !note.important };

    noteService
      .update(8, changeNote)
      .then(returnedNote => {
        setNotes(notes.map(note => (note.id !== id ? note : returnedNote)));
      })
      .catch(error => {
        console.log(error);

        alert(`the note '${note.content}' was already deleted from server`);
        setNotes(notes.filter(node => node.id !== id));
      });
  };

  const notesToShow = showAll ? notes : notes.filter(note => note.important);
  const rows = () =>
    notesToShow.map(note => (
      <Note
        note={note}
        key={note.id}
        toggleImportance={() => toggleImportanceOf(note.id)}
      />
    ));

  useEffect(() => {
    console.log('effect');

    noteService.getAll().then(initialNotes => setNotes(initialNotes));
  }, []);

  console.log('render', notes.length, 'notes');

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>{rows()}</ul>
      <form onSubmit={addNote}>
        <input onChange={handleNoteChange} value={newNote} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;
