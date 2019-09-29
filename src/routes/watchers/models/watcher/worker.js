const _ = require("lodash");
const tmi = require("tmi.js");
const Message = require("../../models/message");

const WORKER_TICK_RATE = 2500;

let workerClient = undefined;

let workerEmitter = undefined;

let workerMessagesQueue = [];

const onWorkerClientConnected = () =>
  // eslint-disable-line
  console.log("[INFO] Worker is connected!");

const onWorkerClientMessage = (
  // eslint-disable-line
  workerClientTarget,
  workerClientContext,
  workerClientMessage,
  workerClientSelf
) => {
  if (workerClientSelf) return;
  const workerClientMessageSplit =
    // eslint-disable-line
    _.chain(workerClientMessage)
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .value();
  if (workerClientMessageSplit.length > 2) return;
  const workerClientMessageDeburr =
    // eslint-disable-line
    _.chain(workerClientMessageSplit)
      .join(" ")
      .lowerCase()
      .deburr()
      .value();
  const workerMessageData = workerClientMessageDeburr;
  const workerMessage = new Message(workerMessageData);
  workerMessagesQueue.push(workerMessage);
  console.log(`[INFO] workerMessage = ${JSON.stringify(workerMessage)}.`);
  console.log(`[INFO] workerMessageData = ${workerMessageData}.`);
  console.log(`[INFO] workerMessagesQueue = ${JSON.stringify(workerMessagesQueue)}.`);
};

process.on("message", ({ type, payload = {} }) => {
  switch (type) {
    case "worker-init":
      workerClient = new tmi.client({ identity: payload, channels: [payload.username] });
      workerClient.on("connected", onWorkerClientConnected);
      workerClient.on("message", onWorkerClientMessage);
      console.log("[INFO] Worker is initialising!");
    case "worker-start":
      workerClient.connect();
      workerEmitter = setInterval(() => {
        process.send({ payload: workerMessagesQueue });
        workerMessagesQueue = [];
      }, WORKER_TICK_RATE);
      console.log("[INFO] Worker is starting!");
      return;
    case "worker-stop":
      workerClient.close();
      clearInterval(workerEmitter);
      console.log("[INFO] Worker is stopping!");
      return;
  }
});
