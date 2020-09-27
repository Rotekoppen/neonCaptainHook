// Adapted from https://github.com/AdenForshaw/theDogAPI-discord-bot

const querystring = require('querystring');
const r2          = require('r2');
const settings    = require("./config.json");
var prefix = ""

var client
exports.onready = function (botclient, botsettings) {
  client = botclient
  prefix = botsettings.prefix
}

exports.onmessage = function (message) {
  if (message.content.toLowerCase() == prefix + "doggy") {
    messageRecieved(message, false)
    return false
  }

  if (message.content.toLowerCase() == prefix + "kitty") {
    messageRecieved(message, true)
    return false
  }
  return true
}

exports.help = settings.lang.help
exports.name = settings.lang.name

async function messageRecieved(message, cat)
{
  try{
    var images = await loadImage(message.author.username, cat);

    var image = images[0];
    var breed = image.breeds[0];

    var catinfo = ""
    if (cat) {
      catinfo = "\n\n"+breed.description
    }
    message.channel.send( "***"+breed.name + "*** \r *"+breed.temperament+"*"+catinfo, { files: [ image.url ] } );

  }catch(error)
  {
    console.log(error)
  }
}

async function loadImage(sub_id, cat)
{
  var headers = {
    'X-API-KEY': settings.dogapikey
  }
  if (cat) {
    headers["X-API-KEY"] == settings.catapikey
  }
  var query_params = {
    'has_breeds':true,
    'mime_types':'jpg,png',
    'size':'small',
    'sub_id': sub_id,
    'limit' : 1
  }

  let queryString = querystring.stringify(query_params);

  try {

    var url = "https://api.thedogapi.com/"
    if (cat) {
      url = "https://api.thecatapi.com/"
    }
    let _url = url + `v1/images/search?${queryString}`;

    var response = await r2.get(_url , {headers} ).json
  } catch (e) {
      console.log(e)
  }
  return response;
}
