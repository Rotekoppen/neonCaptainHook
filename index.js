const fs = require('fs')

const settings = require("./config.json")

console.log(settings.lang.startingbot)

var modules = []

console.log(settings.lang.foundmodules)
fs.readdirSync("bot_modules").forEach(module => {
  console.log(" - " + module)
  modules.push(require("./bot_modules/" + module))
})

const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
  console.log(settings.lang.loggedinas + client.user.tag)

  modules.forEach((module, i) => {
    module.onready(client, settings)
  })
})

client.on('message', message => {

  modules.every(async function(module, i) {
    return await module.onmessage(message)
  })

  if (message.content.toLowerCase() == settings.prefix + "help") {
    var output = "**" + settings.lang.helpmodules + "**\n"
    modules.forEach((module, i) => {
      output += "__" + module.name + "__\n"
      output += module.help.split("@@").join(settings.prefix) + "\n"
    })
    message.reply(output)
  }
})

client.login(settings.discordBotToken)
