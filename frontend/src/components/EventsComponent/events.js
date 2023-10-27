// import React, { useState, useEffect } from "react";
// import * as sessionActions from "../../store/session";
// import { useDispatch, useSelector } from "react-redux";
// import "./Groups.css";
// import { fetchEventDetails } from "../../store/events";
// import { Link, NavLink } from "react-router-dom";


// function EventDetailsForAGroup({ id }) {
//   const dispatch = useDispatch();
//   const eventsObj = useSelector((state) => state.events);
//   const event = eventsObj[id];
  
//   useEffect(() => {
//       dispatch(fetchEventDetails(id));
//     }, [dispatch, id]);

//     if (!event || !event.EventImages || event.EventImages.length === 0) {
//       return null;
//     }
    


//   const previewImage = event.EventImages.find(
//     (image) => image.preview === true
//   );

//   if (!previewImage) {
//     return null;
//   }

//   return (
//     <Link exact to={`/events/${event.id}`} className='event-details-container-on-a-group-link' > 
//     <div className="event-details-container-on-a-group">
//       <div className="event-details-container-on-a-group-upper">
//         <div className="image_group_details">
//           <img src={previewImage.url} />
//           <div>
//             <div className="event-list-event-date">{event.upcomingEventDate}</div>
//             <div className="event-list-event-name">{event.name}</div>
//             <div className="event-list-event-location">
//               {event.Venue.city}, {event.Venue.state}
//             </div>
//           </div>
//         </div>

//         <div>{event.description}</div>
//       </div>
//     </div>
//     </Link>
//   );
// }

// export default EventDetailsForAGroup;
