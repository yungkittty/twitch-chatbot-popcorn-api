const appDatabase = require("../../configurations/app-database");

const patchWatcher = (request, response) => {
  const { watcherId } = request.params || {};
  if (!watcherId || typeof watcherId !== "string")
    // eslint-disable-line
    return response.status(400).end();
  if (!appDatabase.watchers[watcherId])
    // eslint-disable-line
    return response.status(404).end();
  const { workerStatus } = request.body || {};
  if (workerStatus !== undefined && typeof workerStatus !== "boolean")
    // eslint-disable-line
    return response.status(400).end();
  const watcher = appDatabase.watchers[watcherId];
  if (workerStatus !== undefined && workerStatus !== watcher.workerStatus)
    // eslint-disable-line
    watcher.setWorkerStatus(workerStatus);
  return response.status(200).json({ id: watcher.id, workerStatus: watcher.workerStatus });
};

module.exports = patchWatcher;
