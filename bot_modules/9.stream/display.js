const settings = require("./config.json")

exports.addtoqueue = function (message, name) {
  // body...
};

exports.nowplaying = function (queue, history) {
  var output = "\n"

  if (history.length > 1) {
    output += "**" + settings.lang.queue.previously + "**\n```js\n"

    for (var i = Math.min(3, history.length - 1); i > 0; i--) {
      output += "-" + (i) + " | " + history[i].display + "\n"
    }


    output += "```\n"
  }

  if (history.length > 0) {
    output += "**" + settings.lang.queue.nowplaying + "** " + settings.lang.queue.requested + " " + history[0].requester + "\n```js\n"
    output += " 0 | " + history[0].display + "\n```\n"
  }

  if (queue.length != 0) {
    output += "**" + settings.lang.queue.nextup + "**\n```js\n"
    for (var i = 0; i < Math.min(queue.length, 3); i++) {
      output += " " + (i + 1) + " | " + queue[i].display + "\n"
    }
    if (queue.length > 3) {
      output += "   | +" + (queue.length - 3) + " " + settings.lang.queue.more + "\n"
    }
    output += "```\n"
  }
  return output
};

exports.joinedachannel = function (message, guild) {
  // body...
};

/*
**Tidligere spilt**
```js
-3 | https://www.youtube.com/watch?v=Dnq2q5-TJeo
-2 | Bohemian rapsody
-1 | Take on me
```
**Spiller nå** etterspurt av Rotekoppen
```js
 0 | Never gonna give you up
```
**Neste**
```js
 1 | https://nettradio.radiotrondelag.no:8443/radio_trondelag
 2 | https://www.youtube.com/watch?v=fJ9rUzIMcZQ
 3 | Penis music
   | +5 til
```
*/
