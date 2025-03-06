import { useState } from "react";
import api from "../api.js";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator.jsx";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(route, { username, password });

      if (method === "login") {
        console.log("Login response:", res.data); // Debugging

        // ✅ FIX: Store tokens correctly
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

        console.log("Stored Token:", localStorage.getItem(ACCESS_TOKEN));

        navigate("/"); // Redirect to home after login
      } else {
        navigate("/login"); // Redirect to login after registration
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.detail || "Login failed! Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{method === "login" ? "Login" : "Register"}</h1>
      <input
        className="form-input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        className="form-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {loading && <LoadingIndicator/>}
      <button className="form-button" type="submit" disabled={loading}>
        {loading ? "Processing..." : method === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
}

export default Form;
