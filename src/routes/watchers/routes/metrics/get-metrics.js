const _ = require("lodash");
const appDatabase = require("../../../../configurations/app-database");

const getMetrics = (request, response) => {
  const { watcherId } = request.params || {};
  if (!watcherId)
    // eslint-disable-line
    return response.status(400).end();
  if (!appDatabase.watchers[watcherId])
    // eslint-disable-line
    return response.status(404).end();
  const { expire: metricsExpire = 30, count: metricsCount = 3 } = request.query;
  if (metricsExpire < 1 || metricsCount < 1)
    // eslint-disable-line
    return response.status(400).end();
  const watcher = appDatabase.watchers[watcherId];
  const watcherMessages = watcher.messages;
  const metrics =
    // eslint-disable-line
    _.chain(watcherMessages)
      .reduce((metricsOthers, watcherMessage) => {
        const watcherMessageTimestamp = watcherMessage.timestamp;
        const nowTimestamp = Date.now();
        const deltaTimestamp = nowTimestamp - watcherMessageTimestamp;
        if (deltaTimestamp > metricsExpire * 1000) return metricsOthers;
        const metricData = watcherMessage.data;
        const metric = metricsOthers[metricData] || { data: metricData, occurrences: 0 };
        metric.occurrences += 1;
        return { ...metricsOthers, [metricData]: metric };
      }, {})
      .values()
      .sortBy(metric => metric.occurrences)
      .reverse()
      .slice(0, metricsCount)
      .value();
  const metricsOccurencesSum =
    // eslint-disable-line
    _.chain(metrics)
      .sumBy(metric => metric.occurrences)
      .value();
  return response.status(200).json({ metrics, metricsOccurencesSum });
};

module.exports = getMetrics;
