import express from "express";
import nodemailer from "nodemailer";
import { neon } from '@neondatabase/serverless';

const app = express();
app.use(express.json());

// Database Connection
const getSql = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is missing. Please add it to Vercel Environment Variables.");
  }
  return neon(url);
};

// Helper for SQL queries with better error logging
const query = async (strings: TemplateStringsArray, ...values: any[]) => {
  try {
    const sql = getSql();
    return await sql(strings, ...values);
  } catch (err: any) {
    console.error("SQL Query Error:", err.message);
    throw err;
  }
};

let isDbInitialized = false;

// Initialize Database Tables
const initDB = async () => {
  if (isDbInitialized) return;
  try {
    console.log("Initializing database tables...");
    // Create registrations table
    await query`
      CREATE TABLE IF NOT EXISTS registrations (
        id TEXT PRIMARY KEY,
        game TEXT NOT NULL,
        category TEXT NOT NULL,
        team_name TEXT,
        player_name TEXT NOT NULL,
        contact_number TEXT NOT NULL,
        email TEXT NOT NULL,
        uid TEXT NOT NULL,
        university TEXT,
        college TEXT,
        roll_no TEXT,
        branch TEXT,
        section TEXT,
        payment_status TEXT DEFAULT 'PENDING',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create pictures table
    await query`
      CREATE TABLE IF NOT EXISTS pictures (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        keyword TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    isDbInitialized = true;
    console.log("Database initialized successfully.");
  } catch (err: any) {
    console.error("Database initialization error:", err.message);
  }
};

// API Health Check (No DB)
app.get("/api/ping", (req, res) => {
  res.json({ success: true, message: "pong", env: !!process.env.DATABASE_URL });
});

// API Health Check (With DB)
app.get("/api/health", async (req, res) => {
  try {
    await initDB();
    const result = await query`SELECT 1 as connected`;
    res.json({ success: true, database: "connected", result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API Route to get slot counts
app.get("/api/registrations/count", async (req, res) => {
  try {
    await initDB();
    const rows = await query`SELECT game, category FROM registrations`;
    res.json({ success: true, data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API Route to get a single registration
app.get("/api/registrations/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await query`SELECT * FROM registrations WHERE id = ${id}`;
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: "Registration not found" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err: any) {
    console.error("Error fetching registration:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API Route to save registration
app.post("/api/registrations", async (req, res) => {
  const { 
    id, game, category, team_name, player_name, 
    contact_number, email, uid, university, 
    college, roll_no, branch, section, payment_status 
  } = req.body;

  try {
    await query`
      INSERT INTO registrations (
        id, game, category, team_name, player_name, 
        contact_number, email, uid, university, 
        college, roll_no, branch, section, payment_status
      ) VALUES (
        ${id}, ${game}, ${category}, ${team_name}, ${player_name}, 
        ${contact_number}, ${email}, ${uid}, ${university}, 
        ${college}, ${roll_no}, ${branch}, ${section}, ${payment_status}
      )
    `;
    res.json({ success: true });
  } catch (err: any) {
    console.error("Error saving registration:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Pictures Route: Get all pictures
app.get("/api/pictures", async (req, res) => {
  try {
    // Try with ORDER BY first
    const rows = await query`SELECT * FROM pictures ORDER BY created_at DESC`.catch(() => 
      // Fallback if created_at doesn't exist
      query`SELECT * FROM pictures`
    );
    res.json({ success: true, data: rows });
  } catch (err: any) {
    console.error("Error fetching pictures:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Pictures Route: Add picture
app.post("/api/pictures", async (req, res) => {
  const { url, keyword } = req.body;
  console.log("Received request to add picture:", { url, keyword });
  try {
    if (!url || !keyword) {
      throw new Error("URL and Keyword are required");
    }
    const id = Math.random().toString(36).substring(2, 10);
    await query`INSERT INTO pictures (id, url, keyword) VALUES (${id}, ${url}, ${keyword})`;
    console.log("Picture added successfully with ID:", id);
    res.json({ success: true });
  } catch (err: any) {
    console.error("Error adding picture:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Pictures Route: Delete picture
app.delete("/api/pictures/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await query`DELETE FROM pictures WHERE id = ${id}`;
    res.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting picture:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API Route to create Cashfree Order
app.post("/api/create-cashfree-order", async (req, res) => {
  const { amount, customerName, customerEmail, customerPhone, orderId } = req.body;

  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    console.error("Missing Cashfree credentials in environment variables");
  }

  // Use sandbox for development, production for production
  // Allow override via environment variable
  const isProd = process.env.CASHFREE_MODE === "production" || process.env.NODE_ENV === "production";
  const url = isProd 
    ? "https://api.cashfree.com/pg/orders" 
    : "https://sandbox.cashfree.com/pg/orders";

  // Ensure no double slashes and ensure protocol is present for return_url
  let baseUrl = process.env.APP_URL || 'http://localhost:3000';
  if (!baseUrl.startsWith('http')) {
    baseUrl = `https://${baseUrl}`;
  }
  const returnUrl = `${baseUrl.replace(/\/$/, '')}/?order_id={order_id}`;

  try {
    if (!clientId || !clientSecret) {
      throw new Error("Cashfree credentials not configured");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: orderId,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
        order_meta: {
          return_url: returnUrl,
        },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Cashfree API Error:", data);
      return res.status(response.status).json({ success: false, error: data.message });
    }

    res.json({ 
      success: true, 
      is_production: isProd,
      ...data 
    });
  } catch (err: any) {
    console.error("Server error creating Cashfree order:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API Route to verify Cashfree payment
app.get("/api/verify-payment/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ success: false, error: "Cashfree credentials not configured" });
  }

  const isProd = process.env.CASHFREE_MODE === "production" || process.env.NODE_ENV === "production";
  const url = isProd 
    ? `https://api.cashfree.com/pg/orders/${orderId}` 
    : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
        "x-api-version": "2023-08-01",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: data.message });
    }

    // Update status in DB if paid
    if (data.order_status === "PAID") {
      await query`UPDATE registrations SET payment_status = 'PAID' WHERE id = ${orderId}`;
    }

    res.json({ success: true, status: data.order_status, data });
  } catch (err: any) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API Route to send email using Nodemailer
app.post("/api/send-confirmation", async (req, res) => {
  const { email, playerName, regId, game, category, teamName, uid } = req.body;

  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || `"Phantom League" <${smtpUser}>`;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn("SMTP credentials are not fully configured. Skipping email sending.");
      return res.json({ success: false, error: "SMTP credentials missing in environment variables." });
    }

    console.log(`Attempting to send email to ${email} using Nodemailer...`);

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: smtpFrom,
      to: email,
      subject: `[TICKET] ${game} - ${playerName} | Phantom League`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; border: 2px solid #00f2ff; border-radius: 15px; overflow: hidden;">
          <div style="background: linear-gradient(90deg, #00f2ff, #7000ff); padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; color: #ffffff;">Phantom League</h1>
            <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.8; color: #ffffff;">OFFICIAL ENTRY TICKET</p>
          </div>
          
          <div style="padding: 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="font-size: 18px; margin: 0;">Hello <strong>${playerName}</strong>,</p>
              <p style="color: #00f2ff; font-size: 14px;">Your registration is VERIFIED.</p>
            </div>

            <div style="border: 1px dashed #444; padding: 20px; border-radius: 10px; background: rgba(255,255,255,0.05);">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #888; font-size: 12px; text-transform: uppercase;">Ticket ID</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #00f2ff;">#${regId}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888; font-size: 12px; text-transform: uppercase;">Game</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #ffffff;">${game}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888; font-size: 12px; text-transform: uppercase;">Category</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #ffffff;">${category}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888; font-size: 12px; text-transform: uppercase;">Team Name</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #ffffff;">${teamName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888; font-size: 12px; text-transform: uppercase;">In-Game ID (UID)</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #ffffff;">${uid}</td>
                </tr>
              </table>
            </div>

            <div style="margin-top: 30px; padding: 15px; background: #1a1a1a; border-radius: 8px; border-left: 4px solid #7000ff;">
              <p style="margin: 0; font-size: 13px; color: #ccc;">
                <strong>Next Steps:</strong> Join our official Discord/WhatsApp group for match timings and room IDs. Keep this ticket safe for verification.
              </p>
            </div>
          </div>

          <div style="background: #111; padding: 20px; text-align: center; font-size: 11px; color: #555; border-top: 1px solid #222;">
            <p style="margin: 0;">This is an automated ticket generated by Phantom League. Do not share your Ticket ID with anyone.</p>
            <p style="margin: 5px 0 0;">&copy; 2024 Wiztron Club. All Rights Reserved.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    res.json({ success: true, messageId: info.messageId });
  } catch (err: any) {
    console.error("Nodemailer error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default app;
