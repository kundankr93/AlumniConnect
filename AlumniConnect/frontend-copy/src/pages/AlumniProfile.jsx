import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import API from "../api/axios";

import "./AlumniProfile.css";

function AlumniProfile() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    connectionLoading,
    setConnectionLoading,
  ] = useState(false);

  const [
    mentorshipLoading,
    setMentorshipLoading,
  ] = useState(false);

  // Fetch alumni profile
  useEffect(() => {
    const fetchAlumniProfile =
      async () => {
        try {
          setLoading(true);

          setError("");

          const response =
            await API.get(
              `/alumni/${id}`
            );

          setProfile(
            response.data.profile ||
              response.data.alumni ||
              response.data
          );
        } catch (error) {
          console.error(
            "Fetch alumni profile error:",
            error
          );

          setError(
            error.response?.data
              ?.message ||
              "Unable to load alumni profile"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchAlumniProfile();
  }, [id]);

  // Send connection request
  const handleConnectionRequest =
    async () => {
      const alumniUserId =
        profile?.user?._id;

      if (!alumniUserId) {
        alert(
          "Alumni user ID was not found"
        );

        return;
      }

      try {
        setConnectionLoading(
          true
        );

        const response =
          await API.post(
            "/connections",
            {
              receiverId:
                alumniUserId,
            }
          );

        alert(
          response.data.message ||
            "Connection request sent successfully"
        );
      } catch (error) {
        console.error(
          "Connection request error:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Unable to send connection request"
        );
      } finally {
        setConnectionLoading(
          false
        );
      }
    };

  // Send mentorship request
  const handleMentorshipRequest =
    async () => {
      const alumniUserId =
        profile?.user?._id;

      if (!alumniUserId) {
        alert(
          "Alumni user ID was not found"
        );

        return;
      }

      const message =
        window.prompt(
          "Enter a message for your mentorship request:"
        );

      // User pressed Cancel
      if (message === null) {
        return;
      }

      // Empty message
      if (!message.trim()) {
        alert(
          "Please enter a mentorship message"
        );

        return;
      }

      try {
        setMentorshipLoading(
          true
        );

        const response =
          await API.post(
            "/mentorship",
            {
              alumniId:
                alumniUserId,

              message:
                message.trim(),
            }
          );

        alert(
          response.data.message ||
            "Mentorship request sent successfully"
        );

        navigate(
          "/mentorship"
        );
      } catch (error) {
        console.error(
          "Mentorship request error:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Unable to send mentorship request"
        );
      } finally {
        setMentorshipLoading(
          false
        );
      }
    };

  // Loading screen
  if (loading) {
    return (
      <div className="profile-page">
        <p className="profile-status">
          Loading alumni
          profile...
        </p>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/alumni"
              )
            }
          >
            Back to Alumni
          </button>
        </div>
      </div>
    );
  }

  // Profile not found
  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <p>
            Alumni profile was
            not found.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/alumni"
              )
            }
          >
            Back to Alumni
          </button>
        </div>
      </div>
    );
  }

  const alumniUser =
    profile.user || {};

  const alumniName =
    alumniUser.name ||
    profile.name ||
    "Alumni";

  const alumniEmail =
    alumniUser.email ||
    profile.email ||
    "Not provided";

  const profileImage =
    alumniUser.profileImage ||
    profile.profileImage ||
    "";

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button
          type="button"
          className="profile-back-button"
          onClick={() =>
            navigate("/alumni")
          }
        >
          ← Discover Alumni
        </button>

        <h1>
          Alumni Profile
        </h1>

        <p>
          View professional
          information and connect
          with an experienced
          alumnus.
        </p>
      </header>

      <main className="profile-container">
        <section className="profile-card">
          <div className="profile-top">
            {profileImage ? (
              <img
                src={profileImage}
                alt={alumniName}
                className="profile-image"
              />
            ) : (
              <div className="profile-avatar">
                {alumniName
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div className="profile-main-info">
              <h2>
                {alumniName}
              </h2>

              <p className="profile-job-title">
                {profile.jobTitle ||
                  "Alumni"}
              </p>

              {profile.location && (
                <p className="profile-location">
                  📍{" "}
                  {
                    profile.location
                  }
                </p>
              )}
            </div>
          </div>

          {profile.bio && (
            <div className="profile-bio">
              <h3>
                About
              </h3>

              <p>
                {profile.bio}
              </p>
            </div>
          )}

          <div className="profile-section">
            <h3>
              Professional
              Information
            </h3>

            <div className="profile-information-grid">
              <div className="information-box">
                <span>
                  Email
                </span>

                <strong>
                  {alumniEmail}
                </strong>
              </div>

              <div className="information-box">
                <span>
                  Branch
                </span>

                <strong>
                  {profile.branch ||
                    "Not provided"}
                </strong>
              </div>

              <div className="information-box">
                <span>
                  Graduation Year
                </span>

                <strong>
                  {profile.graduationYear ||
                    "Not provided"}
                </strong>
              </div>

              <div className="information-box">
                <span>
                  Company
                </span>

                <strong>
                  {profile.company ||
                    "Not provided"}
                </strong>
              </div>

              <div className="information-box">
                <span>
                  Job Title
                </span>

                <strong>
                  {profile.jobTitle ||
                    "Not provided"}
                </strong>
              </div>

              <div className="information-box">
                <span>
                  Mentorship
                </span>

                <strong>
                  {profile.availableForMentorship
                    ? "Available"
                    : "Not Available"}
                </strong>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>
              Skills
            </h3>

            {profile.skills
              ?.length > 0 ? (
              <div className="profile-skills">
                {profile.skills.map(
                  (
                    skill,
                    index
                  ) => (
                    <span
                      key={`${skill}-${index}`}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            ) : (
              <p>
                No skills added.
              </p>
            )}
          </div>

          <div className="profile-actions">
            <button
              type="button"
              className="connection-button"
              onClick={
                handleConnectionRequest
              }
              disabled={
                connectionLoading
              }
            >
              {connectionLoading
                ? "Sending..."
                : "🤝 Send Connection Request"}
            </button>

            {profile.availableForMentorship && (
              <button
                type="button"
                className="mentorship-button"
                onClick={
                  handleMentorshipRequest
                }
                disabled={
                  mentorshipLoading
                }
              >
                {mentorshipLoading
                  ? "Sending..."
                  : "🎓 Send Mentorship Request"}
              </button>
            )}

            {profile.linkedin && (
              <a
                href={
                  profile.linkedin
                }
                target="_blank"
                rel="noopener noreferrer"
                className="linkedin-button"
              >
                View LinkedIn
              </a>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AlumniProfile;