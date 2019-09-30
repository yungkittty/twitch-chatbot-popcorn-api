const _ = require("lodash");
const uuid = require("uuid/v4");
const Watcher = require("./models/watcher");
const appDatabase = require("../../configurations/app-database");

const postWatcher = (request, response) => {
  const { userId = "" } = request.params || {};
  if (!userId)
    // eslint-disable-line
    return response.status(400).end();
  if (!appDatabase.users[userId])
    // eslint-disable-line
    return response.status(404).end();
  const user = appDatabase.users[userId];
  const watcherId = user.watcherId || uuid();
  const watcherCreds = user.credentials;
  if (!appDatabase.watchers[watcherId]) {
    appDatabase.watchers[watcherId] =
      // eslint-disable-line
      new Watcher(watcherId, watcherCreds);
    user.watcherId = watcherId;
  }
  return response.status(200).json({ watcherId });
};

module.exports = postWatcher;
