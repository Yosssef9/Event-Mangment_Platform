import User from "./User.js";
import Event from "./Event.js";
import EventAttendee from "./EventAttendee.js";
import ProfileIcon from "./ProfileIcon.js";
import Ticket from "./Ticket.js";

// User ↔ EventAttendee (M:N via EventAttendee)
User.belongsToMany(Event, { through: EventAttendee, foreignKey: "userId" });
Event.belongsToMany(User, { through: EventAttendee, foreignKey: "eventId" });

// EventAttendee ↔ Event
EventAttendee.belongsTo(Event, {
  foreignKey: "eventId",
  as: "event",
  onDelete: "CASCADE",
});
Event.hasMany(EventAttendee, { foreignKey: "eventId" });

// EventAttendee ↔ User
EventAttendee.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
User.hasMany(EventAttendee, { foreignKey: "userId" });

// Event ↔ Organizer
User.hasMany(Event, { foreignKey: "organizerId" });
Event.belongsTo(User, { foreignKey: "organizerId" });

// ProfileIcon ↔ User
ProfileIcon.hasMany(User, { foreignKey: "profileIconId" });
User.belongsTo(ProfileIcon, { foreignKey: "profileIconId", as: "profileIcon" });

// Ticket ↔ User
Ticket.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Ticket, { foreignKey: "userId" });

// Ticket ↔ Event
Ticket.belongsTo(Event, { foreignKey: "eventId", as: "event" });
Event.hasMany(Ticket, { foreignKey: "eventId" });

export { User, Event, EventAttendee, ProfileIcon, Ticket };
