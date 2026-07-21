import { useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import API from "../api/axios";
import "./CreateEvent.css";

function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      eventDate: "",
      location: "",
      mode: "online",
      meetingLink: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

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
      setLoading(true);
      setMessage("");
      setError("");

      const eventData = {
        title:
          formData.title.trim(),

        description:
          formData.description.trim(),

        eventDate:
          formData.eventDate,

        location:
          formData.location.trim(),

        mode:
          formData.mode,

        meetingLink:
          formData.meetingLink.trim(),
      };

      const response =
        await API.post(
          "/events",
          eventData
        );

      setMessage(
        response.data.message ||
          "Event created successfully"
      );

      setTimeout(() => {
        navigate("/events");
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data
          ?.message ||
          "Unable to create event"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <header className="create-event-header">
        <button
          type="button"
          className="create-event-back"
          onClick={() =>
            navigate("/events")
          }
        >
          ← Events
        </button>

        <h1>Create Event</h1>

        <p>
          Create a career session,
          workshop, alumni talk, or
          networking event.
        </p>
      </header>

      <main className="create-event-content">
        <form
          className="create-event-card"
          onSubmit={handleSubmit}
        >
          <h2>
            Event Information
          </h2>

          {message && (
            <p className="create-event-success">
              {message}
            </p>
          )}

          {error && (
            <p className="create-event-error">
              {error}
            </p>
          )}

          <div className="create-event-field">
            <label htmlFor="title">
              Event Title
            </label>

            <input
              id="title"
              type="text"
              name="title"
              value={
                formData.title
              }
              onChange={
                handleChange
              }
              placeholder="Software Engineering Career Guidance"
              required
            />
          </div>

          <div className="create-event-field">
            <label
              htmlFor="description"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              placeholder="Describe the event..."
              rows="6"
              required
            />
          </div>

          <div className="create-event-grid">
            <div className="create-event-field">
              <label
                htmlFor="eventDate"
              >
                Event Date and Time
              </label>

              <input
                id="eventDate"
                type="datetime-local"
                name="eventDate"
                value={
                  formData.eventDate
                }
                onChange={
                  handleChange
                }
                required
              />
            </div>

            <div className="create-event-field">
              <label
                htmlFor="mode"
              >
                Event Mode
              </label>

              <select
                id="mode"
                name="mode"
                value={
                  formData.mode
                }
                onChange={
                  handleChange
                }
              >
                <option value="online">
                  Online
                </option>

                <option value="offline">
                  Offline
                </option>

                <option value="hybrid">
                  Hybrid
                </option>
              </select>
            </div>

            <div className="create-event-field">
              <label
                htmlFor="location"
              >
                Location
              </label>

              <input
                id="location"
                type="text"
                name="location"
                value={
                  formData.location
                }
                onChange={
                  handleChange
                }
                placeholder="NIT Raipur or Online"
                required
              />
            </div>

            <div className="create-event-field">
              <label
                htmlFor="meetingLink"
              >
                Meeting Link
              </label>

              <input
                id="meetingLink"
                type="url"
                name="meetingLink"
                value={
                  formData.meetingLink
                }
                onChange={
                  handleChange
                }
                placeholder="https://meet.google.com/..."
              />
            </div>
          </div>

          <div className="create-event-actions">
            <button
              type="button"
              className="cancel-event-button"
              onClick={() =>
                navigate("/events")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-event-button"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Event"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateEvent;