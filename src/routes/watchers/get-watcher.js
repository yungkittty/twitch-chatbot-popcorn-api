const _ = require("lodash");
const appDatabase = require("../../configurations/app-database");

const getWatcher = (request, response) => {
  const { watcherId } = request.params || {};
  if (!watcherId)
    // eslint-disable-line
    return response.status(400).end();
  if (!appDatabase.watchers[watcherId])
    // eslint-disable-line
    return response.status(404).end();
  const watcher = appDatabase.watchers[watcherId];
  return response.status(200).json(
    _.pick(watcher, [
      // eslint-disable-line
      "id",
      "status",
      "messagesWords",
      "messagesAt"
    ])
  );
};

module.exports = getWatcher;
