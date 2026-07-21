import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import API from "../api/axios";
import "./Mentorship.css";

function Mentorship() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState("");

  const fetchRequests = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const endpoint =
          user?.role === "alumni"
            ? "/mentorship/received"
            : "/mentorship/sent";

        const response =
          await API.get(endpoint);

        console.log(
          "Mentorship response:",
          response.data
        );

        setRequests(
          response.data.requests || []
        );
      } catch (error) {
        console.error(
          "Fetch mentorship requests error:",
          error
        );

        setRequests([]);

        setError(
          error.response?.data?.message ||
            "Unable to fetch mentorship requests"
        );
      } finally {
        setLoading(false);
      }
    },
    [user?.role]
  );

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const getPerson = (request) => {
    if (user?.role === "alumni") {
      return (
        request.student ||
        request.sender ||
        null
      );
    }

    return (
      request.alumni ||
      request.receiver ||
      null
    );
  };

  const updateRequestStatus = async (
    requestId,
    status
  ) => {
    try {
      setActionLoading(
        `${requestId}-${status}`
      );

      setError("");

      await API.patch(
        `/mentorship/${requestId}/status`,
        {
          status,
        }
      );

      setRequests((previousRequests) =>
        previousRequests.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status,
              }
            : request
        )
      );
    } catch (error) {
      console.error(
        "Update mentorship status error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update mentorship request"
      );
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="mentorship-page">
      <header className="mentorship-header">
        <button
          type="button"
          className="mentorship-back"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Dashboard
        </button>

        <h1>Mentorship Requests</h1>

        <p>
          {user?.role === "alumni"
            ? "View and manage mentorship requests received from students."
            : "Track the mentorship requests you have sent to alumni."}
        </p>
      </header>

      <main className="mentorship-content">
        <div className="mentorship-toolbar">
          <div>
            <h2>
              {user?.role === "alumni"
                ? "Received Requests"
                : "My Requests"}
            </h2>

            <p>
              Total requests:{" "}
              {requests.length}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchRequests}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Refresh"}
          </button>
        </div>

        {loading && (
          <p className="mentorship-status">
            Loading mentorship requests...
          </p>
        )}

        {!loading && error && (
          <p className="mentorship-error">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          requests.length === 0 && (
            <div className="empty-requests">
              <h3>
                No mentorship requests found
              </h3>

              <p>
                {user?.role === "student"
                  ? "Open Discover Alumni to find an alumni mentor."
                  : "New student mentorship requests will appear here."}
              </p>

              {user?.role ===
                "student" && (
                <button
                  type="button"
                  onClick={() =>
                    navigate("/alumni")
                  }
                >
                  Discover Alumni
                </button>
              )}
            </div>
          )}

        {!loading &&
          requests.length > 0 && (
            <div className="request-grid">
              {requests.map(
                (request) => {
                  const person =
                    getPerson(request);

                  const status =
                    request.status ||
                    "pending";

                  return (
                    <article
                      className="request-card"
                      key={request._id}
                    >
                      <div className="request-top">
                        <div className="request-avatar">
                          {person?.name
                            ?.charAt(0)
                            .toUpperCase() ||
                            "U"}
                        </div>

                        <div>
                          <h3>
                            {person?.name ||
                              "User"}
                          </h3>

                          <p>
                            {person?.email ||
                              "Email unavailable"}
                          </p>
                        </div>
                      </div>

                      <div className="request-details">
                        {person?.branch && (
                          <p>
                            <strong>
                              Branch:
                            </strong>{" "}
                            {person.branch}
                          </p>
                        )}

                        {person
                          ?.graduationYear && (
                          <p>
                            <strong>
                              Graduation:
                            </strong>{" "}
                            {
                              person.graduationYear
                            }
                          </p>
                        )}

                        {person?.company && (
                          <p>
                            <strong>
                              Company:
                            </strong>{" "}
                            {person.company}
                          </p>
                        )}

                        {person?.jobTitle && (
                          <p>
                            <strong>
                              Job title:
                            </strong>{" "}
                            {person.jobTitle}
                          </p>
                        )}

                        <p>
                          <strong>
                            Message:
                          </strong>
                        </p>

                        <p className="request-message">
                          {request.message ||
                            "No message provided"}
                        </p>
                      </div>

                      <div className="request-footer">
                        <span
                          className={`request-status ${status.toLowerCase()}`}
                        >
                          {status}
                        </span>

                        <span className="request-date">
                          {request.createdAt
                            ? new Date(
                                request.createdAt
                              ).toLocaleDateString()
                            : "Date unavailable"}
                        </span>
                      </div>

                      {user?.role ===
                        "alumni" &&
                        status.toLowerCase() ===
                          "pending" && (
                          <div className="request-actions">
                            <button
                              type="button"
                              className="accept-button"
                              disabled={
                                actionLoading !==
                                ""
                              }
                              onClick={() =>
                                updateRequestStatus(
                                  request._id,
                                  "accepted"
                                )
                              }
                            >
                              {actionLoading ===
                              `${request._id}-accepted`
                                ? "Accepting..."
                                : "Accept"}
                            </button>

                            <button
                              type="button"
                              className="reject-button"
                              disabled={
                                actionLoading !==
                                ""
                              }
                              onClick={() =>
                                updateRequestStatus(
                                  request._id,
                                  "rejected"
                                )
                              }
                            >
                              {actionLoading ===
                              `${request._id}-rejected`
                                ? "Rejecting..."
                                : "Reject"}
                            </button>
                          </div>
                        )}
                    </article>
                  );
                }
              )}
            </div>
          )}
      </main>
    </div>
  );
}

export default Mentorship;