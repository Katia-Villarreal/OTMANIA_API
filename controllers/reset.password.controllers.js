import nodemailer from "nodemailer";
import { hashPassword } from "../Utils/hash.js";
import { db_connect } from "../Utils/db.js";

const verificationCodes = {};
const passwordResetRequests = {};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendResetCode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email required" });
    }

    const emailNormalized = email.toLowerCase().trim();

    try {
        const sql = db_connect();

        const result = await sql.query(
            "SELECT * FROM Users WHERE Email = $1",
            [emailNormalized]
        );

        // If email not found in database
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: "Email not found" 
            });
        }

        res.json({ 
            success: true,
            message: "Reset code sent" 
        });

        const code = String(Math.floor(100000 + Math.random() * 900000));

        verificationCodes[emailNormalized] = code;

        passwordResetRequests[emailNormalized] = {
            verified: false,
            expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
        };

        await transporter.sendMail({
            from: `"OTMania" <${process.env.EMAIL_USER}>`,
            to: emailNormalized,
            subject: "Reset your OTMania password",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    
                    <h2 style="color: #CD163F;">Password Reset Request</h2>
                    
                    <p>Hello,</p>
                    
                    <p>We received a request to reset your password. To continue, please use the verification code below:</p>
                    
                    <div style="
                        font-size: 28px;
                        font-weight: bold;
                        letter-spacing: 5px;
                        margin: 20px 0;
                        color: #14181d;
                    ">
                        ${code}
                    </div>
                    
                    <p>This code is required to update your password.</p>
                    
                    <p style="margin-top: 30px;">
                        If you did not request a password reset, you can safely ignore this email.
                    </p>
                    
                    <hr style="margin: 30px 0;">
                    
                    <p style="font-size: 12px; color: #888;">
                        © 2026 OTMania. All rights reserved.
                    </p>
                
                </div>`
        });

        res.json({ message: "Reset code sent" });

    } catch (err) {
        res.status(500).json({ message: "Error sending email" });
    }
};

export const verifyResetCode = (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const emailNormalized = email.toLowerCase().trim();

    if (!passwordResetRequests[emailNormalized]) {
        return res.status(400).json({ message: "No reset request found" });
    }

    console.log("EMAIL:", emailNormalized);
    console.log("CODE FRONT:", code);
    console.log("CODE BACK:", verificationCodes[emailNormalized]);

    // Expiration check
    if (Date.now() > passwordResetRequests[emailNormalized].expiresAt) {
        delete verificationCodes[emailNormalized];
        delete passwordResetRequests[emailNormalized];
        return res.status(400).json({ message: "Code expired" });
    }

    if (verificationCodes[emailNormalized] !== String(code)) {
        return res.status(400).json({ message: "Invalid code" });
    }

    passwordResetRequests[emailNormalized].verified = true;

    res.json({ message: "Code verified" });
};

export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const emailNormalized = email.toLowerCase().trim();

    if (!passwordResetRequests[emailNormalized]?.verified) {
        return res.status(400).json({ message: "Not verified" });
    }

    const hashedPassword = hashPassword(newPassword);

    try {
        const sql = db_connect();

        const text = "UPDATE Users SET Password = $1 WHERE Email = $2";
        const values = [hashedPassword, emailNormalized];

        await sql.query(text, values);

        delete verificationCodes[emailNormalized];
        delete passwordResetRequests[emailNormalized];

        res.json({ message: "Password updated" });

    } catch (err) {
        res.status(500).json({ message: "Error updating password" });
    }
};