import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import API from "../api/axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

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

    setLoading(true);
    setMessage("");

    try {
      const response =
        await API.post(
          "/auth/login",
          formData
        );

      const { token, user } =
        response.data;

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );
    } catch (error) {
      setMessage(
        error.response?.data
          ?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left information section */}

        <section className="login-brand-section">
          <div className="brand-logo">
            AC
          </div>

          <h1>
            AlumniConnect
          </h1>

          <h2>
            Connect. Learn. Grow.
          </h2>

          <p className="brand-description">
            Build meaningful connections
            between students and alumni.
            Discover mentors, share
            experiences, and explore
            career opportunities.
          </p>

          <div className="login-features">
            <div className="login-feature">
              <span>
                🎓
              </span>

              <div>
                <h3>
                  Discover Alumni
                </h3>

                <p>
                  Find alumni based on
                  branch, company, skills,
                  and graduation year.
                </p>
              </div>
            </div>

            <div className="login-feature">
              <span>
                🤝
              </span>

              <div>
                <h3>
                  Get Mentorship
                </h3>

                <p>
                  Connect with experienced
                  alumni and receive career
                  guidance.
                </p>
              </div>
            </div>

            <div className="login-feature">
              <span>
                🌐
              </span>

              <div>
                <h3>
                  Grow Your Network
                </h3>

                <p>
                  Participate in community
                  discussions and alumni
                  events.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right login section */}

        <section className="login-form-section">
          <form
            className="login-card"
            onSubmit={handleSubmit}
          >
            <div className="mobile-brand">
              AlumniConnect
            </div>

            <p className="welcome-label">
              WELCOME BACK
            </p>

            <h1>
              Log in to your account
            </h1>

            <p className="login-subtitle">
              Enter your details to
              continue to AlumniConnect.
            </p>

            <div className="form-group">
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder=
                  "Enter your email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="password"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder=
                  "Enter your password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                autoComplete=
                  "current-password"
                required
              />
            </div>

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login to AlumniConnect"}
            </button>

            {message && (
              <p className="login-message">
                {message}
              </p>
            )}

            <div className="login-divider">
              <span>
                New to AlumniConnect?
              </span>
            </div>

            <Link
              className=
                "create-account-link"
              to="/register"
            >
              Create a new account
            </Link>
          </form>
        </section>

      </div>
    </div>
  );
}

export default Login;