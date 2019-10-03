const _ = require("lodash");
const tmi = require("tmi.js");
const Message = require("../../models/message");

const WORKER_TICK_RATE = 500;

let workerClient = undefined;

let workerEmitter = undefined;

let workerWords = undefined;

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
  if (workerClientMessageSplit.length > workerWords) return;
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

process.on("message", ({ type, payload }) => {
  switch (type) {
    case "worker-init":
      workerClient = new tmi.client({ identity: payload.watcherCreds, channels: [payload.watcherCreds.username] });
      workerClient.on("connected", onWorkerClientConnected);
      workerClient.on("message", onWorkerClientMessage);
      workerWords = payload.watcherWords;
      console.log(`[INFO] Worker is initialising w/ ${workerWords} word(s)! `);
      return;
    case "worker-update-words":
      workerWords = payload.watcherWords;
      console.log(`[INFO] Worker is updating to ${workerWords} word(s)!`);
      return;
    case "worker-start":
      workerClient.connect();
      workerEmitter = setInterval(() => {
        if (!workerMessagesQueue.length) return;
        process.send({ payload: workerMessagesQueue });
        workerMessagesQueue = [];
        console.log("[INFO] Worker is flushing!");
      }, WORKER_TICK_RATE);
      console.log("[INFO] Worker is starting!");
      return;
    case "worker-stop":
      workerClient.disconnect();
      clearInterval(workerEmitter);
      console.log("[INFO] Worker is stopping!");
      return;
  }
});
