import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import GroupMembers from "./Members/groupMembers";
import EventList from "./eventList";

function GroupTabs({ group, organizer }) {
  return (
    <div>
      {/* <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
            <Tab eventKey="home" title="Home">
            <p className="description_on_a_group">{group.about}</p>
            </Tab>
            <Tab eventKey="members" title="Members">
            <GroupMembers />
            </Tab>
        </Tabs> */}
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
          <GroupMembers />
        </TabPanel>
        <TabPanel>
            <EventList groupId={group.id} />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default GroupTabs;
