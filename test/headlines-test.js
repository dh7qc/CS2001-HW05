'use strict';

var Helper = require('hubot-test-helper');
var should = require('chai').should();
var _ = require('underscore');

/**
 * Any ol' function function that requires zero parameters. Its return
 * value will be ignored.
 *
 * @callback simpleCallback
 */

/**
 * Delays execution of a callback by 250 milliseconds.
 *
 * @param {simpleCallback} callback - The function to call after 250ms.
 */
function delay(callback) {
  setTimeout(callback, 2000);
}

describe('headline script', function() {

  // Configure mocha to use longer timout periods. We have to wait for
  // Hubot to respond to messages.
  this.slow(3000);
  this.timeout(18000); // was 5000

  // Executed before each test. Used for setup.
  beforeEach(function() {
    this.helper = new Helper('../scripts/headlines.js');
    this.room = this.helper.createRoom();
  });

  // Executed after each test. Used for cleanup.
  afterEach(function() {
    this.room.destroy();
  });

  it('gets a headline', function(done) {
    let room = this.room;

    room.user.say('meowth', 'hubot show me a headline').then(function() {
      delay(function() {
        // We expect to see three messages total
        room.messages.length.should.equal(3);

        // The first two are always the same
        room.messages.slice(0, 2).should.deep.eql([
          ['meowth', 'hubot show me a headline'],
          ['hubot', '@meowth Okey doke. I\'ll go fetch a headline!']
        ]);

        // It better not be blank
        room.messages[2].should.not.eql(
          ['hubot', '@meowth ']
        );

        // It better not tell us that it couldn't fetch anything
        room.messages[2].should.not.eql(
          ['hubot', '@meowth I couldn\'t get any headlines...']
        );

        // Async test is complete
        done();
      });
    });
  });

  it('doesn\'t return a blank headline', function(done) {
    let room = this.room;

    // Create 20 Promises (look it up!) that ask the Hubot for
    // headlines.
    let promises = _(20).times(function() {
      return room.user.say('meowth', 'hubot show me a headline');
    });

    // Gather all the results from the promises, then look at the
    // reesulting messages.
    Promise.all(promises).then(function() {
      delay(function() {
        // We should see 60 total: a request, an acknowledgment,
        // and a headline... 20 times.
        room.messages.length.should.equal(60);

        // Check each message to see that it's not blank
        _(room.messages).each(function(msg) {
          let name = msg[0];
          let content = msg[1];

          content.trim().should.not.equal('@meowth');
        });

        // Async test is complete
        done();
      });
    });
  });
});
