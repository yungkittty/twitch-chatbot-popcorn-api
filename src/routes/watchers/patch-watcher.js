const appDatabase = require("../../configurations/app-database");

const patchWatcher = (request, response) => {
  const { watcherId } = request.params || {};
  if (!watcherId)
    // eslint-disable-line
    return response.status(400).end();
  if (!appDatabase.watchers[watcherId])
    // eslint-disable-line
    return response.status(404).end();
  const { status } = request.body || {};
  if (status !== undefined && typeof status !== "boolean")
    // eslint-disable-line
    return response.status(400).end();
  const watcher = appDatabase.watchers[watcherId];
  if (status !== undefined && status !== watcher.status)
    // eslint-disable-line
    watcher.setStatus(status);
  return response.status(200).json({ id: watcher.id, status: watcher.status });
};

module.exports = patchWatcher;
