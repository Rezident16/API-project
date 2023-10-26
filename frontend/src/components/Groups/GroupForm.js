import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createNewGroup } from "../../store/groups";
import { updateGroupThunk } from "../../store/groups";
import { createNewGroupImage } from "../../store/groupImages";
import { useSelector } from "react-redux";

const GroupForm = ({ group, formType }) => {
  const history = useHistory();

  const [name, setName] = useState(
    formType === "Update Group" ? group.name : ""
  );
  const [about, setAbout] = useState(
    formType === "Update Group" ? group.about : ""
  );
  const [type, setType] = useState(
    formType === "Update Group" ? group.type : ""
  );
  let [isPrivate, setIsPrivate] = useState(
    formType === "Update Group" ? group.isPrivate : ""
  );
  const [location, setLocation] = useState(
    formType === "Update Group" ? group.location : ""
  );
  const [city, setCity] = useState(
    formType === "Update Group" ? group.city : ""
  );
  const [state, setState] = useState(
    formType === "Update Group" ? group.state : ""
  );
  const [image, setImage] = useState(
    formType === "Update Group" ? group.previewImage || "" : ""
  );
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cityState = location && location.split(",");
    const city = cityState[0];
    const state = cityState[1];
    const errorsObj = {};
    if (
      !image.includes(".png") &&
      !image.includes(".jpg") &&
      !image.includes(".jpeg")
    ) {
      errorsObj.url = "Image URL must end in .png, .jpg, or .jpeg";
    }
    if (!location.length) {
      errorsObj.location = "Location is required";
    } else {
      if (!location.includes(","))
        errorsObj.location = "Location requires city, State (eg. Boston, MA)";
    }
    if (about.length < 50)
      errorsObj.about = "Description must be at least 50 characters long";
    if (!name) errorsObj.name = "Name is required";
    if (!type) errorsObj.type = "Group Type is required";
    if (!isPrivate) errorsObj.isPrivate = "Visibility Type is required";

    let privateGroup
    if (isPrivate) {
      privateGroup = isPrivate === "Private";
    }

    group = {
      ...group,
      name,
      about,
      type,
      private: privateGroup,
      city,
      state,
    };

    if (!Object.keys(errorsObj).length) {
      if (formType === "Update Group") {
        try {
          const attempt = await dispatch(updateGroupThunk(group));
          const newImage = { groupId: attempt.id, url: image, preview: true };
          await dispatch(createNewGroupImage(newImage));
          history.push(`/groups/${attempt.id}`);
        } catch (e) {
          const errors = await e.json();
          setErrors(errors.errors);
        }
      } else {
        try {
          const attempt = await dispatch(createNewGroup(group));
          const newImage = { groupId: attempt.id, url: image, preview: true };
          await dispatch(createNewGroupImage(newImage));
          history.push(`/groups/${attempt.id}`);
        } catch (e) {
          const errors = await e.json();
          setErrors(errors.errors);
        }
      }
    } else {
      setErrors(errorsObj);
    }
  };
  const selectedClassType = type ? "selected-form-options-selector" : "form-options-selector"
  const selectedClassPrivate = isPrivate ? "selected-form-options-selector" : "form-options-selector"
  /* **DO NOT CHANGE THE RETURN VALUE** */
  return (
    
    <form onSubmit={handleSubmit} className="group_form">
      <label>
        <h2>First, set your group's location.</h2>
        <p className="group-form-p-descriptions">
          GatherUp groups meet locally, in person and online. We'll connect you
          with people in your area, and more can join you online.
        </p>
        <input
        className="form_textarea"
          type="text"
          value={location}
          onChange={(e) => {setLocation(e.target.value)
          if (!e.target.value) errors.location = "Location is required"
          else {errors.location = null}
          }}
          placeholder="city, STATE"
        />
      </label>
      {errors.location && <p className="errors">{errors.location}</p>}
      {errors.city ||
        (errors.state && <p className="errors">Location is required (eg. Concord, CA)</p>)}
      <label>
        <h2>What will your group's name be?</h2>
        <p className="group-form-p-descriptions">
          Choose a name that will give people a clear idea of what the group is
          about. Feel free to get creative! You can edit this later if you
          change your mind.
        </p>
        <input
        className="form_textarea"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What is your group name?"
        />
      </label>
      {errors.name && <p className="errors">Name is required</p>}
      <label>
        <h2>Now describe what your group will be about</h2>
        <p className="group-form-p-descriptions">
          People will see this when we promote your group, but you'll be able to
          add to it later, too.
        </p>
        <ol>
          <li>What's the purpose of the group?</li>
          <li>Who should join?</li>
          <li>What will you do at your events?</li>
        </ol>
        <textarea 
        className="form_textarea form-textarea-about"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="Please write at least 50 characters"
        />
      </label>
      {errors.about && <p className="errors">Description must be at least 50 characters long</p>}
      
      <div className="selection-buttons">
        <h2>Final steps...</h2>
        <label for="online">
        <div>
        Is this an in person or online group?
        </div>
        <select
          id="online"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={selectedClassType}
        >
          <option value="" disabled hidden>
            (Select One)
          </option>
          <option value="Online">Online</option>
          <option value="In person">In Person</option>
        </select>
        </label>
        {errors.type && <p className="errors">Group Type is required</p>}

        <label for="privacy">Is this group private or public?
        <select
          id="privacy"
          value={isPrivate}
          onChange={(e) => setIsPrivate(e.target.value)}
          className={selectedClassPrivate}
        >
          <option value="" disabled hidden>
            (Select One)
          </option>
          <option value={'Private'}>Private</option>
          <option value={'Public'}>Public</option>
        </select>
        </label>
        {errors.private && <p className="errors">Visibility Type is required</p>}
        {errors.isPrivate && <p className="errors">{errors.isPrivate}</p>}
        <label>Please add an image url for your group below:
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image Url"
          className="form_textarea"
        />
        </label>
      {errors.url && <p className="errors">Image URL must end in .png, .jpg, or .jpeg</p>}
      </div>
      <button type="submit" className="form-submit-button">{formType}</button>
    </form>
  );
};

export default GroupForm;
