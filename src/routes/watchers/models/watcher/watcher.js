const _ = require("lodash");
const { fork } = require("child_process");

class Watcher {
  constructor(watcherId, watcherCreds) {
    this.id = watcherId;
    this.worker = fork("./src/routes/watchers/models/watcher/worker.js");
    this.workerStatus = false;
    this.workerMessages = [];
    this.worker.send({ type: "worker-init", payload: watcherCreds });
    this.worker.on("message", ({ payload: workerMessagesQueue }) => {
      this.workerMessages = _.concat(this.workerMessages, workerMessagesQueue);
      console.log(`[INFO] Worker is flushing w/ ${workerMessagesQueue.length} message(s)!`);
      console.log(`[INFO] workerMessages = ${JSON.stringify(this.workerMessages)}.`);
    });
  }

  setWorkerStatus(workerStatus) {
    this.workerStatus = workerStatus;
    if (workerStatus) {
      this.worker.send({ type: "worker-start" });
      console.log("[INFO] Watcher is starting!");
    } else {
      this.worker.send({ type: "worker-stop" });
      console.log(`[INFO] Watcher is stopping w/ ${this.workerMessages.length} message(s)!`);
    }
  }
}

module.exports = Watcher;
