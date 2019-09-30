const _ = require("lodash");
const uuid = require("uuid/v4");
const Watcher = require("./models/watcher");
const appDatabase = require("../../configurations/app-database");

const postWatcher = (request, response) => {
  const { userId = "" } = request.params || {};
  if (!userId || typeof userId !== "string")
    // eslint-disable-line
    return response.status(400).end();
  if (!appDatabase.users[userId])
    // eslint-disable-line
    return response.status(404).end();
  const watcherId = appDatabase.users[userId].watcherId || uuid();
  const watcherCreds = appDatabase.users[userId].credentials;
  if (!appDatabase.watchers[watcherId])
    // eslint-disable-line
    appDatabase.watchers[watcherId] = new Watcher(watcherId, watcherCreds);
  return response.status(200).json({ watcherId });
};

module.exports = postWatcher;
