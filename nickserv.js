/* jslint node:true */
/* https://toxin.jottit.com/unrealircd_services_commands */
var configuration = require('./configuration.json') || require('configuration-example.json');
var request = require('request');
var irc = require('irc');
var currentUsers = {};

function userJoinsServer(username) {
    currentUsers[username] = false;
    //pm user to login
    setTimeout(function (username) {
        if (!currentUsers[username]) {
            ///KILL nick reason
            delete currentUsers[username];
        }
    }, 60000);
}

function attemptLogin(username, password) {
    if (currentUsers.hasOwnProperty(username)) {
        request.post(configuration.loginURL, function loginResponse(error, httpResponse, body) {
            if (httpResponse.statusCode == 304) {
                currentUsers[username] = true;
                //tell user they are logged in
                //set user +r
                ///kidnap user
            }
            console.log(httpResponse.statusCode, 'did it!', httpResponse.headers);

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
    var ircbot = new irc.Client(configuration.ircURI, configuration.botname, {
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
}