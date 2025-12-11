// src/LoginPage.js
import React, { useState } from "react";
import axios from "axios";

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!email || !password) return alert("Enter email & password");

    try {
      const res = await axios.post("http://127.0.0.1:8000/login", {
        email,
        password
      });

      onLoginSuccess(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <input 
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input 
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>
    </div>
  );
}
