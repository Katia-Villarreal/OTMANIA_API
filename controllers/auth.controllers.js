import nodemailer from "nodemailer";
import { hashPassword } from "../utils/hash.js";
import { PostUser } from "./users.controllers.js";

const verificationCodes = {};
const pendingUsers = {};

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Determine user type based on email and company domain
function getUserType(email, companyExists) {
    const admins = ["admin@rockwellautomation.com"];

    if (admins.includes(email.toLowerCase())) return 1;
    if (companyExists) return 2;
    return 3;
}

// Send verification code to user's email
export const sendCode = async (req, res) => {
    const { firstName, lastName, email, password, nickname, country } = req.body;
    const emailNormalized = email.toLowerCase().trim();
    try {
        if (!email || !password || !firstName || !lastName || !nickname || !country) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const hashedPassword = hashPassword(password);

        if (!emailNormalized.includes("@")) {
            return res.status(400).json({ message: "Invalid email" });
        }
        const domain = emailNormalized.split("@")[1];
        const companyExists = domain === "rockwellautomation.com";

        const userType = getUserType(emailNormalized, companyExists);

        const code = String(Math.floor(100000 + Math.random() * 900000));

        verificationCodes[emailNormalized] = {
            code,
            expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
        };

        pendingUsers[emailNormalized] = {
            firstName,
            lastName,
            email: emailNormalized,
            password: hashedPassword,
            nickname,
            country,
            userType,
            company: companyExists ? 1 : null
        };

        await transporter.sendMail({
            from: `"OTMania" <${process.env.EMAIL_USER}>`,
            to: emailNormalized,
            subject: "Verify your OTMania account",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    
                    <h2 style="color: #CD163F;">Welcome to OTMania</h2>
                    
                    <p>Hello,</p>
                    
                    <p>Thank you for creating an account. To continue, please use the verification code below:</p>
                    
                    <div style="
                        font-size: 28px;
                        font-weight: bold;
                        letter-spacing: 5px;
                        margin: 20px 0;
                        color: #14181d;
                    ">
                        ${code}
                    </div>
                    
                    <p>This code is required to complete your registration.</p>
                    
                    <p style="margin-top: 30px;">
                        If you did not request this, you can safely ignore this email.
                    </p>
                    
                    <hr style="margin: 30px 0;">
                    
                    <p style="font-size: 12px; color: #888;">
                        © 2026 OTMania. All rights reserved.
                    </p>
                
                </div>
            `
        });

        res.json({ message: "Code sent" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error sending email" });
    }
};

// Code verification and user creation
export const verifyCode = async (req, res) => {
    const { email, code } = req.body;
    
    if (!email || !code) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const emailNormalized = email.toLowerCase().trim();

    try {
        const storedData = verificationCodes[emailNormalized];

        if (!storedData) {
            return res.status(400).json({ message: "No code found" });
        }

        // Expiration check
        if (Date.now() > storedData.expiresAt) {
            delete verificationCodes[emailNormalized];
            delete pendingUsers[emailNormalized];
            return res.status(400).json({ message: "Code expired" });
        }

        // Code match check
        if (storedData.code !== String(code)) {
            return res.status(400).json({ message: "Invalid code" });
        }

        if (!pendingUsers[emailNormalized]) {
            return res.status(400).json({ message: "No pending user" });
        }
        const user = pendingUsers[emailNormalized];

        console.log("Usuario listo para guardar:", user);

        await PostUser({
            body: {
                FirstName: user.firstName,
                LastName: user.lastName,
                Nickname: user.nickname,
                Email: user.email,
                Password: user.password,
                Country: user.country,
                IDUserType: user.userType,
                IDCompany: user.company
            }
        });

        delete verificationCodes[emailNormalized];
        delete pendingUsers[emailNormalized];

        return res.json({ message: "User created" });

    } catch (err) {
        res.status(500).json({ message: "Error verifying code" });
    }
};