import "dotenv/config";
import express from 'express';
import morgan from "morgan";
import cors from "cors";
import nodemailer from "nodemailer";
import loginRoutes from "./routes/login.routes.js";
import usersRoutes from "./routes/users.routes.js";
import hminigameRoutes from "./routes/hminigame.routes.js";
import gamesessionRoutes from "./routes/gamesession.routes.js";
import authRoutes from "./routes/auth.routes.js";
import statsRoutes from "./routes/stats.routes.js";


const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(loginRoutes);
app.use(usersRoutes);
app.use(hminigameRoutes);
app.use(gamesessionRoutes);
app.use("/", authRoutes);
app.use("/api/stats", statsRoutes);


app.listen(3000, console.log("http://localhost:3000"));