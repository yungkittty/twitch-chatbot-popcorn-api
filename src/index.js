const express = require("express");

const app = express();

app.use(express.json());

const { postWatcher, patchWatcher } = require("./routes/watchers");

app.post("/api/watchers/:userId", postWatcher);

app.patch("/api/watchers/:watcherId", patchWatcher);

// app.delete("/api/watchers/:watcherId");

const { getMetrics } = require("./routes/watchers/routes/metrics");

app.get("/api/watchers/:watcherId/metrics", getMetrics);

const { deleteMessages } = require("./routes/watchers/routes/messages");

app.delete("/api/watchers/:watcherId/messages", deleteMessages);

const appServerPort = 8080;

app.listen(appServerPort, () => console.log(`[INFO] Server is listening on http://localhost:${appServerPort}!`));
