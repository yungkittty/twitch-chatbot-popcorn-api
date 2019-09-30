const _ = require("lodash");
const { fork } = require("child_process");

class Watcher {
  constructor(watcherId, watcherCreds) {
    this.id = watcherId;
    this.status = false;
    this.messages = [];
    this.worker = fork("./src/routes/watchers/models/watcher/worker.js");
    this.worker.send({ type: "worker-init", payload: watcherCreds });
    this.worker.on("message", ({ payload: workerMessagesQueue }) => {
      this.messages = _.concat(this.messages, workerMessagesQueue);
      console.log(`[INFO] Watcher is buffering ${workerMessagesQueue.length} message(s)!`);
      console.log(`[INFO] watcherMessages = ${JSON.stringify(this.messages)}.`);
    });
  }

  setStatus(status) {
    this.status = status;
    if (status) {
      this.worker.send({ type: "worker-start" });
      console.log("[INFO] Watcher is starting!");
    } else {
      this.worker.send({ type: "worker-stop" });
      console.log(`[INFO] Watcher is stopping w/ ${this.messages.length} message(s)!`);
    }
  }
}

module.exports = Watcher;
