const _ = require("lodash");
const Watcher = require("./models/watcher");
const appWhitelist = require("../../configurations/app-whitelist");
const appDatabase = require("../../configurations/app-database");

const postWatcher = (request, response) => {
  const { whitelistId = "" } = request.body;
  const isWhitelistedId =
    // eslint-disable-line
    _.chain(appWhitelist)
      .keys()
      .includes(whitelistId)
      .value();
  if (!isWhitelistedId)
    // eslint-disable-line
    return response.status(401).end();
  const watcherId = whitelistId;
  const watcherCreds = appWhitelist[whitelistId];
  appDatabase.watchers[watcherId] =
    // eslint-disable-line
    new Watcher(watcherId, watcherCreds);
  const responseJson = { whitelistId };
  return response.status(200).json(responseJson);
};

module.exports = postWatcher;
