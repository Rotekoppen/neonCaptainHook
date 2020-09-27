const settings = require("./config.json")
const ytdl = require('ytdl-core');
const { getInfo }= require('ytdl-getinfo')
exports.request = async function (toplay, message, display) {
  if (toplay.startsWith(settings.prefix + " ")) {
    toplay = toplay.substr(settings.prefix.length + 1)
  }//else {
  //}

  return await search(toplay, message, display)
}

async function search(query, message, display) {
  if (query.length == 11) {
    query += " - "
  }
  return await getInfo(query).then((info) => {
    return {
      type: "youtube",
      url: info.items[0].webpage_url,
      display: info.items[0].title,
      requester: message.author.username
    }
  })
}

exports.prefix = settings.prefix
exports.name = settings.name;
