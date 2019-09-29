const _ = require("lodash");

class Message {
  constructor(messageData) {
    this.id = _.uniqueId();
    this.data = messageData;
    this.timestamp = _.now();
  }
}

module.exports = Message;
