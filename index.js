const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const { getDecisionAnalysis } = require("./ai_analysis_deciside");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

let users = {};
let decisions = [];

// Endpoint per il login simulato
app.post("/api/login", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Nome richiesto" });
  }
  const userId = uuidv4();
  users[userId] = { id: userId, name };
  res.json({ userId });
});

// Endpoint per la generazione decisioni con AI
app.post("/api/decision", async (req, res) => {
  const { userId, decision, options, values } = req.body;
  if (!userId || !decision || !options || !values) {
    return res.status(400).json({ error: "Dati incompleti" });
  }
  try {
    const suggestion = await getDecisionAnalysis(decision, options, values);
    const entry = {
      id: uuidv4(),
      userId,
      decision,
      options,
      values,
      suggestion,
      timestamp: Date.now()
    };
    decisions.push(entry);
    res.json({ success: true, entry });
  } catch (error) {
    console.error("Errore interno:", error);
    res.status(500).json({ error: "Errore nel server" });
  }
});

// Endpoint per recuperare lo storico decisioni
app.get("/api/history/:userId", (req, res) => {
  const { userId } = req.params;
  const userHistory = decisions.filter(d => d.userId === userId);
  res.json(userHistory);
});

app.listen(port, () => {
  console.log(`DeciSide backend in esecuzione su http://localhost:${port}`);
});
