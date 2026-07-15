import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import API from "../api/axios";
import "./Alumni.css";

function Alumni() {
  const navigate = useNavigate();

  const [alumni, setAlumni] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchAlumni =
      async () => {
        try {
          setLoading(true);

          setError("");

          const response =
            await API.get(
              "/alumni"
            );

          setAlumni(
            response.data
              .profiles || []
          );
        } catch (error) {
          console.error(
            "Fetch alumni error:",
            error
          );

          setError(
            error.response?.data
              ?.message ||
              "Unable to fetch alumni"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchAlumni();
  }, []);

  const searchText =
    search
      .trim()
      .toLowerCase();

  const filteredAlumni =
    alumni.filter(
      (person) => {
        return (
          person.user?.name
            ?.toLowerCase()
            .includes(
              searchText
            ) ||

          person.user?.email
            ?.toLowerCase()
            .includes(
              searchText
            ) ||

          person.branch
            ?.toLowerCase()
            .includes(
              searchText
            ) ||

          person.company
            ?.toLowerCase()
            .includes(
              searchText
            ) ||

          person.jobTitle
            ?.toLowerCase()
            .includes(
              searchText
            ) ||

          person.location
            ?.toLowerCase()
            .includes(
              searchText
            ) ||

          person.skills?.some(
            (skill) =>
              skill
                .toLowerCase()
                .includes(
                  searchText
                )
          )
        );
      }
    );

  return (
    <div className="alumni-page">

      {/* Header */}

      <header className="alumni-header">
        <div className="alumni-header-content">

          <button
            className="back-button"
            type="button"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          >
            ← Dashboard
          </button>

          <div className="header-text">
            <p className="header-label">
              ALUMNI NETWORK
            </p>

            <h1>
              Discover Alumni
            </h1>

            <p>
              Find experienced
              professionals, explore
              their careers, and build
              meaningful connections.
            </p>
          </div>

        </div>
      </header>

      {/* Main content */}

      <main className="alumni-content">

        {/* Search */}

        <section className="alumni-search-section">

          <div className="search-heading">
            <div>
              <h2>
                Find your alumni
              </h2>

              <p>
                Search using a name,
                branch, company, job
                title, location, or
                technical skill.
              </p>
            </div>

            <span className="alumni-count">
              {
                filteredAlumni.length
              }{" "}
              {
                filteredAlumni.length
                  === 1
                  ? "Alumnus"
                  : "Alumni"
              }
            </span>
          </div>

          <div className="search-container">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder=
                "Search alumni..."
              value={search}
              onChange={
                (event) =>
                  setSearch(
                    event.target
                      .value
                  )
              }
            />

            {search && (
              <button
                className="clear-search"
                type="button"
                onClick={() =>
                  setSearch("")
                }
              >
                Clear
              </button>
            )}

          </div>

        </section>

        {/* Loading */}

        {loading && (
          <p className="status-message">
            Loading alumni...
          </p>
        )}

        {/* Error */}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {/* No alumni */}

        {!loading &&
          !error &&
          filteredAlumni.length ===
            0 && (
            <div className="empty-alumni">

              <div>
                🔍
              </div>

              <h2>
                No alumni found
              </h2>

              <p>
                Try searching using
                another name, branch,
                company, or skill.
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  Clear Search
                </button>
              )}

            </div>
          )}

        {/* Alumni cards */}

        {!loading &&
          !error &&
          filteredAlumni.length >
            0 && (
            <section className="alumni-grid">

              {filteredAlumni.map(
                (person) => (

                  <article
                    className=
                      "alumni-card"
                    key={
                      person._id
                    }
                  >

                    <div className="card-top">

                      <div className="alumni-avatar">

                        {person.user
                          ?.name
                          ?.charAt(0)
                          .toUpperCase() ||
                          "A"}

                      </div>

                      <span className="alumni-badge">
                        Alumni
                      </span>

                    </div>

                    <div className="alumni-identity">

                      <h2>
                        {person.user
                          ?.name ||
                          "Alumni"}
                      </h2>

                      <p className="alumni-role">
                        {person.jobTitle ||
                          "Professional"}
                      </p>

                      <p className="company-name">
                        🏢{" "}
                        {person.company ||
                          "Company not provided"}
                      </p>

                    </div>

                    <div className="alumni-details">

                      <div className="detail-row">

                        <span className="detail-icon">
                          🎓
                        </span>

                        <div>
                          <small>
                            Branch
                          </small>

                          <p>
                            {person.branch ||
                              "Not provided"}
                          </p>
                        </div>

                      </div>

                      <div className="detail-row">

                        <span className="detail-icon">
                          📅
                        </span>

                        <div>
                          <small>
                            Graduation
                          </small>

                          <p>
                            {person
                              .graduationYear ||
                              "Not provided"}
                          </p>
                        </div>

                      </div>

                      <div className="detail-row">

                        <span className="detail-icon">
                          📍
                        </span>

                        <div>
                          <small>
                            Location
                          </small>

                          <p>
                            {person.location ||
                              "Not provided"}
                          </p>
                        </div>

                      </div>

                    </div>

                    {person.skills
                      ?.length >
                      0 && (

                      <div className="skills-section">

                        <h3>
                          Skills
                        </h3>

                        <div className="skills-list">

                          {person.skills
                            .slice(
                              0,
                              5
                            )
                            .map(
                              (
                                skill
                              ) => (

                              <span
                                key={
                                  skill
                                }
                              >
                                {
                                  skill
                                }
                              </span>

                            )
                          )}

                        </div>

                      </div>

                    )}

                    <button
                      className=
                        "view-button"
                      type="button"
                      onClick={() =>
                        navigate(
                          `/alumni/${person._id}`
                        )
                      }
                    >
                      View Full Profile
                      <span>
                        →
                      </span>
                    </button>

                  </article>

                )
              )}

            </section>
          )}

      </main>

    </div>
  );
}

export default Alumni;