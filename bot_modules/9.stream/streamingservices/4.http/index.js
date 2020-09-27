const settings = require("./config.json")

exports.request = function (toplay, message, display) {
  if (toplay.toLowerCase().startsWith(settings.prefix + " ")) {
    toplay = toplay.substr(settings.prefix.length + 1)
    return {
      type: settings.name,
      url: toplay,
      display: toplay,
      requester: message.author.username,
      wrong: true
    }
  }else if(toplay.toLowerCase().startsWith(" http://") || toplay.startsWith(" https://")){
    toplay = toplay.substr(1)
    return {
      type: settings.name,
      url: toplay,
      display: toplay,
      requester: message.author.username,
      wrong: true
    }
  }
  return null
}

exports.play = function (song, connection) {
  connection.play(song.url)
}

exports.prefix = settings.prefix;
exports.name = settings.name;
