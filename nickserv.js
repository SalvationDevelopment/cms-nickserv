/* jslint node:true */
/* https://toxin.jottit.com/unrealircd_services_commands */
var configuration = require('./configuration.json') || require('configuration-example.json');
var request = require('request');
var irc = require('irc');
var currentUsers = {};
var ircbot;

function userJoinsServer(username) {
    currentUsers[username] = false;
    //pm user to login
    setTimeout(function (username) {
        if (!currentUsers[username]) {
            ircbot.send('kill', username, 'did not login in time');
            delete currentUsers[username];
        }
    }, 60000);
}

function attemptLogin(username, password) {
    if (currentUsers.hasOwnProperty(username)) {
        request.post(configuration.loginURL, function loginResponse(error, httpResponse, body) {
            if (httpResponse.statusCode == 304) {
                currentUsers[username] = true;
                ircbot.say(username, 'You are now logged in, Welcome.');
                //set user +r
                ircbot.send('sajoin', username, '#lobby');
            }

        }).form({
            log: username,
            pwd: password,
            'wp-submit': 'Log In',
            redirect_to: configuration.redirect
        });


    } else {
        console.log('I didnt see you come into this server myfriend,...');
    }
}

function loadIRC() {
    ircbot = new irc.Client(configuration.ircURI, configuration.botname, {
        channels: ['#ircops'],
        debug: true
    });

    ircbot.addListener('notice', function (nick, to, text, message) {
        if (message.server) {
            if (message.args[2] === 'connecting') {

            } else if (message.args[2] === 'exiting') {

            }
            console.log(message.args[5]);
        }
    });
    ircbot.addListener('pm', function (nick, text, message) {
        ///msg servicebot id password
        var messageParts = message.split(' ');
        if (message[0] === 'id' && currentUsers.hasOwnProperty(nick)) {
            attemptLogin(nick, message[1]);
        }
    });
}