import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import API from "../api/axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
      branch: "",
      graduationYear: "",
    });

  const [showPassword, setShowPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData(
      (previousData) => ({
        ...previousData,
        [name]: value,
      })
    );
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setMessage("");

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setMessage(
        "Password and confirm password do not match"
      );

      return;
    }

    if (
      formData.password.length < 6
    ) {
      setMessage(
        "Password must contain at least 6 characters"
      );

      return;
    }

    setLoading(true);

    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password:
          formData.password,
        role: formData.role,
        branch: formData.branch,
        graduationYear: Number(
          formData.graduationYear
        ),
      };

      await API.post(
        "/auth/register",
        registerData
      );

      setMessage(
        "Registration successful. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setMessage(
        error.response?.data
          ?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <form
        className="register-card"
        onSubmit={handleSubmit}
      >
        <h1>
          Create Account
        </h1>

        <p className="register-subtitle">
          Join the AlumniConnect
          community
        </p>

        <label htmlFor="name">
          Full Name
        </label>

        <input
          id="name"
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">
          Email
        </label>

        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <label htmlFor="password">
          Password
        </label>

        <input
          id="password"
          type={
            showPassword
              ? "text"
              : "password"
          }
          name="password"
          placeholder="Enter your password"
          value={
            formData.password
          }
          onChange={handleChange}
          minLength="6"
          autoComplete="new-password"
          required
        />

        <label
          htmlFor="confirmPassword"
        >
          Confirm Password
        </label>

        <input
          id="confirmPassword"
          type={
            showPassword
              ? "text"
              : "password"
          }
          name="confirmPassword"
          placeholder="Enter password again"
          value={
            formData.confirmPassword
          }
          onChange={handleChange}
          minLength="6"
          autoComplete="new-password"
          required
        />

        <div className="show-password">
          <input
            id="showPassword"
            type="checkbox"
            checked={showPassword}
            onChange={() =>
              setShowPassword(
                !showPassword
              )
            }
          />

          <label
            htmlFor="showPassword"
          >
            Show password
          </label>
        </div>

        <label htmlFor="role">
          Account Type
        </label>

        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="student">
            Student
          </option>

          <option value="alumni">
            Alumni
          </option>
        </select>

        <label htmlFor="branch">
          Branch
        </label>

        <input
          id="branch"
          type="text"
          name="branch"
          placeholder="Information Technology"
          value={formData.branch}
          onChange={handleChange}
          required
        />

        <label
          htmlFor="graduationYear"
        >
          Graduation Year
        </label>

        <input
          id="graduationYear"
          type="number"
          name="graduationYear"
          placeholder="2027"
          min="1950"
          max="2100"
          value={
            formData.graduationYear
          }
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating account..."
            : "Register"}
        </button>

        {message && (
          <p className="register-message">
            {message}
          </p>
        )}

        <p className="login-link">
          Already have an
          account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;