import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => {
                console.log("Fetched Notes:", res.data); // Debugging output
                setNotes(res.data);
            })
            .catch((err) => {
                console.error("Error fetching notes:", err.response?.data || err);
                alert("Failed to fetch notes.");
            });
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) {
                    alert("Note deleted!");
                    getNotes();
                } else {
                    alert("Failed to delete note.");
                }
            })
            .catch((error) => {
                console.error("Error deleting note:", error.response?.data || error);
                alert("Error deleting note.");
            });
    };

    const createNote = (e) => {
        e.preventDefault();
        console.log("Creating note with:", { title, content }); // Debugging output

        api
            .post("/api/notes/", { title, content })
            .then((res) => {
                if (res.status === 201) {
                    alert("Note created!");
                    setTitle(""); // Clear input fields
                    setContent("");
                    getNotes();
                } else {
                    alert("Failed to make note.");
                }
            })
            .catch((err) => {
                console.error("Error creating note:", err.response?.data || err);
                alert("Error creating note.");
            });
    };

    return (
        <div>
            <h2>Notes</h2>
            {notes.length > 0 ? (
                notes.map((note) => <Note note={note} onDelete={deleteNote} key={note.id} />)
            ) : (
                <p>No notes found.</p>
            )}
            
            <h2>Create a Note</h2>
            <form onSubmit={createNote}>
                <label htmlFor="title">Title:</label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <label htmlFor="content">Content:</label>
                <br />
                <textarea
                    id="content"
                    name="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <br />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default Home;
