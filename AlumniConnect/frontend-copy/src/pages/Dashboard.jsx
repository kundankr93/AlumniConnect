import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import API from "../api/axios";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [stats, setStats] =
    useState({
      alumni: 0,
      connections: 0,
      mentorship: 0,
      events: 0,
      posts: 0,
    });

  const [loadingStats, setLoadingStats] =
    useState(true);

  const [statsError, setStatsError] =
    useState("");

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };

  const fetchDashboardData =
    useCallback(async () => {
      try {
        setLoadingStats(true);

        setStatsError("");

        const mentorshipEndpoint =
          user?.role === "alumni"
            ? "/mentorship/received"
            : "/mentorship/sent";

        const [
          alumniResponse,
          connectionsResponse,
          mentorshipResponse,
          eventsResponse,
          postsResponse,
        ] = await Promise.all([
          API.get("/alumni"),

          API.get(
            "/connections"
          ),

          API.get(
            mentorshipEndpoint
          ),

          API.get("/events"),

          API.get("/posts"),
        ]);

        setStats({
          alumni:
            alumniResponse.data
              .profiles?.length ||
            alumniResponse.data
              .alumni?.length ||
            alumniResponse.data
              .count ||
            0,

          connections:
            connectionsResponse.data
              .connections
              ?.length ||
            connectionsResponse.data
              .count ||
            0,

          mentorship:
            mentorshipResponse.data
              .requests
              ?.length ||
            mentorshipResponse.data
              .count ||
            0,

          events:
            eventsResponse.data
              .events?.length ||
            eventsResponse.data
              .count ||
            0,

          posts:
            postsResponse.data
              .posts?.length ||
            postsResponse.data
              .count ||
            0,
        });
      } catch (error) {
        console.error(
          "Dashboard data error:",
          error
        );

        setStatsError(
          error.response?.data
            ?.message ||
            "Unable to load dashboard statistics"
        );
      } finally {
        setLoadingStats(
          false
        );
      }
    }, [user?.role]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const statisticCards = [
    {
      icon: "🎓",
      value: stats.alumni,
      title: "Total Alumni",
      description:
        "Alumni available to connect",
      path: "/alumni",
    },

    {
      icon: "🌐",
      value: stats.connections,
      title: "My Connections",
      description:
        "People in your network",
      path: "/connections",
    },

    {
      icon: "🤝",
      value: stats.mentorship,
      title:
        user?.role === "alumni"
          ? "Received Requests"
          : "Mentorship Requests",
      description:
        user?.role === "alumni"
          ? "Mentorship requests received"
          : "Mentorship requests sent",
      path: "/mentorship",
    },

    {
      icon: "📅",
      value: stats.events,
      title: "Upcoming Events",
      description:
        "Available community events",
      path: "/events",
    },

    {
      icon: "📝",
      value: stats.posts,
      title: "Community Posts",
      description:
        "Posts shared by members",
      path: "/posts",
    },
  ];

  const features = [
    {
      icon: "🎓",

      title:
        "Discover Alumni",

      description:
        "Find alumni by branch, graduation year, company, and skills.",

      path: "/alumni",
    },

    {
      icon: "🤝",

      title:
        "Mentorship",

      description:
        "Send mentorship requests and receive career guidance.",

      path: "/mentorship",
    },

    {
      icon: "📝",

      title:
        "Community Posts",

      description:
        "Share experiences, ask questions, and interact with posts.",

      path: "/posts",
    },

    {
      icon: "🌐",

      title:
        "Connections",

      description:
        "Build your professional network with students and alumni.",

      path: "/connections",
    },

    {
      icon: "📅",

      title:
        "Events",

      description:
        "Explore upcoming career sessions, workshops, and alumni events.",

      path: "/events",
    },
  ];

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}

      <aside className="sidebar">
        <div>
          <h2 className="sidebar-logo">
            AlumniConnect
          </h2>

          <nav className="sidebar-nav">
            <button
              className="nav-item active"
              type="button"
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
            >
              🏠 Dashboard
            </button>

            <button
              className="nav-item"
              type="button"
              onClick={() =>
                navigate(
                  "/alumni"
                )
              }
            >
              🎓 Discover Alumni
            </button>

            <button
              className="nav-item"
              type="button"
              onClick={() =>
                navigate(
                  "/mentorship"
                )
              }
            >
              🤝 Mentorship
            </button>

            <button
              className="nav-item"
              type="button"
              onClick={() =>
                navigate(
                  "/posts"
                )
              }
            >
              📝 Posts
            </button>

            <button
              className="nav-item"
              type="button"
              onClick={() =>
                navigate(
                  "/connections"
                )
              }
            >
              🌐 Connections
            </button>

            <button
              className="nav-item"
              type="button"
              onClick={() =>
                navigate(
                  "/events"
                )
              }
            >
              📅 Events
            </button>

            <button
              className="nav-item"
              type="button"
              onClick={() =>
                navigate(
                  "/profile"
                )
              }
            >
              👤 My Profile
            </button>
          </nav>
        </div>

        <button
          className="logout-button"
          type="button"
          onClick={
            handleLogout
          }
        >
          ↪ Logout
        </button>
      </aside>

      {/* Main Dashboard */}

      <main className="dashboard-main">

        {/* Welcome Header */}

        <header className="dashboard-header">
          <div>
            <p className="welcome-label">
              Welcome back
            </p>

            <h1>
              {user?.name ||
                "User"}
            </h1>

            <p className="header-description">
              Connect, learn, and
              grow with the
              AlumniConnect
              community.
            </p>
          </div>

          <div
            className="user-profile"
            onClick={() =>
              navigate(
                "/profile"
              )
            }
            onKeyDown={(
              event
            ) => {
              if (
                event.key ===
                  "Enter" ||
                event.key ===
                  " "
              ) {
                navigate(
                  "/profile"
                );
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="user-avatar">
              {user?.name
                ?.charAt(0)
                .toUpperCase() ||
                "U"}
            </div>

            <div>
              <strong>
                {user?.name ||
                  "User"}
              </strong>

              <span>
                {user?.role ||
                  "Member"}
              </span>
            </div>
          </div>
        </header>

        {/* Statistics */}

        <section className="statistics-section">
          <div className="section-heading">
            <div>
              <h2>
                Dashboard Overview
              </h2>

              <p>
                A quick summary of
                your AlumniConnect
                activity.
              </p>
            </div>

            <button
              type="button"
              className="refresh-dashboard-button"
              onClick={
                fetchDashboardData
              }
              disabled={
                loadingStats
              }
            >
              {loadingStats
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>
          </div>

          {statsError && (
            <p className="dashboard-error">
              {statsError}
            </p>
          )}

          <div className="statistics-grid">
            {statisticCards.map(
              (stat) => (
                <article
                  className="statistic-card"
                  key={
                    stat.title
                  }
                  onClick={() =>
                    navigate(
                      stat.path
                    )
                  }
                >
                  <div className="statistic-icon">
                    {stat.icon}
                  </div>

                  <div>
                    <strong>
                      {loadingStats
                        ? "..."
                        : stat.value}
                    </strong>

                    <h3>
                      {stat.title}
                    </h3>

                    <p>
                      {
                        stat.description
                      }
                    </p>
                  </div>
                </article>
              )
            )}
          </div>
        </section>

        {/* Feature Cards */}

        <section className="overview-section">
          <h2>
            Explore AlumniConnect
          </h2>

          <p>
            Use the platform to
            connect with alumni,
            request mentorship,
            participate in
            discussions, and join
            events.
          </p>

          <div className="feature-grid">
            {features.map(
              (feature) => (
                <article
                  className="feature-card"
                  key={
                    feature.title
                  }
                >
                  <div className="feature-icon">
                    {
                      feature.icon
                    }
                  </div>

                  <h3>
                    {
                      feature.title
                    }
                  </h3>

                  <p>
                    {
                      feature.description
                    }
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        feature.path
                      )
                    }
                  >
                    Explore →
                  </button>
                </article>
              )
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;