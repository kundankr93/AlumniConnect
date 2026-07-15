import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import API from "../api/axios";
import "./EditProfile.css";

function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      branch: "",
      graduationYear: "",
      company: "",
      jobTitle: "",
      skills: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await API.get(
            "/auth/profile"
          );

        const user =
          response.data.user;

        setFormData({
          name:
            user.name || "",

          branch:
            user.branch || "",

          graduationYear:
            user.graduationYear ||
            "",

          company:
            user.company || "",

          jobTitle:
            user.jobTitle || "",

          skills:
            user.skills?.join(
              ", "
            ) || "",
        });
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

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

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const updatedData = {
        name:
          formData.name.trim(),

        branch:
          formData.branch.trim(),

        graduationYear:
          formData.graduationYear
            ? Number(
                formData
                  .graduationYear
              )
            : null,

        company:
          formData.company.trim(),

        jobTitle:
          formData.jobTitle.trim(),

        skills:
          formData.skills
            .split(",")
            .map((skill) =>
              skill.trim()
            )
            .filter(
              (skill) =>
                skill !== ""
            ),
      };

      const response =
        await API.patch(
          "/auth/profile",
          updatedData
        );

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );

      setMessage(
        response.data.message ||
          "Profile updated successfully"
      );

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data
          ?.message ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-profile-loading">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <header className="edit-profile-header">
        <button
          type="button"
          className="edit-profile-back"
          onClick={() =>
            navigate("/profile")
          }
        >
          ← My Profile
        </button>

        <h1>Edit Profile</h1>

        <p>
          Update your AlumniConnect
          profile information.
        </p>
      </header>

      <main className="edit-profile-content">
        <form
          className="edit-profile-card"
          onSubmit={handleSubmit}
        >
          <h2>
            Personal Information
          </h2>

          {message && (
            <p className="edit-success">
              {message}
            </p>
          )}

          {error && (
            <p className="edit-error">
              {error}
            </p>
          )}

          <div className="edit-form-grid">
            <div className="edit-field">
              <label
                htmlFor="name"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                required
              />
            </div>

            <div className="edit-field">
              <label
                htmlFor="branch"
              >
                Branch
              </label>

              <input
                id="branch"
                type="text"
                name="branch"
                value={
                  formData.branch
                }
                onChange={
                  handleChange
                }
                placeholder="Information Technology"
              />
            </div>

            <div className="edit-field">
              <label
                htmlFor="graduationYear"
              >
                Graduation Year
              </label>

              <input
                id="graduationYear"
                type="number"
                name="graduationYear"
                min="1950"
                max="2100"
                value={
                  formData
                    .graduationYear
                }
                onChange={
                  handleChange
                }
                placeholder="2027"
              />
            </div>

            <div className="edit-field">
              <label
                htmlFor="company"
              >
                Company
              </label>

              <input
                id="company"
                type="text"
                name="company"
                value={
                  formData.company
                }
                onChange={
                  handleChange
                }
                placeholder="Company name"
              />
            </div>

            <div className="edit-field">
              <label
                htmlFor="jobTitle"
              >
                Job Title
              </label>

              <input
                id="jobTitle"
                type="text"
                name="jobTitle"
                value={
                  formData.jobTitle
                }
                onChange={
                  handleChange
                }
                placeholder="Software Engineer"
              />
            </div>

            <div className="edit-field edit-skills-field">
              <label
                htmlFor="skills"
              >
                Skills
              </label>

              <input
                id="skills"
                type="text"
                name="skills"
                value={
                  formData.skills
                }
                onChange={
                  handleChange
                }
                placeholder="C++, React, Node.js, MongoDB"
              />

              <small>
                Separate each skill
                using a comma.
              </small>
            </div>
          </div>

          <div className="edit-profile-actions">
            <button
              type="button"
              className="cancel-edit-button"
              onClick={() =>
                navigate(
                  "/profile"
                )
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-profile-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditProfile;