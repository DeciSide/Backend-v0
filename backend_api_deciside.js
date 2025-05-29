const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

let users = {};
let decisions = [];

app.post("/api/login", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Nome richiesto");
  const id = uuidv4();
  users[id] = { id, name };
  res.json({ userId: id });
});

app.post("/api/decision", (req, res) => {
  const { userId, decision, options, values, suggestion } = req.body;
  if (!userId || !decision || !options || !values || !suggestion) {
    return res.status(400).send("Dati incompleti");
  }
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
});

app.get("/api/history/:userId", (req, res) => {
  const { userId } = req.params;
  const userHistory = decisions.filter((d) => d.userId === userId);
  res.json(userHistory);
});

app.listen(port, () => {
  console.log(`API server in esecuzione su http://localhost:${port}`);
});
