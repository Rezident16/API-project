import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createNewGroup } from "../../store/groups";
import { updateGroupThunk } from "../../store/groups";
import { createNewGroupImage } from "../../store/groupImages";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadGroupData } from "../../store/groups";
import { createNewEventImage } from "../../store/eventImages";
import { createNewEvent } from "../../store/events";
import { fetchEvents } from "../../store/events";
import "./Events.css";

const CreateEvent = () => {
  /* **DO NOT CHANGE THE RETURN VALUE** */
  const history = useHistory();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  let [isPrivate, setIsPrivate] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [url, setUrl] = useState("");
  const [about, setAbout] = useState("");
  const [errors, setErrors] = useState({});
  const sessionUser = useSelector((state) => state.session.user);
  const { groupId } = useParams();
  const id = parseInt(groupId);
  const dispatch = useDispatch();
  const groupObj = useSelector((state) => state.groups);
    if (!sessionUser) history.push(`/groups/${id}`)
  const currentDate = new Date();
  useEffect(() => {
    const fetch = async () => {
      try {
        await dispatch(loadGroupData(id));
        await dispatch(fetchEvents());
      } catch (e) {
        if (e) history.push("/groups");
      }
    };
    fetch();
  }, [dispatch, id]);

  const group = groupObj[id];
  if (!group) return null;
  const selectedClassType = type
    ? "selected-form-options-selector"
    : "form-options-selector";
  const selectedClassPrivate = isPrivate
    ? "selected-form-options-selector"
    : "form-options-selector";
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorsObj = {};

    if (!name) errorsObj.name = "Name is required";
    if (name && name.length < 5)
      errorsObj.name = "Name must be at least 5 characters";
    if (!type) errorsObj.type = "Event Type is required";
    if (!isPrivate) errorsObj.isPrivate = "Visibility is required";
    if (price.length === 0) errorsObj.price = "Price is required";
    if (price < 0) errorsObj.price = "Price is invalid";
    if (!startDate) errorsObj.startDate = "Event start is required";
    if (startDate && startDate <= currentDate)
      errorsObj.startDate = "Start date must be in the future";
    if (!endDate) errorsObj.endDate = "Event end is required";
    if (endDate && endDate < startDate)
      errorsObj.endDate = "Event end must be after Start date";
    if (
      !url.includes(".png") &&
      !url.includes(".jpg") &&
      !url.includes(".jpeg")
    ) {
      errorsObj.url = "Image URL must end in .png, .jpg, or .jpeg";
    }
    if (about.length < 30)
      errorsObj.about = "Description must be at least 30 characters long";
    let privateEvent;
    if (isPrivate) {
      privateEvent = isPrivate === "Private";
    }
    const event = {
      venueId: parseInt(group.Venues[0].id),
      groupId: id,
      name: name,
      type: type,
      capacity: 30,
      price: price,
      description: about,
      startDate: startDate,
      endDate: endDate,
    };

    if (!Object.keys(errorsObj).length) {
      try {
        const attempt = await dispatch(createNewEvent(event));
        const newEventImage = { eventId: attempt.id, url, preview: true };
        await dispatch(createNewEventImage(newEventImage));
        history.push(`/events/${attempt.id}`);
      } catch (e) {
        const errors = await e.json();
        setErrors(errors.errors);
      }
    } else {
      setErrors(errorsObj);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="group_form">
      <h1 className="create_event_text">Create an event for {group.name}</h1>
      <div className="form_event_sub_container form_event_sub_container1">
        <label className="event_labels">
          <p>What is the name of your event?</p>
          <input
            className="event_name_ulr event_input_field"
            placeholder="Event Name"
            type="text"
            value={name}
            onChange={(e) => {
              if (!e.target.value) {
                errors.name = "Name is required";
              } else if (e.target.value && e.target.value.length < 5) {
                errors.name = `Name must be at least 5 characters`;
              } else {
                errors.name = null;
              }
              setName(e.target.value);
            }}
          ></input>
        </label>
        {errors.name && <p className="errors">{errors.name}</p>}
      </div>
      <div className="form_event_sub_container form_event_sub_container2">
        <label className="event_labels">
          <p>Is this an in person or online event?</p>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              if (!e.target.value) {
                errors.type = "Event Type is required";
              } else {
                errors.type = null;
              }
            }}
            className={`event_input_field ${selectedClassType}`}
          >
            <option value="" disabled hidden>
              (Select One)
            </option>
            <option value="Online">Online</option>
            <option value="In person">In Person</option>
          </select>
        </label>
        {errors.type && <p className="errors">{errors.type}</p>}
        <label className="event_labels">
          <p>Is this event private or public?</p>
          <select
            value={isPrivate}
            onChange={(e) => {
              setIsPrivate(e.target.value);
              if (e.target.value) errors.isPrivate = null;
            }}
            className={`event_input_field ${selectedClassPrivate}`}
          >
            <option value="" disabled hidden>
              (Select One)
            </option>
            <option value={"Private"}>Private</option>
            <option value={"Public"}>Public</option>
          </select>
        </label>
        {errors.isPrivate && <p className="errors">{errors.isPrivate}</p>}
        <label className="event_labels">
          <p>What is the price for your event?</p>
          <input
            type="number"
            step='0.01'
            placeholder="0"
            value={price}
            min='0'
            onChange={(e) => {
              setPrice(e.target.value);
              if (e.target.value >= 0) {
                errors.price = null;
              }
            }}
            className="price_event_input event_input_field"
          ></input>
        </label>
        {errors.price && <p className="errors">{errors.price}</p>}
      </div>
      <div className="form_event_sub_container form_event_sub_container3">
        <label className="event_labels">
          <p>When does your event start?</p>
          <input
            type="datetime-local"
            step='900'
            value={startDate}
            placeholder="MM/DD/YYYY, HH/mm AM"
            onChange={(e) => {
              setStartDate(e.target.value);
              if (!e.target.value) {
                errors.startDate = "Event start is required";
              } else if (e.target.value && new Date(e.target.value) < new Date ()) {
                errors.startDate = `Event must be in the future`
              } else errors.startDate = null;
            }}
            className=" event_input_field"
          ></input>
        </label>
        {errors.startDate && <p className="errors">{errors.startDate}</p>}
        <label className="event_labels">
          <p>When does your event end?</p>
          <input
            type="datetime-local"
            value={endDate}
            placeholder="MM/DD/YYYY, HH/mm PM"
            step='900'
            onChange={(e) => {
              setEndDate(e.target.value);
              if (!e.target.value) {
                errors.endDate = "Event end is required";
              } else if (new Date(e.target.value) < new Date(startDate)) {
                errors.endDate = "Event end must be after Start date";
              } else {
                errors.endDate = null;
              }
            }}
            className=" event_input_field"
          ></input>
        </label>
        {errors.endDate && <p className="errors">{errors.endDate}</p>}
      </div>
      <div className="form_event_sub_container form_event_sub_container4">
        <label className="event_labels">
          <p>Please add in image url for your event below:</p>
          <input
            className="event_name_ulr event_input_field"
            placeholder="Image URL"
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (
                !e.target.value.includes(".png") &&
                !e.target.value.includes(".jpg") &&
                !e.target.value.includes(".jpeg")
              ) {
                errors.url = "Image URL must end in .png, .jpg, or .jpeg";
              } else {
                errors.url = null;
              }
            }}
          ></input>
        </label>
        {errors.url && <p className="errors">{errors.url}</p>}
      </div>
      <div className="form_event_sub_container form_event_sub_container5">
        <label className="event_labels">
          <p>Please describe your event:</p>
          <textarea
            placeholder="Please include at least 30 characters"
            value={about}
            onChange={(e) => {
              if (e.target.value.length < 30) {
                errors.about =
                  "Description must be at least 30 characters long";
              } else {
                errors.about = null;
              }
              setAbout(e.target.value);
            }}
            className="event_about_input event_input_field"
          ></textarea>
        </label>
        {errors.about && <p className="errors">{errors.about}</p>}
      </div>
      <button type="submit" className="form-submit-button">
        Create Event
      </button>
    </form>
  );
};

export default CreateEvent;
