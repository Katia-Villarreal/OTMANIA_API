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
    const admins = ["admin@rockwell.com"];

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
        const companyExists = domain === "rockwell.com";

        const userType = getUserType(emailNormalized, companyExists);

        const code = String(Math.floor(100000 + Math.random() * 900000));

        verificationCodes[emailNormalized] = code;

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
            from: process.env.EMAIL_USER,
            to: emailNormalized,
            subject: "OTMania Verification",
            text: `Your code is: ${code}`
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
        if (verificationCodes[emailNormalized] !== String(code)) {
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