const _ = require("lodash");
const tmi = require("tmi.js");
const Message = require("../../models/message");

const WORKER_TICK_RATE = 500;

let workerClient = undefined;

let workerEmitter = undefined;

let workerMsgsQueue = [];

let workerMsgsQueueWords = undefined;

const onWorkerClientConnected = () =>
  // eslint-disable-line
  console.log("[INFO] Worker is connected!");

const onWorkerClientMsg = (
  // eslint-disable-line
  workerClientTarget,
  workerClientContext,
  workerClientMsg,
  workerClientSelf
) => {
  if (workerClientSelf) return;
  const workerClientMsgSplit =
    // eslint-disable-line
    _.chain(workerClientMsg)
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .value();
  if (workerClientMsgSplit.length > workerMsgsQueueWords) return;
  const workerClientMsgDeburr =
    // eslint-disable-line
    _.chain(workerClientMsgSplit)
      .join(" ")
      .lowerCase()
      .deburr()
      .value();
  const workerMsgData = workerClientMsgDeburr;
  const workerMsg = new Message(workerMsgData);
  workerMsgsQueue.push(workerMsg);
  console.log(`[INFO] workerMsg = ${JSON.stringify(workerMsg)}.`);
  console.log(`[INFO] workerMsgData = ${workerMsgData}.`);
  console.log(`[INFO] workerMsgsQueue = ${JSON.stringify(workerMsgsQueue)}.`);
};

process.on("message", ({ type, payload }) => {
  switch (type) {
    case "worker-init":
      const workerClientParams = { identity: payload.watcherCreds, channels: [payload.watcherCreds.username] };
      workerClient = new tmi.client(workerClientParams);
      workerClient.on("connected", onWorkerClientConnected);
      workerClient.on("message", onWorkerClientMsg);
      workerMsgsQueueWords = payload.watcherMessagesWords;
      console.log(`[INFO] Worker is initialising w/ ${workerMsgsQueueWords} word(s)! `);
      return;
    case "worker-update-words":
      workerMsgsQueueWords = payload.watcherMessagesWords;
      console.log(`[INFO] Worker is updating to ${workerMsgsQueueWords} word(s)!`);
      return;
    case "worker-start":
      workerClient.connect();
      workerEmitter = setInterval(() => {
        if (!workerMsgsQueue.length) return;
        process.send({ payload: workerMsgsQueue });
        workerMsgsQueue = [];
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
