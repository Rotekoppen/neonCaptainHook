const settings = require("./config.json")
const ytdl = require("ytdl-core")
const display = require("./display")
const fs = require('fs');
var modules = []

fs.readdirSync("./bot_modules/9.stream/streamingservices").forEach(module => {
  console.log("   - " + module)
  modules.push(require("./streamingservices/" + module))
})

var guilds = {}

exports.onready = function (botclient, botsettings) {
  client = botclient
  prefix = botsettings.prefix
}

exports.onmessage = async function (message) {
  if (message.content.toLowerCase().startsWith(prefix)) {
    var command = message.content.substr(prefix.length)
    if (command.toLowerCase() == "j") {
      await joinguild(message)
      return false
    }else if (command.toLowerCase() == "np" && guilds[message.guild.id] != undefined) {
      message.reply(display.nowplaying(guilds[message.guild.id].queue, guilds[message.guild.id].history))
      return false
    }else if (command.toLowerCase().startsWith("p") && guilds[message.guild.id] != undefined) {
      command = command.substr(1)

      var request = null
      for (var i = 0; i < modules.length && request == null ; i++) {
        request = await modules[i].request(command, message, display)
      }

      if (request != null) {
        guilds[message.guild.id].queue.push(request)
      }

      if (guilds[message.guild.id].connection.dispatcher == null) {
        playnext(message.guild.id)
      }

      return false
    }else if (command.toLowerCase() == "s" && guilds[message.guild.id] != undefined) {
      //playnext(message.guild.id)
      guilds[message.guild.id].connection.dispatcher.end()
      return false
    }
    return true
  }
}

function playnext(guildid) {
  if (guilds[guildid].queue != 0) {
    next = guilds[guildid].queue.shift()

    guilds[guildid].history.unshift(next)

    modules.forEach((module, i) => {
      if (module.name == next.type) {
        module.play(next, guilds[guildid].connection)
        guilds[guildid].connection.dispatcher.on('finish', () => {
          playnext(guildid)
        });
      }
    });
  }
}

async function joinguild(message) {
  var connection = await message.member.voice.channel.join()
  guilds[message.guild.id] = {
    connection: connection,
    queue: [],
    history: []
  }
}

var prefixes = ""
modules.forEach((item, i) => {
  prefixes += "|" + item.prefix
});
prefixes = prefixes.substr(1)


exports.help = settings.lang.help.split("$$").join(prefixes)
exports.name = settings.lang.name

/*


else if (message.content.toLowerCase().startsWith(prefix + "p ")) {
  if (guilds[message.guild.id] == undefined || guilds[message.guild.id].connection.status != 0) {
    await joinguild(message)
  }

  toplay = message.content.substr(prefix.length + 1).toLowerCase()

  if (toplay.startsWith(" ")) {

  }else {
    modules.forEach(async function(m, i) {
      if (toplay.startsWith(m.prefix + " ")) {
        request = await m.request(toplay.substr(m.prefix + 1), message, display)
        if (request != null) {
          guilds[message.guild.id].push(request)
        }
      }
    })
  }
  return false


    modules.every(async function(module, i) {
      return await module.onmessage(message)
    })

    if (toplay.startsWith("http://") || toplay.startsWith("https://")) {
      if (toplay.indexOf("youtu") != -1) {
        guilds[message.guild.id].queue.push({
          type: "youtube",
          url: toplay,
          display: toplay,
          requester: message.author.username
        })
      }
    }

    if (guilds[message.guild.id].connection.dispatcher == null) {
      playnext(message.guild.id)
    }

    return false
  } else if (message.content.toLowerCase() == prefix + "s") {
    playnext(message.guild.id)
    return false
  } else if (message.content.toLowerCase() == prefix + "np") {
    if (guilds[message.guild.id] != undefined) {
      message.reply(display.nowplaying(guilds[message.guild.id].queue, guilds[message.guild.id].history))
    }
    return false
  }
  return true
}

function playnext(guildid) {
  if (guilds[guildid].queue != 0) {
    next = guilds[guildid].queue.shift()

    guilds[guildid].history.unshift(next)

    if (next.type == "http") {
      guilds[guildid].connection.play(next.url)
    }else if (next.type == "youtube"){
      guilds[guildid].connection.play(ytdl(next.url, { quality: "highestaudio" }))
    }else {
      playnext(guildid)
    }
  }
}

*/
