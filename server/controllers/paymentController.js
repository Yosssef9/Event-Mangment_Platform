import { stripe } from "../config/stripe.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import EventAttendee from "../models/EventAttendee.js";
import { generateTicketForUser } from "./ticketController.js";
import sendEmail from "../config/sendEmail.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { eventId, eventTitle, price, userId, userEmail } = req.body;

    // 1️⃣ Check if the event exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // 2️⃣ Check if user already has a payment record for this event
    const payment = await Payment.findOne({
      where: { userId, eventId, status: "paid" }, // Only block if paid
    });

    // 3️⃣ Check if user is already attending this event
    const attendee = await EventAttendee.findOne({
      where: { userId, eventId, status: "attending" },
    });

    if (payment || attendee) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event.",
      });
    }

    const totalAttendees = await EventAttendee.count({
      where: { eventId, status: "attending" },
    });

    if (event.capacity && totalAttendees >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: "Event is fully booked. No more seats available.",
      });
    }

    if (event.price === 0) {
      await EventAttendee.create({
        userId: userId,
        eventId: eventId,
        status: "attending",
      });

      // 4️⃣ Generate ticket and QR
      const qrCodeBase64 = await generateTicketForUser(userId, eventId);
      // const base64Data = qrCodeBase64.replace(/^data:image\/png;base64,/, "");
      //     sendEmail({
      //       to: user.email,
      //       subject: `Your Ticket for ${event.title} 🎫`,
      //       html: `
      //   <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #fff;">

      //     <!-- Event Image -->
      //     ${
      //       event.image
      //         ? `<img src="${event.image}" alt="Event Image" style="width:100%; border-radius: 8px; margin-bottom: 20px;" />`
      //         : ""
      //     }

      //     <!-- Header -->
      //     <h1 style="color: #d946ef; margin-bottom: 10px;">Thank you for your payment!</h1>
      //     <p>You have successfully booked a ticket for the event:</p>

      //     <!-- Event Details -->
      //     <h2 style="color: #d946ef; margin-bottom: 5px;">${event.title}</h2>
      //     <p><strong>Date:</strong> ${event.startDate.toLocaleString()}</p>
      //     <p><strong>Location:</strong> ${
      //       event.isOnline ? "Online Event" : `${event.city}, ${event.street}`
      //     }</p>
      //     <p><strong>Ticket Price:</strong> ${event.price} EGP</p>

      //     <!-- QR Code -->
      //     <p style="margin-top: 20px;">Show this QR code at the event entrance:</p>
      //     <img src="cid:ticketQrCode" alt="Ticket QR Code" style="max-width: 200px; display: block; margin-top: 10px;"/>

      //   </div>
      // `,
      //       text: `Thank you for your payment! Your ticket for ${event.title} is attached as a QR code.`,
      //       attachments: [
      //         {
      //           filename: "ticket.png",
      //           content: base64Data,
      //           encoding: "base64",
      //           cid: "ticketQrCode", // must match src cid in html
      //         },
      //       ],
      //     });

      console.log("✅ Ticket email sent to user:", user.email);

      return res.json({
        success: true,
        url: `${process.env.FRONTEND_URL}/paymentSuccess`,
      });
    }

    // 4️⃣ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: eventTitle,
              images: [event.image],
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/paymentSuccess`,
      cancel_url: `${process.env.FRONTEND_URL}/paymentCancel`,
      metadata: { eventId, userId, userEmail },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Error creating checkout session:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};
