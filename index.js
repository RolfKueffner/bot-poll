var package = require('./package.json');
var _ = require('lodash');


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

  var number = [];
  var answerCounter = 0;
  var userVote = [];
  var pollTester = 0;
  var answers = [];

  this.commands.poll = function(channel, args, user) {

    if(pollTester === 1){
      bot.postMessage(channel, "Already a poll in progress!");
    }
    else {
      pollTester = 1;
      var splittedText = args.split("|");
      var question = splittedText[0];
      var responseTemp = "";

      for (i = 1; i < splittedText.length; i++) {
        responseTemp += "|" + i + "." + splittedText[i];
        number[i - 1] = 0;
        answerCounter++;
        answers[i] = splittedText[i];
      }
      var responses = responseTemp.split("|").join("\n");
      bot.postMessage(channel, user.name + " started a poll! Vote with '!vote number' \n" + question + responses);
      var pollInterval = setInterval(function () {
        if(pollInterval===1) {
          var message = "";
          for (i = 1; i < splittedText.length; i++) {
            message += "|" + i + "." + splittedText[i] + " ==> (" + number[i - 1] + ") votes";
          }
          var responses = message.split("|").join("\n");
          bot.postMessage(channel, question + responses);
        }
        else{
          stopInterval(pollInterval);
        }
      }, 120000);
      setTimeout(function(){
        var message;
        for (i = 1; i < splittedText.length; i++) {
          message += "|" + i + "." + splittedText[i] + " ==> (" + number[i-1] + ") votes";
        }
        var responses = message.split("|").join("\n");
        bot.postMessage(channel, "Final results: \n" + question + responses);
        number = [];
        answerCounter = 0;
        userVote = [];
        pollTester = 0;
        answers = [];
      }, 960000);
    }

  };

  this.commands.vote = function(channel, args, user) {
    var vote = args;

    if (pollTester != 1){
      bot.postMessage(channel, "No poll in progress");
    }
    else if(userVote.indexOf(user.name) != -1){
      bot.postMessage(channel, user.name+ " already voted");
    }
    else{
      userVote += user.name;
      number[vote - 1]++;
      bot.postMessage(channel, user.name+" voted");
    }

  };

  this.commands.endpoll = function(channel, args, user) {
    var message = "";
    for (i = 1; i < answers.length; i++) {
      message += "|" + i + "." + answers[i] + " ==> (" + number[i-1] + ") votes";
    }
    var responses = message.split("|").join("\n");
    bot.postMessage(channel, "Final results: \n"  + responses);
    number = [];
    answerCounter = 0;
    userVote = [];
    pollTester = 0;
    answers = [];
  };

  function stopInterval(int) {
    clearInterval(int);
  }

};

Module.prototype.toString = function() {
  return this.name;
};


var exports = module.exports = Module;