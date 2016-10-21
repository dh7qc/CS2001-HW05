// Description:
//   Reminds you to do something after a specified waiting time
//
// Commands:
//   hubot remind me to <task> in <sec> seconds - Send a reminder in <sec> secs
//
// Notes:
//   If the hubot is shut down, all reminders are cleared.
//
'use strict';

module.exports = function(robot) {

  // Handler for "hubot remind me to <task> in <sec> seconds"
  robot.respond(/remind me to (.+) in (\d+) seconds?$/i, function(msg) {
    let task = msg.match[1];
    let numSeconds = msg.match[2];

    // As soon as the command is issued, the hubot will reply with:

    // > OK. I'll remind you to <task> in <numSeconds> seconds.

    // A timeout is then set, so that the hubot will reply with the
    // following after `numSeconds` seconds:

    // > Don't forget to <task>!

    // The message to be outputted.
    let message = 'OK. I\'ll remind you to ';
    message += task + ' in ' + numSeconds;

    // Decide between seconds / second for output message.
    if (numSeconds == 1) {
      message += ' second.';
    } else {
      message += ' seconds.';
    }

    msg.reply(message);

    // Timeout for the necessary amount of milliseconds.
    setTimeout(function() {
      msg.reply('Don\'t forget to ' + task + '!');
    }, numSeconds * 1000);
  });
};
