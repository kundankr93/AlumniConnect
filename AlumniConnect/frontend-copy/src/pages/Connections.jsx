import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import API from "../api/axios";

import "./Connections.css";

function Connections() {
  const navigate = useNavigate();

  const [requests, setRequests] =
    useState([]);

  const [
    connections,
    setConnections,
  ] = useState([]);

  const [
    activeTab,
    setActiveTab,
  ] = useState("requests");

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // Fetch pending connection requests
  // and accepted connections
  const fetchConnectionData =
    useCallback(async () => {
      try {
        setLoading(true);

        setError("");

        const [
          requestsResponse,
          connectionsResponse,
        ] = await Promise.all([
          API.get(
            "/connections/received"
          ),

          API.get(
            "/connections"
          ),
        ]);

        setRequests(
          requestsResponse.data
            .requests || []
        );

        setConnections(
          connectionsResponse.data
            .connections || []
        );
      } catch (error) {
        console.error(
          "Connection fetch error:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Unable to load connections"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  // Load connection data
  useEffect(() => {
    fetchConnectionData();
  }, [fetchConnectionData]);

  // Accept or reject a request
  const handleRequest = async (
    requestId,
    action
  ) => {
    try {
      setMessage("");

      setError("");

      const status =
        action === "accept"
          ? "accepted"
          : "rejected";

      const response =
        await API.patch(
          `/connections/${requestId}/respond`,
          {
            status,
          }
        );

      setMessage(
        response.data.message ||
          `Connection request ${status} successfully`
      );

      // Reload requests and connections
      await fetchConnectionData();
    } catch (error) {
      console.error(
        "Connection response error:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          `Unable to ${action} connection request`
      );
    }
  };

  return (
    <div className="connections-page">
      {/* Header */}

      <header className="connections-header">
        <button
          type="button"
          className="connections-back"
          onClick={() =>
            navigate(
              "/dashboard"
            )
          }
        >
          ← Dashboard
        </button>

        <h1>
          Connections
        </h1>

        <p>
          Manage connection
          requests and grow your
          AlumniConnect network.
        </p>
      </header>

      {/* Main content */}

      <main className="connections-content">
        {/* Toolbar */}

        <div className="connections-toolbar">
          <div>
            <h2>
              Your Professional
              Network
            </h2>

            <p>
              Connect with students
              and alumni.
            </p>
          </div>

          <button
            type="button"
            onClick={
              fetchConnectionData
            }
          >
            Refresh
          </button>
        </div>

        {/* Tabs */}

        <div className="connection-tabs">
          <button
            type="button"
            className={
              activeTab ===
              "requests"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "requests"
              )
            }
          >
            Requests (
            {requests.length})
          </button>

          <button
            type="button"
            className={
              activeTab ===
              "connections"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "connections"
              )
            }
          >
            My Connections (
            {connections.length})
          </button>
        </div>

        {/* Success message */}

        {message && (
          <p className="connection-success">
            {message}
          </p>
        )}

        {/* Error message */}

        {error && (
          <p className="connection-error">
            {error}
          </p>
        )}

        {/* Loading */}

        {loading ? (
          <p className="connection-status">
            Loading connections...
          </p>
        ) : activeTab ===
          "requests" ? (
          /*
          -----------------------
          CONNECTION REQUESTS
          -----------------------
          */

          requests.length === 0 ? (
            <p className="connection-status">
              No pending connection
              requests.
            </p>
          ) : (
            <section className="connection-grid">
              {requests.map(
                (request) => {
                  /*
                  Your received-request
                  API may return:

                  request.sender

                  or:

                  request.user
                  */

                  const sender =
                    request.sender ||
                    request.user;

                  return (
                    <article
                      className="connection-card"
                      key={
                        request._id ||
                        request.connectionId
                      }
                    >
                      {/* Avatar */}

                      <div className="connection-avatar">
                        {sender
                          ?.profileImage ? (
                          <img
                            src={
                              sender.profileImage
                            }
                            alt={
                              sender.name ||
                              "User"
                            }
                          />
                        ) : (
                          sender?.name
                            ?.charAt(
                              0
                            )
                            .toUpperCase() ||
                          "U"
                        )}
                      </div>

                      {/* User information */}

                      <div className="connection-info">
                        <h3>
                          {sender
                            ?.name ||
                            "User"}
                        </h3>

                        <span>
                          {sender
                            ?.role ===
                          "alumni"
                            ? "Alumni"
                            : sender
                                  ?.role ===
                                "student"
                              ? "Student"
                              : "Member"}
                        </span>

                        <p>
                          {sender
                            ?.branch ||
                            "Branch not provided"}
                        </p>

                        <p>
                          Graduation:{" "}
                          {sender
                            ?.graduationYear ||
                            "Not provided"}
                        </p>

                        {sender
                          ?.email && (
                          <p>
                            {
                              sender.email
                            }
                          </p>
                        )}
                      </div>

                      {/* Accept and reject */}

                      <div className="request-actions">
                        <button
                          type="button"
                          className="accept-request"
                          onClick={() =>
                            handleRequest(
                              request._id ||
                                request.connectionId,
                              "accept"
                            )
                          }
                        >
                          Accept
                        </button>

                        <button
                          type="button"
                          className="reject-request"
                          onClick={() =>
                            handleRequest(
                              request._id ||
                                request.connectionId,
                              "reject"
                            )
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </article>
                  );
                }
              )}
            </section>
          )
        ) : /*
        -----------------------
        ACCEPTED CONNECTIONS
        -----------------------
        */

        connections.length ===
          0 ? (
          <p className="connection-status">
            You do not have any
            connections yet.
          </p>
        ) : (
          <section className="connection-grid">
            {connections.map(
              (
                connection,
                index
              ) => {
                /*
                Your backend response is:

                {
                  connectionId: "...",

                  user: {
                    name:
                      "Rahul Sharma",

                    role:
                      "alumni",

                    branch:
                      "Information Technology"
                  }
                }

                Therefore, read user
                information from:

                connection.user
                */

                const connectedUser =
                  connection.user;

                return (
                  <article
                    className="connection-card"
                    key={
                      connection.connectionId ||
                      connectedUser?._id ||
                      index
                    }
                  >
                    {/* Avatar */}

                    <div className="connection-avatar">
                      {connectedUser
                        ?.profileImage ? (
                        <img
                          src={
                            connectedUser.profileImage
                          }
                          alt={
                            connectedUser.name ||
                            "User"
                          }
                        />
                      ) : (
                        connectedUser
                          ?.name
                          ?.charAt(0)
                          .toUpperCase() ||
                        "U"
                      )}
                    </div>

                    {/* Connected user information */}

                    <div className="connection-info">
                      <h3>
                        {connectedUser
                          ?.name ||
                          "User"}
                      </h3>

                      <span>
                        {connectedUser
                          ?.role ===
                        "alumni"
                          ? "Alumni"
                          : connectedUser
                                ?.role ===
                              "student"
                            ? "Student"
                            : "Member"}
                      </span>

                      <p>
                        {connectedUser
                          ?.branch ||
                          "Branch not provided"}
                      </p>

                      {connectedUser
                        ?.email && (
                        <p>
                          {
                            connectedUser.email
                          }
                        </p>
                      )}

                      {connectedUser
                        ?.graduationYear && (
                        <p>
                          Graduation:{" "}
                          {
                            connectedUser.graduationYear
                          }
                        </p>
                      )}

                      {(connectedUser
                        ?.company ||
                        connectedUser
                          ?.jobTitle) && (
                        <p>
                          {connectedUser
                            ?.jobTitle}

                          {connectedUser
                              ?.jobTitle &&
                          connectedUser
                            ?.company
                            ? " at "
                            : ""}

                          {
                            connectedUser
                              ?.company
                          }
                        </p>
                      )}
                    </div>
                  </article>
                );
              }
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default Connections;