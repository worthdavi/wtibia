var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
const { strict } = require('assert');
const { config } = require('process');
const globalConfig = require("../config.json");

var server = "Olera";
var serverToVisit = "https://guildstats.eu/bosses?monsterName=&world="+server+"&rook=0";


function searchForWord($, word) {
    let message;

    const bosses = [];
    $('#myTable tr td').each(function(i, elem) {
       bosses[i] = $(this).text();
    });  
    bosses.join(', ');

    if(word.toLowerCase() == globalConfig.bossCommands.listWord){
        message = "[Boss List] Some examples of bosses that you can check:\n\n\n";
        let i = 3
        while(i < 400){
            message = message + bosses[i] + "\n";
            i = i + 9
        }
        message = message + "\nTo see more available bosses, visit this link: " + serverToVisit + " :)";
        return message;
    }

    let value = 0;
    message = "[" + server + "]\n";
    for(i = 0; i < bosses.length; i++){
        if(bosses[i].toLowerCase() == word.toLowerCase()){
            value = i;
        }
    }
    if(value == 0){
        message = message +  word + " does not exist or is not registered on Tibia website.";
        return message;  
    }
    if(parseInt(bosses[value + 2]) >= 1){
        message = message + word + " was killed yesterday.";
        return message;
    }
    if(parseInt(bosses[value + 6]) == 0){
        message = message + word + " was never been killed.";
        return message;
    }       
    message = message + word + " has been killed last time on " + bosses[value + 6];
    return message;   
  }


exports.run = ({client, message, args}) => {
    let text = ""
    for(let i = 0; i < args.length; i++){
        text = text + args[i];
        if(i != args.length - 1)
            text = text + " ";
    }

    let msg;
    if(text.toLowerCase() == globalConfig.bossCommands.helpWord){
        msg = "[Help]\nUse the command '!boss bossName' to check when that boss got killed.\nUse the command '!boss list' to see which bosses are available.";
        return message.channel.send(`${msg}`); 
    }

    console.log("Visiting page " + serverToVisit);
    request(serverToVisit, function(error, response, body) {
    if(error) {
        console.log("Error: " + error);
        message.channel.send(`Something bad happened.`); 
    }
    // Check status code (200 is HTTP OK)
    console.log("Status code: " + response.statusCode);
    if(response.statusCode === 200) {
        // Parse the document body
        var $ = cheerio.load(body);
        console.log("Carregando página...");
        
        msg = searchForWord($, text);
        console.log(msg);
        message.channel.send(`${msg}`); 

        }
    });
}