const Note = ({ note, tootleImportance }) => {
  const label = note.important ? "make not important" : "make important";
  return (
    <li className="note">
      {note.content}
      <button onClick={tootleImportance}>{label}</button>
    </li>
  );
};

export default Note;
