import { Router } from "express";
import * as statsControllers from "../controllers/stats.controllers.js";

const router = Router();

router.get("/cards", async (req, res) => {
    try {
        const data = await statsControllers.getDashboardCards();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en cards" });
    }
});

router.get("/performance-by-company", async (req, res) => {
    try {
        const data = await statsControllers.getPerformanceByCompany();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en gráfica de barras" });
    }
});

router.get("/task-outcomes", async (req, res) => {
    try {
        const data = await statsControllers.getTaskOutcomes();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en pie chart" });
    }
});

router.get("/avg-user-scores", async (req, res) => {
    try {
        const data = await statsControllers.getAvgUserScores();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en avg scores" });
    }
});

export default router;