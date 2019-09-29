const express = require("express");

const app = express();

app.use(express.json());

const { postWatcher, patchWatcher } = require("./routes/watchers");

app.post("/api/watchers", postWatcher);

// app.delete("/api/watchers/:watcher_id");

// app.patch("/api/watchers/:watcher_id", patchWatcher);

// app.get("/api/watchers/:watch_id/messages");

// app.delete("/api/watchers/:watch_id/messages");

const appServerPort = 8080;

app.listen(appServerPort, () => console.log(`[INFO] Server is listening on http://localhost:${appServerPort}!`));
