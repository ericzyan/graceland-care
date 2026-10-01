import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BookingSchema = z.object({
  // Step 1
  careFor: z.enum(["myself", "family", "client"]),
  funding: z.enum(["DVA", "NDIS", "Aged Care", "Not sure"]),
  // Step 2
  appointmentType: z.enum(["phone", "home"]),
  preferredDate: z.string().min(1),
  timeWindow: z.enum(["Morning", "Afternoon", "Evening"]),
  // Step 3
  fullName: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email(),
  suburb: z.string().min(2),
  note: z.string().max(500).optional(),
  consent: z.literal(true),
});

export type BookingData = z.infer<typeof BookingSchema>;

export const sendBookingRequest = createServerFn({ method: "POST" })
  .validator(BookingSchema)
  .handler(async ({ data }) => {
    const recipientEmail = "info@gracelandintegratedcare.com.au";

    const careForLabels: Record<string, string> = {
      myself: "Myself",
      family: "A family member",
      client: "A client I support",
    };
    const apptLabels: Record<string, string> = {
      phone: "Free phone consultation",
      home: "Home visit assessment",
    };

    const body = `
New appointment request from the Graceland Integrated Care website.

--- Details ---
Care for:          ${careForLabels[data.careFor]}
Funding type:      ${data.funding}
Appointment type:  ${apptLabels[data.appointmentType]}
Preferred date:    ${data.preferredDate}
Time window:       ${data.timeWindow}

--- Contact ---
Name:   ${data.fullName}
Phone:  ${data.phone}
Email:  ${data.email}
Suburb: ${data.suburb}
Note:   ${data.note ?? "(none)"}

---
This is an appointment request. Please confirm within one business day.
IMPORTANT: Do not store or share any health information contained in this request.
    `.trim();

    // Using mailto: as a server-side email transport requires an SMTP provider.
    // For this deployment target (Cloudflare Workers) we use the MailChannels API
    // which is available free on Cloudflare. If the provider changes, swap the
    // transport here without touching any other file.
    try {
      const res = await fetch("https://api.mailchannels.net/tx/v1/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: recipientEmail }] }],
          from: { email: "noreply@gracelandintegratedcare.com.au", name: "Graceland Website" },
          subject: `Appointment request – ${data.fullName} (${data.funding})`,
          content: [{ type: "text/plain", value: body }],
        }),
      });

      if (!res.ok && res.status !== 202) {
        // Log but don't expose to client
        console.error("MailChannels error", res.status, await res.text());
        throw new Error("send_failed");
      }
    } catch (err) {
      // Graceful degradation: log and surface a user-friendly error
      console.error("Booking email error:", err);
      throw new Error("We could not send your request. Please call us on 0450 698 303 or email info@gracelandintegratedcare.com.au directly.");
    }

    return { ok: true };
  });
