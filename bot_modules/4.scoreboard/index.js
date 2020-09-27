const settings = require("./config.json");
const fs = require('fs')
var scoreboard = require("../../scores.json")
settings.words.forEach((word, i) => {
  if (scoreboard[word] == undefined) {
    scoreboard[word] = {}
  }
})

var prefix = ""

function regScoreboard(message, find) {
  if(message.content == find) {
    if (scoreboard[find][message.author.id] == undefined) {
      scoreboard[find][message.author.id] = [0, message.author.username]
    }
    scoreboard[find][message.author.id][0]++;
  }
}

var client

exports.onready = function (botclient, botsettings) {
  client = botclient
  prefix = botsettings.prefix
  setInterval(function(){fs.writeFile('./scores.json', JSON.stringify(scoreboard), 'utf8', () => {})},60000)
}

exports.onmessage = function (message) {
  settings.words.forEach((word, i) => {
    regScoreboard(message, word)
  });

  if (message.content.toLowerCase() == prefix + "top") {
    var output = "**" + settings.lang.name + "**\n"
    settings.words.forEach((word, i) => {
      var sortable = [];
      for (var user in scoreboard[word]) {
          sortable.push([user, scoreboard[word][user][0], scoreboard[word][user][1]]);
      }

      sortable.sort(function(a, b) {
          return a[1] - b[1];
      });

      output += "__" + word.toUpperCase() + "__\n"
      sortable.forEach((user, i) => {
        output += (i + 1) + ". " + user[2] + " - " + user[1] + "\n"
      });
    });
    message.reply(output)

    return false
  }
  return true
}

exports.help = settings.lang.help
exports.name = settings.lang.name
