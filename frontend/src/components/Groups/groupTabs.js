import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import GroupMembers from "./Members/groupMembers";
import EventList from "./eventList";
import { useDispatch, useSelector } from "react-redux";
import { readMemberships } from "../../store/memberships";
import { useEffect } from "react";
import { readGroup } from "../../store/group";

function GroupTabs({ group, organizer }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(readMemberships(group.id));
  }, [group, dispatch]);
  const members = useSelector((state) => state.membership.Members);
  if (!members || members.length === 0) return "Loading...";
  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>About</Tab>
          <Tab>Members</Tab>
          <Tab>Events</Tab>
        </TabList>

        <TabPanel>
          <div className="group_lower_container">
            <div className="lower_container_group_upper_details">
              <h2>Organizer</h2>
              <div className="first_last_name_group">
                {organizer.firstName} {organizer.lastName}
              </div>
              <h2>What we're about</h2>
              <p className="description_on_a_group">{group.about}</p>
            </div>
            <EventList groupId={group.id} />
          </div>
        </TabPanel>
        <TabPanel>
          <GroupMembers
            members={members}
            organizer={organizer}
            groupId={group.id}
          />
        </TabPanel>
        <TabPanel>
          <EventList groupId={group.id} />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default GroupTabs;
