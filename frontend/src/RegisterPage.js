import React, { useState } from "react";
import axios from "axios";

export default function RegisterPage({ onRegisterSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/register", {
        name,
        email,
        password,
      });

      alert(response.data.message);
      onRegisterSuccess();

    } catch (err) {
      console.error("Registration error:", err);

      if (err.response && err.response.data.detail) {
        alert(err.response.data.detail);
      } else {
        alert("Registration failed. Is backend running?");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>

      <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
