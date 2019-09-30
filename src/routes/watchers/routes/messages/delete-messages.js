const appDatabase = require("../../../../configurations/app-database");

const deleteMessages = (request, response) => {
  const { watcherId } = request.params || {};
  if (!watcherId)
    // eslint-disable-line
    return response.status(400).end();
  if (!appDatabase.watchers[watcherId])
    // eslint-disable-line
    return response.status(404).end();
  const watcher = appDatabase.watchers[watcherId];
  watcher.messages = [];
  return response.status(200).end();
};

module.exports = deleteMessages;
