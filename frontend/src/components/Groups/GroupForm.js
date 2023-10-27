import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createNewGroup } from "../../store/groups";
import { updateGroupThunk } from "../../store/groups";
import { createNewGroupImage } from "../../store/groupImages";
import { useSelector } from "react-redux";
import { createNewVenue } from "../../store/venue";

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
  // const [location, setLocation] = useState(
  //   formType === "Update Group" ? group.location : ""
  // );
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
    // const cityState = location && location.split(",");
    // const city = cityState[0];
    // const state = cityState[1];
    const errorsObj = {};
    if (
      !image.includes(".png") &&
      !image.includes(".jpg") &&
      !image.includes(".jpeg")
    ) {
      errorsObj.url = "Image URL must end in .png, .jpg, or .jpeg";
    }
    if (!city.length) {
      errorsObj.city = "City is required";
    } 
      if (!state) errorsObj.state = "State is required";
    if (about.length < 50)
      errorsObj.about = "Description must be at least 50 characters long";
    if (!name) errorsObj.name = "Name is required";
    if (!type) errorsObj.type = "Group Type is required";
    if (!isPrivate) errorsObj.isPrivate = "Visibility Type is required";

    let privateGroup;
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
          const newVenue = { 
            groupId: attempt.id,
            address: '123 Demo Street',
            city: city,
            state: state,
            lat: 10,
            lng: 10
          };
          await dispatch(createNewVenue(newVenue))
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
  const selectedClassType = type
    ? "selected-form-options-selector"
    : "form-options-selector";
  const selectedClassPrivate = isPrivate
    ? "selected-form-options-selector"
    : "form-options-selector";
  const selectedState = state ?
  'form_textarea_state' :
  'form_textarea_state_not_selected'
  /* **DO NOT CHANGE THE RETURN VALUE** */
  return (
    <form onSubmit={handleSubmit} className="group_form">
      <label>
        <h2>First, set your group's location.</h2>
        <p className="group-form-p-descriptions">
          GatherUp groups meet locally, in person and online. We'll connect you
          with people in your area, and more can join you online.
        </p>
        <div className="city_state_container">
          <div>
          <input
            className="form_textarea_city"
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              if (!e.target.value) errors.city = "City is required";
              else {
                errors.city = null;
              }
            }}
            placeholder="City"
          />
          {errors.city && <p className="errors">{errors.city}</p>}
          </div>
          {/* <input
          className="form_textarea"
          type="text"
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            if (!e.target.value) errors.state = "State is required";
            else {
              errors.state = null;
            }
          }}
          placeholder="State"
        /> */}
        <div>

          <select
            className={selectedState}
            type="text"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              if (!e.target.value) errors.state = "State is required";
              else {
                errors.state = null;
              }
            }}
            placeholder="State"
          >
            <option value="" disabled hidden>
              State
            </option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="DC">District Of Columbia</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PA">Pennsylvania</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
          </select>
          {errors.state && <p className="errors">{errors.state}</p>}
        </div>
        </div>
      </label>
      {/* {errors.city ||
        (errors.state && (
          <p className="errors">Location is required (eg. Concord, CA)</p>
        ))} */}
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
          onChange={(e) => {
            if (!e.target.value) {
              errors.name = "Name is required";
            } else if (e.target.value.length > 60) {
              errors.name = "Name must be 60 characters or less";
            } else {
              errors.name = null;
            }
            setName(e.target.value);
          }}
          placeholder="What is your group name?"
        />
      </label>
      {errors.name && <p className="errors">{errors.name}</p>}
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
          onChange={(e) => {
            setAbout(e.target.value);
            console.log(e.target.value.length);
            if (e.target.value.length < 50) {
              errors.about = "Description must be 50 characters or more";
            } else {
              errors.about = null;
            }
          }}
          placeholder="Please write at least 50 characters"
        />
      </label>
      {errors.about && <p className="errors">{errors.about}</p>}

      <div className="selection-buttons">
        <h2>Final steps...</h2>
        <label for="online">
          <div>Is this an in person or online group?</div>
          <select
            id="online"
            value={type}
            onChange={(e) => {
              if (!e.target.value) {
                errors.type = "Group Type is required";
              } else {
                errors.type = null;
              }
              setType(e.target.value);
            }}
            className={selectedClassType}
          >
            <option value="" disabled hidden>
              (Select One)
            </option>
            <option value="Online">Online</option>
            <option value="In person">In Person</option>
          </select>
        </label>
        {errors.type && <p className="errors">{errors.type}</p>}

        <label for="privacy">
          Is this group private or public?
          <select
            id="privacy"
            value={isPrivate}
            onChange={(e) => {
              setIsPrivate(e.target.value);
              if (!e.target.value) {
                errors.isPrivate = "Visibility Type is required";
              } else {
                errors.isPrivate = null;
              }
            }}
            className={selectedClassPrivate}
          >
            <option value="" disabled hidden>
              (Select One)
            </option>
            <option value={"Private"}>Private</option>
            <option value={"Public"}>Public</option>
          </select>
        </label>
        {errors.private && <p className="errors">{errors.isPrivate}</p>}
        {errors.isPrivate && <p className="errors">{errors.isPrivate}</p>}
        <label>
          Please add an image url for your group below:
          <input
            type="text"
            value={image}
            onChange={(e) => {
              if (
                !e.target.value.includes(".png") &&
                !e.target.value.includes(".jpg") &&
                !e.target.value.includes(".jpeg")
              ) {
                errors.url = "Image URL must end in .png, .jpg, or .jpeg";
              } else {
                errors.url = null;
              }
              setImage(e.target.value);
            }}
            placeholder="Image Url"
            className="form_textarea"
          />
        </label>
        {errors.url && <p className="errors">{errors.url}</p>}
      </div>
      <button type="submit" className="form-submit-button">
        {formType}
      </button>
    </form>
  );
};

export default GroupForm;
