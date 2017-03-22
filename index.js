var package = require('./package.json');
var _ = require('lodash');
var MongoClient = require('mongodb').MongoClient;
var mongo;


MongoClient.connect('mongodb://localhost:27017/bot', function(err, db) {
  if (err) {
    console.log("error in mongo connect", err);
    process.exit(0);
  }
  mongo=db;
})


var Module = function (bot) {
  this.bot = bot;
  this.name = package.name;
  this.version = package.version;
  // add channel names as trings to only allow certain channels
  this.allowedChannels = [];
  this.help = function () {
    return {
      "poll": "Start a poll. Usage: !poll question | answer1 | ..."

    };
  };
  this.commands = {};

  this.commands.poll = function(channel, args, user) {
    var splittedText = args.split("|");
    var question = splittedText[0];
    var response = "";

    for(i=1; i<splittedText.length ; i++){
      response += splittedText[i];
    }
    console.log("RESPONSE", response);
    var realResponse = response.split("|").join("\n"," ");
    console.log("REALRESPONSE", realResponse);
    bot.postMessage(channel, question + realResponse);
  };

};

Module.prototype.toString = function() {
  return this.name;
};


var exports = module.exports = Module;