const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const { postWatcher, getWatcher, patchWatcher } = require("./routes/watchers");

app.post("/api/watchers/:userId", postWatcher);

app.get("/api/watchers/:watcherId", getWatcher);

app.patch("/api/watchers/:watcherId", patchWatcher);

// app.delete("/api/watchers/:watcherId");

const { getMetrics } = require("./routes/watchers/routes/metrics");

app.get("/api/watchers/:watcherId/metrics", getMetrics);

const { deleteMessages } = require("./routes/watchers/routes/messages");

app.delete("/api/watchers/:watcherId/messages", deleteMessages);

const appServerPort = process.env.PORT || 8080;

app.listen(appServerPort, () => console.log(`[INFO] Server is listening on http://localhost:${appServerPort}!`));
