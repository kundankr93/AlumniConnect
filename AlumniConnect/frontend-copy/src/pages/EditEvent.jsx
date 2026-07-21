import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import API from "../api/axios";

import "./EditEvent.css";

function EditEvent() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    mode: "online",
    location: "",
    meetingLink: "",
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // Convert MongoDB date into
  // datetime-local input format
  const formatDateForInput = (date) => {
    if (!date) {
      return "";
    }

    const eventDate = new Date(date);

    const timezoneOffset = eventDate.getTimezoneOffset() * 60000;

    return new Date(eventDate.getTime() - timezoneOffset)
      .toISOString()
      .slice(0, 16);
  };

  // Fetch existing event
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await API.get(`/events/${id}`);

        const event = response.data.event || response.data;

        setFormData({
          title: event.title || "",

          description: event.description || "",

          eventDate: formatDateForInput(event.eventDate || event.date),

          mode: event.mode || "online",

          location: event.location || "",

          meetingLink: event.meetingLink || "",
        });
      } catch (error) {
        console.error("Fetch event error:", error);

        setError(error.response?.data?.message || "Unable to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Update input values
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,

      [name]: value,
    }));
  };

  // Update event
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      setMessage("");

      setError("");

      const updatedEvent = {
        title: formData.title.trim(),

        description: formData.description.trim(),

        eventDate: formData.eventDate,

        mode: formData.mode,

        location: formData.location.trim(),

        meetingLink: formData.meetingLink.trim(),
      };

      const response = await API.put(`/events/${id}`, updatedEvent);

      setMessage(response.data.message || "Event updated successfully");

      setTimeout(() => {
        navigate("/events");
      }, 1000);
    } catch (error) {
      console.error("Update event error:", error);

      setError(error.response?.data?.message || "Unable to update event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="edit-event-status">Loading event...</div>;
  }

  return (
    <div className="edit-event-page">
      <header className="edit-event-header">
        <div className="edit-event-header-content">
          <button
            type="button"
            className="edit-event-back"
            onClick={() => navigate("/events")}
          >
            ← Events
          </button>

          <h1>Edit Event</h1>

          <p>Update your event information.</p>
        </div>
      </header>

      <main className="edit-event-content">
        <form className="edit-event-form" onSubmit={handleSubmit}>
          {message && <p className="edit-event-success">{message}</p>}

          {error && <p className="edit-event-error">{error}</p>}

          {/* Event title */}

          <div className="edit-event-field">
            <label htmlFor="title">Event Title</label>

            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              maxLength="150"
              required
            />
          </div>

          {/* Description */}

          <div className="edit-event-field">
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the event, topics, speakers, and what participants will learn..."
              rows="6"
              maxLength="2000"
              required
            />

            <small className="description-count">
              {formData.description.length}
              /2000 characters
            </small>
          </div>

          {/* Event date */}

          <div className="edit-event-field">
            <label htmlFor="eventDate">Event Date and Time</label>

            <input
              id="eventDate"
              type="datetime-local"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Event mode */}

          <div className="edit-event-field">
            <label htmlFor="mode">Event Mode</label>

            <select
              id="mode"
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              required
            >
              <option value="online">Online</option>

              <option value="offline">Offline</option>

              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* Location */}

          <div className="edit-event-field">
            <label htmlFor="location">Location</label>

            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter event location"
            />
          </div>

          {/* Meeting link */}

          <div className="edit-event-field">
            <label htmlFor="meetingLink">Meeting Link</label>

            <input
              id="meetingLink"
              type="url"
              name="meetingLink"
              value={formData.meetingLink}
              onChange={handleChange}
              placeholder="https://meet.google.com/..."
            />
          </div>

          {/* Buttons */}

          <div className="edit-event-actions">
            <button
              type="button"
              className="cancel-event-button"
              onClick={() => navigate("/events")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="update-event-button"
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Event"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditEvent;
