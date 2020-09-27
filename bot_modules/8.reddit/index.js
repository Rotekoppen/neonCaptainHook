const settings = require("./config.json");
const snekfetch = require('snekfetch');
var client

exports.onready = function (botclient, botsettings) {
  client = botclient
  prefix = botsettings.prefix

  var help = ""
  settings.subreddits.forEach((reddit, i) => {
    help += settings.lang.help.replace("@@", prefix).replace("££", reddit[0]).replace("£!", reddit[1])
  })

  exports.help = help
}

exports.onmessage = function (message) {
  var handled = true
  settings.subreddits.forEach((item, i) => {
    if (message.content.toLowerCase() == prefix + item[0]) {
      getreddit(client, message, item[1])
      handled = false
    }
  });

  return handled
}

exports.name = settings.lang.name

getreddit = async (client, message, subreddit) => {
	try {
        const { body } = await snekfetch
            .get('https://www.reddit.com/r/' + subreddit + '.json?sort=top&t=week')
            .query({ limit: 800 });
        const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
        if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
        const randomnumber = Math.floor(Math.random() * allowed.length)

        message.channel.send("**" + allowed[randomnumber].data.title + "**" + " - u/" + allowed[randomnumber].data.author + "\n" + allowed[randomnumber].data.url)
    } catch (err) {
        return console.log(err);
    }
}
