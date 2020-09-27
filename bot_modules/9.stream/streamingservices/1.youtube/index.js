const settings = require("./config.json")
const ytdl = require('ytdl-core');
exports.request = function (toplay, message, display) {
  if (toplay.startsWith(settings.prefix + " ")) {
    toplay = toplay.substr(settings.prefix.length + 1)

    return {
      type: settings.name,
      url: toplay,
      display: toplay,
      requester: message.author.username
    }
  }else if((
    toplay.startsWith(" http://") ||
    toplay.startsWith(" https://")) &&
    toplay.indexOf("youtu") != -1){
    toplay = toplay.substr(1)
    return {
      type: settings.name,
      url: toplay,
      display: toplay,
      requester: message.author.username
    }
  }
  return null
}

exports.play = function (song, connection) {
  connection.play(ytdl(song.url, { quality: "highestaudio" }))
}

exports.prefix = settings.prefix
exports.name = settings.name;
