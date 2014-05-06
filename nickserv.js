/* jslint node:true */
/* https://toxin.jottit.com/unrealircd_services_commands */
var configuration = require('./configuration.jso') || require('configuration-example.json');
var request = require('request');
var irc = require('irc');
var currentUsers = Object.create(null);

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

    request.post(configuration.loginURL, function loginResponse(error, httpResponse, body) {
        currentUsers[username] = true;
        //tell user they are logged in
        //set user +r
        ///kidnap user
    }).form({
        log: username,
        pwd: password,
        'wp-submit': 'Log In',
        redirect_to: configuration.redirect
    });
}

var ircbot = new irc.Client(configuration.ircURI, configuration.botname, {
    channels: ['#ircops'],
    debug: true
});

ircbot.addListener('message#ircops', function (nick, to, text, message) {
    
});