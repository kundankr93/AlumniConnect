import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import API from "../api/axios";
import "./CreateEvent.css";

function EditEvent() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      eventDate: "",
      location: "",
      mode: "offline",
      meetingLink: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(false);

  const [error, setError] =
    useState("");

  // Fetch the selected event
  useEffect(() => {
    const fetchEvent =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await API.get(
              "/events"
            );

          const allEvents =
            response.data.events ||
            [];

          const selectedEvent =
            allEvents.find(
              (event) =>
                event._id === id
            );

          if (!selectedEvent) {
            setError(
              "Event not found"
            );

            return;
          }

          // Convert MongoDB date into
          // datetime-local format
          const date =
            new Date(
              selectedEvent.eventDate
            );

          const timezoneOffset =
            date.getTimezoneOffset() *
            60000;

          const localDate =
            new Date(
              date.getTime() -
                timezoneOffset
            )
              .toISOString()
              .slice(0, 16);

          setFormData({
            title:
              selectedEvent.title ||
              "",

            description:
              selectedEvent.description ||
              "",

            eventDate:
              localDate,

            location:
              selectedEvent.location ||
              "",

            mode:
              selectedEvent.mode ||
              "offline",

            meetingLink:
              selectedEvent.meetingLink ||
              "",
          });
        } catch (error) {
          console.error(
            "Fetch event error:",
            error
          );

          setError(
            error.response?.data
              ?.message ||
              "Unable to load event"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchEvent();
  }, [id]);

  // Update input values
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

        ...(name === "mode" &&
        value === "offline"
          ? {
              meetingLink: "",
            }
          : {}),
      })
    );
  };

  // Update event
  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");

      if (
        !formData.title.trim() ||
        !formData.description.trim() ||
        !formData.eventDate ||
        !formData.location.trim()
      ) {
        setError(
          "Please complete all required fields"
        );

        return;
      }

      if (
        formData.mode ===
          "online" &&
        !formData.meetingLink.trim()
      ) {
        setError(
          "Meeting link is required for an online event"
        );

        return;
      }

      try {
        setUpdating(true);

        const response =
          await API.patch(
            `/events/${id}`,
            {
              title:
                formData.title.trim(),

              description:
                formData.description.trim(),

              eventDate:
                new Date(
                  formData.eventDate
                ).toISOString(),

              location:
                formData.location.trim(),

              mode:
                formData.mode,

              meetingLink:
                formData.mode ===
                "online"
                  ? formData.meetingLink.trim()
                  : "",
            }
          );

        alert(
          response.data.message ||
            "Event updated successfully"
        );

        navigate("/events");
      } catch (error) {
        console.error(
          "Update event error:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Unable to update event"
        );
      } finally {
        setUpdating(false);
      }
    };

  if (loading) {
    return (
      <div className="create-event-page">
        <p className="create-event-status">
          Loading event...
        </p>
      </div>
    );
  }

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

        <h1>
          Edit Event
        </h1>

        <p>
          Update your event
          information.
        </p>
      </header>

      <main className="create-event-content">
        <form
          className="create-event-form"
          onSubmit={
            handleSubmit
          }
        >
          {error && (
            <p className="create-event-error">
              {error}
            </p>
          )}

          <div className="form-group">
            <label
              htmlFor="title"
            >
              Event Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={
                formData.title
              }
              onChange={
                handleChange
              }
              maxLength={150}
              required
            />
          </div>

          <div className="form-group">
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
              maxLength={2000}
              required
            />

            <span>
              {
                formData
                  .description
                  .length
              }
              /2000
            </span>
          </div>

          <div className="form-group">
            <label
              htmlFor="eventDate"
            >
              Event Date and Time
            </label>

            <input
              id="eventDate"
              name="eventDate"
              type="datetime-local"
              value={
                formData.eventDate
              }
              onChange={
                handleChange
              }
              required
            />
          </div>

          <div className="form-group">
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
              required
            >
              <option value="offline">
                Offline
              </option>

              <option value="online">
                Online
              </option>
            </select>
          </div>

          <div className="form-group">
            <label
              htmlFor="location"
            >
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={
                formData.location
              }
              onChange={
                handleChange
              }
              placeholder={
                formData.mode ===
                "online"
                  ? "Google Meet, Zoom, Microsoft Teams..."
                  : "Event venue"
              }
              required
            />
          </div>

          {formData.mode ===
            "online" && (
            <div className="form-group">
              <label
                htmlFor="meetingLink"
              >
                Meeting Link
              </label>

              <input
                id="meetingLink"
                name="meetingLink"
                type="url"
                value={
                  formData.meetingLink
                }
                onChange={
                  handleChange
                }
                placeholder="https://meet.google.com/..."
                required
              />
            </div>
          )}

          <div className="create-event-actions">
            <button
              type="button"
              className="cancel-event-button"
              disabled={updating}
              onClick={() =>
                navigate(
                  "/events"
                )
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-event-button"
              disabled={updating}
            >
              {updating
                ? "Updating..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditEvent;