import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import API from "../api/axios";
import "./Events.css";

function Events() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [events, setEvents] =
    useState([]);

  const [
    registeredEvents,
    setRegisteredEvents,
  ] = useState([]);

  const [
    selectedEvent,
    setSelectedEvent,
  ] = useState(null);

  const [
    registeredUsers,
    setRegisteredUsers,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    loadingUsers,
    setLoadingUsers,
  ] = useState(false);

  const [
    processingId,
    setProcessingId,
  ] = useState("");

  const [
    deletingEventId,
    setDeletingEventId,
  ] = useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [
    activeTab,
    setActiveTab,
  ] = useState("all");

  // Fetch all events
  const fetchEvents =
    useCallback(async () => {
      try {
        setLoading(true);

        setError("");

        const eventsResponse =
          await API.get(
            "/events"
          );

        setEvents(
          eventsResponse.data
            .events || []
        );

        // Fetch registered events
        // only for students
        if (
          user?.role ===
          "student"
        ) {
          const myEventsResponse =
            await API.get(
              "/events/my-events"
            );

          setRegisteredEvents(
            myEventsResponse.data
              .events || []
          );
        } else {
          setRegisteredEvents(
            []
          );
        }
      } catch (error) {
        console.error(
          "Fetch events error:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Unable to fetch events"
        );
      } finally {
        setLoading(false);
      }
    }, [user?.role]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Register for event
  const handleRegister =
    async (eventId) => {
      try {
        setProcessingId(
          eventId
        );

        setMessage("");
        setError("");

        const response =
          await API.post(
            `/events/${eventId}/register`
          );

        setMessage(
          response.data.message ||
            "Registered successfully"
        );

        await fetchEvents();
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Unable to register for event"
        );
      } finally {
        setProcessingId("");
      }
    };

  // Cancel event registration
  const handleCancelRegistration =
    async (eventId) => {
      const shouldCancel =
        window.confirm(
          "Do you want to cancel your registration?"
        );

      if (!shouldCancel) {
        return;
      }

      try {
        setProcessingId(
          eventId
        );

        setMessage("");
        setError("");

        const response =
          await API.delete(
            `/events/${eventId}/register`
          );

        setMessage(
          response.data.message ||
            "Registration cancelled successfully"
        );

        await fetchEvents();
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Unable to cancel registration"
        );
      } finally {
        setProcessingId("");
      }
    };

  // View registered students
  const handleViewStudents =
    async (event) => {
      try {
        setSelectedEvent(
          event
        );

        setRegisteredUsers(
          []
        );

        setLoadingUsers(
          true
        );

        setError("");

        const response =
          await API.get(
            `/events/${event._id}/registered-users`
          );

        setRegisteredUsers(
          response.data
            .registeredUsers ||
            []
        );
      } catch (error) {
        console.error(
          "Registered users error:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Unable to fetch registered students"
        );
      } finally {
        setLoadingUsers(
          false
        );
      }
    };

  // Close registered students
  const handleCloseStudents =
    () => {
      setSelectedEvent(
        null
      );

      setRegisteredUsers(
        []
      );
    };

  // Delete event
  const handleDeleteEvent =
    async (eventId) => {
      const shouldDelete =
        window.confirm(
          "Are you sure you want to delete this event?"
        );

      if (!shouldDelete) {
        return;
      }

      try {
        setDeletingEventId(
          eventId
        );

        setMessage("");
        setError("");

        const response =
          await API.delete(
            `/events/${eventId}`
          );

        setMessage(
          response.data.message ||
            "Event deleted successfully"
        );

        setEvents(
          (previousEvents) =>
            previousEvents.filter(
              (event) =>
                event._id !==
                eventId
            )
        );

        if (
          selectedEvent?._id ===
          eventId
        ) {
          handleCloseStudents();
        }
      } catch (error) {
        console.error(
          "Delete event error:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Unable to delete event"
        );
      } finally {
        setDeletingEventId(
          ""
        );
      }
    };

  // Check student registration
  const isRegistered = (
    eventId
  ) => {
    return registeredEvents.some(
      (event) =>
        event._id?.toString() ===
        eventId?.toString()
    );
  };

  const displayedEvents =
    activeTab ===
    "registered"
      ? registeredEvents
      : events;

  return (
    <div className="events-page">
      <header className="events-header">
        <button
          className="events-back"
          type="button"
          onClick={() =>
            navigate(
              "/dashboard"
            )
          }
        >
          ← Dashboard
        </button>

        <h1>
          AlumniConnect Events
        </h1>

        <p>
          Explore career sessions,
          alumni talks, workshops,
          and networking events.
        </p>
      </header>

      <main className="events-content">
        <div className="events-toolbar">
          <div>
            <h2>
              Upcoming Events
            </h2>

            <p>
              Discover opportunities
              to learn and connect.
            </p>
          </div>

          <div className="event-toolbar-actions">
            {user?.role ===
              "alumni" && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/events/create"
                  )
                }
              >
                + Create Event
              </button>
            )}

            <button
              type="button"
              onClick={
                fetchEvents
              }
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Student tabs */}

        {user?.role ===
          "student" && (
          <div className="event-tabs">
            <button
              type="button"
              className={
                activeTab ===
                "all"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab(
                  "all"
                )
              }
            >
              All Events
              {" "}
              ({events.length})
            </button>

            <button
              type="button"
              className={
                activeTab ===
                "registered"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab(
                  "registered"
                )
              }
            >
              My Events
              {" "}
              (
              {
                registeredEvents.length
              }
              )
            </button>
          </div>
        )}

        {/* Messages */}

        {message && (
          <p className="events-message">
            {message}
          </p>
        )}

        {error && (
          <p className="events-error">
            {error}
          </p>
        )}

        {/* Registered students */}

        {selectedEvent && (
          <section className="registered-students-panel">
            <div className="registered-students-header">
              <div>
                <h2>
                  Registered
                  Students
                </h2>

                <p>
                  {
                    selectedEvent.title
                  }
                </p>
              </div>

              <button
                type="button"
                className="close-students-button"
                onClick={
                  handleCloseStudents
                }
              >
                ✕ Close
              </button>
            </div>

            {loadingUsers ? (
              <p className="events-status">
                Loading registered
                students...
              </p>
            ) : registeredUsers
                .length === 0 ? (
              <p className="events-status">
                No students have
                registered for this
                event yet.
              </p>
            ) : (
              <div className="registered-students-grid">
                {registeredUsers.map(
                  (student) => (
                    <article
                      className="registered-student-card"
                      key={
                        student._id
                      }
                    >
                      <div className="registered-student-avatar">
                        {student.name
                          ?.charAt(0)
                          .toUpperCase() ||
                          "S"}
                      </div>

                      <div>
                        <h3>
                          {
                            student.name
                          }
                        </h3>

                        <p>
                          {
                            student.email
                          }
                        </p>

                        <span>
                          {student.branch ||
                            "Branch not provided"}
                        </span>

                        <span>
                          Graduation:
                          {" "}
                          {student.graduationYear ||
                            "Not provided"}
                        </span>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
          </section>
        )}

        {/* Events */}

        {loading ? (
          <p className="events-status">
            Loading events...
          </p>
        ) : displayedEvents
            .length === 0 ? (
          <p className="events-status">
            {activeTab ===
            "registered"
              ? "You have not registered for any events."
              : "No upcoming events found."}
          </p>
        ) : (
          <section className="events-grid">
            {displayedEvents.map(
              (event) => {
                const creatorId =
                  typeof event.createdBy ===
                  "object"
                    ? event.createdBy
                        ?._id
                    : event.createdBy;

                const isOwner =
                  creatorId?.toString() ===
                  user?._id?.toString();

                const registered =
                  isRegistered(
                    event._id
                  );

                const processing =
                  processingId ===
                  event._id;

                return (
                  <article
                    className="event-card"
                    key={
                      event._id
                    }
                  >
                    <div className="event-date">
                      <span>
                        {new Date(
                          event.eventDate
                        ).toLocaleString(
                          "en-US",
                          {
                            month:
                              "short",
                          }
                        )}
                      </span>

                      <strong>
                        {new Date(
                          event.eventDate
                        ).getDate()}
                      </strong>
                    </div>

                    <div className="event-information">
                      <span className="event-mode">
                        {event.mode ||
                          "Event"}
                      </span>

                      <h2>
                        {
                          event.title
                        }
                      </h2>

                      <p className="event-description">
                        {
                          event.description
                        }
                      </p>

                      <div className="event-details">
                        <p>
                          <strong>
                            Date:
                          </strong>
                          {" "}
                          {new Date(
                            event.eventDate
                          ).toLocaleString()}
                        </p>

                        <p>
                          <strong>
                            Location:
                          </strong>
                          {" "}
                          {event.location ||
                            "Not provided"}
                        </p>

                        <p>
                          <strong>
                            Created by:
                          </strong>
                          {" "}
                          {event.createdBy
                            ?.name ||
                            "Alumni"}
                        </p>
                      </div>

                      {event.mode ===
                        "online" &&
                        event.meetingLink && (
                          <p className="meeting-note">
                            Online meeting
                            link is
                            available.
                          </p>
                        )}

                      {/* Student controls */}

                      {user?.role ===
                        "student" && (
                        <div className="event-card-actions">
                          {registered ? (
                            <button
                              type="button"
                              className="cancel-registration-button"
                              disabled={
                                processing
                              }
                              onClick={() =>
                                handleCancelRegistration(
                                  event._id
                                )
                              }
                            >
                              {processing
                                ? "Cancelling..."
                                : "Cancel Registration"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="register-event-button"
                              disabled={
                                processing
                              }
                              onClick={() =>
                                handleRegister(
                                  event._id
                                )
                              }
                            >
                              {processing
                                ? "Registering..."
                                : "Register for Event"}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Alumni owner controls */}

                      {user?.role ===
                        "alumni" &&
                        isOwner && (
                          <div className="event-owner-actions">
                            <button
                              type="button"
                              className="view-students-button"
                              onClick={() =>
                                handleViewStudents(
                                  event
                                )
                              }
                            >
                              👥 View
                              Students
                            </button>

                            <button
                              type="button"
                              className="edit-event-button"
                              onClick={() =>
                                navigate(
                                  `/events/${event._id}/edit`
                                )
                              }
                            >
                              ✏️ Edit
                            </button>

                            <button
                              type="button"
                              className="delete-event-button"
                              disabled={
                                deletingEventId ===
                                event._id
                              }
                              onClick={() =>
                                handleDeleteEvent(
                                  event._id
                                )
                              }
                            >
                              {deletingEventId ===
                              event._id
                                ? "Deleting..."
                                : "🗑️ Delete"}
                            </button>
                          </div>
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

export default Events;