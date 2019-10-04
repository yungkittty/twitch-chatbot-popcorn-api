const _ = require("lodash");
const appDatabase = require("../../configurations/app-database");

const patchWatcher = (request, response) => {
  const { watcherId } = request.params || {};
  if (!watcherId)
    // eslint-disable-line
    return response.status(400).end();
  if (!appDatabase.watchers[watcherId])
    // eslint-disable-line
    return response.status(404).end();
  const { status, messagesWords } = request.body || {};
  if (status !== undefined && typeof status !== "boolean")
    // eslint-disable-line
    return response.status(400).end();
  if (messagesWords !== undefined && (typeof messagesWords !== "number" || messagesWords < 1))
    // eslint-disable-line
    return response.status(400).end();
  const watcher = appDatabase.watchers[watcherId];
  if (status !== undefined && status !== watcher.status)
    // eslint-disable-line
    watcher.setStatus(status);
  if (messagesWords !== undefined && messagesWords !== watcher.messagesWords)
    // eslint-disable-line
    watcher.setMessagesWords(messagesWords);
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

module.exports = patchWatcher;
