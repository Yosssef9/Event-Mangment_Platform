import crypto from "crypto";
import QRCode from "qrcode";
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
export async function generateTicketForUser(userId, eventId) {
  try {
    // 1️⃣ Prevent duplicates: check if ticket already exists
    const existingTicket = await Ticket.findOne({ where: { userId, eventId } });
    if (existingTicket) return "error duplicated";

    // 2️⃣ Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex"); // 64 chars

    // 3️⃣ Create ticket in DB (without QR first)
    const ticket = await Ticket.create({
      userId,
      eventId,
      token,
      status: "valid",
    });

    // 4️⃣ Generate QR code from token
    const qrImage = await QRCode.toDataURL(token); // Base64 image

    // 5️⃣ Save QR code in DB
    ticket.qrCode = qrImage;
    await ticket.save();

    console.log("🎟 Ticket generated for user:", userId);
    return qrImage;
  } catch (err) {
    console.error("Error generating ticket:", err);
    throw err;
  }
}

export const getMyTicket = async (req, res) => {
  try {
    const eventId = req.query.eventId;
    const userId = req.user.id; // authenticated user
    console.log("eventId", eventId);
    console.log("userId", userId);
    if (!eventId) {
      return res.status(400).json({ message: "eventId is required" });
    }

    const userTicket = await Ticket.findOne({
      where: { userId, eventId },
    });

    if (!userTicket) {
      return res.status(404).json({ message: "No ticket exists" });
    }

    return res.status(200).json({ userTicket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const scanTicket = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const ticketToken = req.params.ticketId;
    console.log("ticketToken", ticketToken);
    // Find ticket and include event and user
    const ticket = await Ticket.findOne({
      where: { token: ticketToken },
      include: [
        {
          model: Event,
          as: "event",
          attributes: ["id", "title", "organizerId"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"], // whatever user info you want
        },
      ],
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if the ticket's event belongs to this organizer
    if (ticket.event.organizerId !== organizerId) {
      return res
        .status(403)
        .json({ message: "You cannot scan tickets for this event" });
    }

    // Check if ticket is already used
    if (ticket.status === "used") {
      return res.status(400).json({ message: "Ticket already used" });
    }

    // Mark ticket as used
    ticket.status = "used";
    await ticket.save();

    // Return ticket + user info
    res.json({
      message: "Ticket scanned successfully",
      ticket: {
        id: ticket.id,
        qrCode: ticket.token,
        event: ticket.event,
        user: ticket.user,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
