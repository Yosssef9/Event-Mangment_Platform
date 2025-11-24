import { stripe } from "../config/stripe.js";
import Event from "../models/Event.js";
import Payment from "../models/Payment.js";
import EventAttendee from "../models/EventAttendee.js";
import { generateTicketForUser } from "./ticketController.js";
import sendEmail from "../config/sendEmail.js";

export const webhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Respond fast to Stripe
  res.status(200).json({ received: true });

  // Process asynchronously
  (async () => {
    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        // 1️⃣ Idempotency checks
        const existingPayment = await Payment.findOne({
          where: {
            userId: session.metadata.userId,
            eventId: session.metadata.eventId,
          },
        });

        if (existingPayment) return; // Already processed

        // 2️⃣ Save payment
        await Payment.create({
          userId: session.metadata.userId,
          eventId: session.metadata.eventId,
          amount: session.amount_total / 100,
          currency: session.currency,
          status: "paid",
          stripeSessionId: session.id,
        });

        // 3️⃣ Create attendance if not exists
        const existingAttendance = await EventAttendee.findOne({
          where: {
            userId: session.metadata.userId,
            eventId: session.metadata.eventId,
          },
        });

        if (!existingAttendance) {
          await EventAttendee.create({
            userId: session.metadata.userId,
            eventId: session.metadata.eventId,
            status: "attending",
          });
        }

        // 4️⃣ Generate ticket and QR
        const qrCodeBase64 = await generateTicketForUser(
          session.metadata.userId,
          session.metadata.eventId
        );
        const base64Data = qrCodeBase64.replace(/^data:image\/png;base64,/, "");
        const EventDetails = await Event.findByPk(session.metadata.eventId);
        //       await sendEmail({
        //         to: session.metadata.userEmail,
        //         subject: `Your Ticket for ${EventDetails.title} 🎫`,
        //         html: `
        //   <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #fff;">

        //     <!-- Event Image -->
        //     ${
        //       EventDetails.image
        //         ? `<img src="${EventDetails.image}" alt="Event Image" style="width:100%; border-radius: 8px; margin-bottom: 20px;" />`
        //         : ""
        //     }

        //     <!-- Header -->
        //     <h1 style="color: #d946ef; margin-bottom: 10px;">Thank you for your payment!</h1>
        //     <p>You have successfully booked a ticket for the event:</p>

        //     <!-- Event Details -->
        //     <h2 style="color: #d946ef; margin-bottom: 5px;">${EventDetails.title}</h2>
        //     <p><strong>Date:</strong> ${EventDetails.startDate.toLocaleString()}</p>
        //     <p><strong>Location:</strong> ${
        //       EventDetails.isOnline
        //         ? "Online Event"
        //         : `${EventDetails.city}, ${EventDetails.street}`
        //     }</p>
        //     <p><strong>Ticket Price:</strong> ${EventDetails.price} EGP</p>

        //     <!-- QR Code -->
        //     <p style="margin-top: 20px;">Show this QR code at the event entrance:</p>
        //     <img src="cid:ticketQrCode" alt="Ticket QR Code" style="max-width: 200px; display: block; margin-top: 10px;"/>

        //   </div>
        // `,
        //         text: `Thank you for your payment! Your ticket for ${event.title} is attached as a QR code.`,
        //         attachments: [
        //           {
        //             filename: "ticket.png",
        //             content: base64Data,
        //             encoding: "base64",
        //             cid: "ticketQrCode", // must match src cid in html
        //           },
        //         ],
        //       });

        console.log(
          "✅ Ticket email sent to user:",
          session.metadata.userEmail
        );
      }

      // handle other event types if needed
    } catch (err) {
      console.error("Error processing webhook async:", err);
    }
  })();
};
