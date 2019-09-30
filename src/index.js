const express = require("express");

const app = express();

app.use(express.json());

const { postWatcher, patchWatcher } = require("./routes/watchers");

app.post("/api/watchers/:userId", postWatcher);

app.patch("/api/watchers/:watcherId", patchWatcher);

// app.get("/api/watchers/:watcherId/messages");

// app.delete("/api/watchers/:watcherId/messages");

// app.delete("/api/watchers/:watcherId");

const appServerPort = 8080;

app.listen(appServerPort, () => console.log(`[INFO] Server is listening on http://localhost:${appServerPort}!`));
