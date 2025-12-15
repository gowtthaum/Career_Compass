import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function LoginPage({ onLoginSuccess, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const login = () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("career_user"));

    if (
      savedUser &&
      savedUser.email === email &&
      savedUser.password === password
    ) {
      onLoginSuccess(savedUser);
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>Login</h2>

        {error && <p className="error-text">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD WITH EYE ICON */}
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </span>
        </div>

        <button onClick={login}>Login</button>

        <div className="auth-switch">
          Don’t have an account?{" "}
          <span onClick={() => onSwitch("register")}>Create Account</span>
        </div>
      </div>
    </div>
  );
}
