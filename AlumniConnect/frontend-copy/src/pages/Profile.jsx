import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../api/axios";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setMessage("");

        const response = await API.get("/auth/profile");

        const profile = response.data.user || response.data.profile;

        setUser(profile);

        localStorage.setItem("user", JSON.stringify(profile));
      } catch (error) {
        setMessage(error.response?.data?.message || "Unable to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button
          type="button"
          className="profile-back"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

        <h1>My Profile</h1>

        <p>View your AlumniConnect account information.</p>
      </header>

      <main className="profile-content">
        {message && <p className="profile-message">{message}</p>}

        {user && (
          <section className="profile-card">
            <div className="profile-top">
              {user.profileImage ? (
                <img
                  className="profile-image"
                  src={user.profileImage}
                  alt={user.name}
                />
              ) : (
                <div className="profile-avatar">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              <div>
                <h2>{user.name}</h2>

                <span className="profile-role">{user.role}</span>
              </div>
            </div>

            <div className="profile-details">
              <div className="profile-detail">
                <span>Email</span>

                <strong>{user.email || "Not provided"}</strong>
              </div>

              <div className="profile-detail">
                <span>Branch</span>

                <strong>{user.branch || "Not provided"}</strong>
              </div>

              <div className="profile-detail">
                <span>Graduation Year</span>

                <strong>{user.graduationYear || "Not provided"}</strong>
              </div>

              <div className="profile-detail">
                <span>Company</span>

                <strong>{user.company || "Not provided"}</strong>
              </div>

              <div className="profile-detail">
                <span>Job Title</span>

                <strong>{user.jobTitle || "Not provided"}</strong>
              </div>
            </div>

            <div className="profile-skills">
              <h3>Skills</h3>

              {user.skills?.length > 0 ? (
                <div className="profile-skill-list">
                  {user.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              ) : (
                <p>No skills added.</p>
              )}
            </div>

            <button
              className="edit-profile-button"
              type="button"
              onClick={() => navigate("/profile/edit")}
            >
              Edit Profile
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default Profile;
