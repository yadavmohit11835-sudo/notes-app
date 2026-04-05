import { useState, useEffect } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function login() {
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Login Success 🔥");
        getNotes();
      } else {
        alert("Login Failed ❌");
      }
    } catch (err) {
      alert("Server error ❌");
    }
  }

  async function getNotes() {
    try {
      const res = await fetch("http://localhost:3000/notes", {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });

      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function addNote() {
    try {
      await fetch("http://localhost:3000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        },
        body: JSON.stringify({ title, content })
      });

      setTitle("");
      setContent("");
      getNotes();
    } catch (err) {
      alert("Error adding note ❌");
    }
  }

  async function deleteNote(id) {
    await fetch(`http://localhost:3000/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token")
      }
    });

    getNotes();
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getNotes();
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Notes App 🔥</h1>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <br /><br />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />
      <button onClick={login}>Login</button>

      <hr />

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />
      <input
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <br /><br />
      <button onClick={addNote}>Add Note</button>

      <hr />

      {notes.map((note) => (
        <div key={note._id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <button onClick={() => deleteNote(note._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;