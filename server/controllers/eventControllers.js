import Event from "../models/Event.js";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import EventAttendee from "../models/EventAttendee.js";
import { where } from "sequelize";
import { sequelize } from "../config/db.js";
import { Op, fn, col, literal, Sequelize } from "sequelize";

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      city,
      street,
      isOnline,
      capacity,
      type,
      price,
    } = req.body;
    const isOnlineBoolean = isOnline === "true" || isOnline === true;
    if (req.user.role !== "organizer") {
      return res.status(403).json({
        success: false,
        message: "you are not authorized to do this",
      });
    }
    // Basic validation
    if (!title || !description || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    if (start < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be in the past",
      });
    }

    // Validate location for non-online events
    if (!isOnlineBoolean && (!city || !street)) {
      return res.status(400).json({
        success: false,
        message: "City and street are required for in-person events",
      });
    }
    const imageUrl = req.file?.path;

    // Create the event
    const event = await Event.create({
      title,
      description,
      startDate,
      endDate,
      city: isOnlineBoolean ? null : city,
      street: isOnlineBoolean ? null : street,
      isOnline: isOnlineBoolean,
      capacity: capacity ? parseInt(capacity) : null,
      type,
      organizerId: req.user.id,
      image: imageUrl,
      price: price,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error creating event:", error);

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating event",
      error: error.message,
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const organizerId = parseInt(req.query.organizerId);
    const userId = parseInt(req.query.userId);
    const filterStatus = req.query.filterStatus;
    const searchQuery = req.query.searchQuery;
    const categories = req.query.categories;

    const now = new Date();
    const where = {};

    if (organizerId) where.organizerId = organizerId;

    if (filterStatus === "upcoming") {
      where.startDate = { [Op.gt]: now };
    } else if (filterStatus === "past") {
      where.endDate = { [Op.lt]: now };
    }

    if (searchQuery) {
      where[Op.or] = [
        { title: { [Op.like]: `%${searchQuery}%` } },
        { description: { [Op.like]: `%${searchQuery}%` } },
      ];
    }

    if (categories) {
      const categoryArray = categories.split(",");
      where.type = { [Op.in]: categoryArray };
    }

    // ❇️ لو المستخدم داخل (req.user موجود)
    if (userId) {
      where.id = {
        [Op.notIn]: sequelize.literal(
          `(SELECT "eventId" FROM "EventAttendees" WHERE "userId" = ${userId})`
        ),
      };
    }

    const { count, rows } = await Event.findAndCountAll({
      where,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    // ⬇️ Add isSold for each event
    const enrichedEvents = await Promise.all(
      rows.map(async (event) => {
        // احسب عدد الحاجزين
        const attendeesCount = await EventAttendee.count({
          where: { eventId: event.id, status: "attending" },
        });

        const isSold = event.capacity && attendeesCount >= event.capacity;

        // Total users who rated and average rating
        const ratingsData = await EventAttendee.findAll({
          where: { eventId: event.id, userRating: { [Op.ne]: null } },
          attributes: [
            [fn("COUNT", col("userRating")), "totalRatings"],
            [fn("AVG", col("userRating")), "avgRating"],
          ],
          raw: true,
          plain: true, // returns a single object instead of array
        });

        return {
          ...event.dataValues,
          isSold,
          totalRatings: parseInt(ratingsData?.totalRatings) || 0,
          avgRating:
            ratingsData?.avgRating !== null
              ? parseFloat(ratingsData.avgRating).toFixed(1)
              : 0,
        };
      })
    );

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      events: enrichedEvents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.eventId.trim();

    const event = await Event.findByPk(eventId);
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    res.status(200).json({
      success: true,
      event: event,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1; // Default page = 1
    const limit = parseInt(req.query.limit) || 5; // Default limit = 5
    const offset = (page - 1) * limit;
    // ✅ Validate authorization - users can only view their own bookings
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only view your own bookings",
      });
    }

    // ✅ Fetch bookings with associated Event data
    const { count, rows } = await EventAttendee.findAndCountAll({
      where: { userId: parseInt(userId) },
      offset,
      limit,
      include: [
        {
          model: Event,
          as: "event",
          attributes: [
            "id",
            "title",
            "description",
            "startDate",
            "endDate",
            "city",
            "isOnline",
            "price",
            "type",
            "image",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    console.log("rows", rows);

    res.status(200).json({
      success: true,
      bookings: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ===============================
// 🔹 Cancel Booking
// ===============================
export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    // ✅ Find the booking
    const booking = await EventAttendee.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ✅ Verify authorization - user can only cancel their own bookings
    if (booking.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only cancel your own bookings",
      });
    }

    // ✅ Delete the booking
    await booking.destroy();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getEventDetails = async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await Event.findOne({
      where: { id: eventId },
      attributes: ["organizerId", "capacity"],
      raw: true, // ده اللي بيخلي النتيجة object عادي
    });

    const organizerId = result.organizerId;
    const eventCapacity = result.capacity;
    console.log(organizerId);
    if (organizerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only view your own events",
      });
    }

    let tickets = await Ticket.findAll({
      where: { eventId },
      attributes: ["id", "status", "usedAt"], // بيانات التذكرة
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"], // بيانات المستخدم
        },
      ],
    });

    // اعمل map بحيث تجمع بيانات اليوزر مع بيانات التذكرة
    const attendees = tickets.map((ticket) => ({
      idTicket: ticket.id,
      status: ticket.status,
      usedAt: ticket.usedAt,
      ...ticket.user.toJSON(), // كل بيانات اليوزر
    }));

    const capacityDetails = {
      eventCapacity: eventCapacity,
      sold: attendees.length,
      remaining: eventCapacity - attendees.length,
    };

    res.status(200).json({
      success: true,
      attendees,
      capacityDetails,
    });
  } catch (error) {
    console.error("ErrorgetEventDetails:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getEventAnalytics = async (req, res) => {
  try {
    const { eventId } = req.params; // ناخد الـ eventId من الـ URL
    const organizerId = req.user.id; // المنظم

    // نتأكد إن الحدث فعلاً تابع للمنظم
    const event = await Event.findOne({
      where: {
        id: eventId,
        organizerId,
      },
    });

    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found or not authorized" });
    }

    // عدد الحضور للحدث
    const totalAttendees = await EventAttendee.count({
      where: { eventId },
    });

    // عدد التذاكر المباعة (نفترض نفس totalAttendees)
    const soldTickets = totalAttendees;

    // عدد التذاكر المتبقية
    const remainingTickets = (event.capacity || 0) - totalAttendees;

    // إجمالي الإيرادات للحدث
    const totalRevenue = (event.price || 0) * totalAttendees;

    // البيانات النهائية
    const eventAnalytics = {
      eventId: event.id,
      title: event.title,
      totalAttendees,
      soldTickets,
      remainingTickets,
      totalRevenue,
      capacity: event.capacity,
      price: event.price,
    };

    res.json(eventAnalytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getEventsTotalAnalytics = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const totalAttendees = await EventAttendee.count({
      include: [
        {
          model: Event,
          as: "event",
          where: { organizerId },
          attributes: [],
        },
      ],
    });

    const totalCapacity = await Event.sum("capacity", {
      where: { organizerId },
    });

    const totalRevenue = await sequelize.query(
      `
      SELECT SUM(e.price) AS "totalRevenue"
      FROM "EventAttendees" ea
      JOIN "Event" e ON ea."eventId" = e.id
      WHERE e."organizerId" = :organizerId
      `,
      {
        replacements: { organizerId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const revenue = totalRevenue[0]?.totalRevenue || 0;

    const top5Events = await sequelize.query(
      `
      SELECT 
          e.id AS event_id,
          e.title,
          COUNT(ea.id) AS soldTickets
      FROM "Event" e
      LEFT JOIN "EventAttendees" ea
          ON e.id = ea."eventId"
      WHERE e."organizerId" = :organizerId
      GROUP BY e.id, e.title
      ORDER BY soldTickets DESC
      LIMIT 5
      `,
      {
        replacements: { organizerId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const totalEvents = await Event.count({
      where: { organizerId },
    });

    const totalAnalytics = {
      totalAttendees,
      totalRevenue: revenue,
      soldTickets: totalAttendees,
      remainingTickets: totalCapacity - totalAttendees,
      top5Events,
      totalCapacity,
      totalEvents,
    };

    return res.json(totalAnalytics);
  } catch (error) {
    console.error("Analytics Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getRecentEvents = async (req, res) => {
  try {
    const organizerId = req.user.id;

    if (!organizerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const recentEvents = await Event.findAll({
      where: { organizerId },
      order: [["createdAt", "DESC"]],
      limit: 3,
    });

    if (!recentEvents.length) {
      return res
        .status(404)
        .json({ message: "No events found for this organizer" });
    }

    res.json(recentEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateEventRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId, rating } = req.body;

    // Validation
    if (!eventId || rating == null) {
      return res
        .status(400)
        .json({ message: "eventId and rating are required" });
    }

    // Check valid rating range (optional)
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Find record
    const attendee = await EventAttendee.findOne({
      where: { userId, eventId },
    });

    if (!attendee) {
      return res
        .status(404)
        .json({ message: "User did not attend this event" });
    }

    // Update rating
    attendee.userRating = rating;
    await attendee.save();

    return res.json({ message: "Rating updated successfully", attendee });
  } catch (error) {
    console.error("updateEventRating Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getEventUserRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.eventId; // or req.query.eventId

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    // Find the attendee record
    const attendee = await EventAttendee.findOne({
      where: { userId, eventId },
      attributes: ["userRating"],
    });

    if (!attendee) {
      return res
        .status(404)
        .json({ message: "User did not attend this event" });
    }

    return res.json({
      eventId,
      userRating: attendee.userRating, // could be null if not rated yet
    });
  } catch (error) {
    console.error("getEventUserRating Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
