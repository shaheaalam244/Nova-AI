import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { run } from "./gemini.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        const reply = await run(prompt);
        res.json({ reply });
    } catch (err) {
        console.error("Gemini API Error:", err);
        res.status(500).json({ error: err.message || "Gemini processing failed" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

