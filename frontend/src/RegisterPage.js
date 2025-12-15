import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function RegisterPage({ onRegisterSuccess, onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const register = () => {
    if (!name || !email || !password) {
      alert("Fill all fields");
      return;
    }

    localStorage.setItem(
      "career_user",
      JSON.stringify({ name, email, password })
    );

    onRegisterSuccess();
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD WITH EYE ICON */}
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </span>
        </div>

        <button onClick={register}>Register</button>

        <div className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => onSwitch("login")}>Login</span>
        </div>
      </div>
    </div>
  );
}
