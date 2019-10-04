const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const { postWatcher, getWatcher, patchWatcher } = require("./routes/watchers");

app.post("/api/watchers/:userId", postWatcher);

app.get("/api/watchers/:watcherId", getWatcher);

app.patch("/api/watchers/:watcherId", patchWatcher);

const { getMetrics, deleteMetrics } = require("./routes/watchers/routes/metrics");

app.get("/api/watchers/:watcherId/metrics", getMetrics);

app.delete("/api/watchers/:watcherId/metrics", deleteMetrics);

const appServerPort = process.env.PORT || 4000;

app.listen(appServerPort, () => console.log(`[INFO] Server is listening on http://localhost:${appServerPort}!`));
