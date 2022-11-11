
// first bot telegram
const TelegramBot = require('node-telegram-bot-api');

const token = '5673928106:AAElA19DDDMM5wPyCxwz_S5ZTTGZGu83uDs';
const weather = require('weather-js');

const bot = new TelegramBot(token, {polling: true});

bot.onText(/^\/clima (.+)/, function(msg, match){
    var chatId = msg.chat.id;
    var ciudad = match[1];
    console.log("🚀 ~ file: index.js ~ line 13 ~ bot.onText ~ ciudad", ciudad)

    

    var opciones = {
        search: ciudad, // lugar es la ciudad que el usuario introduce
        degreeType: 'C', // Celsius
        lang: 'es-ES' // Lenguaje en el que devolverá los datos
    }

    weather.find(opciones, function(err, result){

        if (err){ // Si ocurre algun error...
            console.log(err); // ... nos lo muestra en pantalla

        } else {
            console.log(result[0]); // Visualizamos el primer resultado del array
            
            bot.sendMessage(chatId, "Lugar: " + result[0].location.name +
            "\n\nTemperatura: " + result[0].current.temperature + "ºC\n" +
            "Visibilidad: " + result[0].current.skytext + "\n" +
            "Humedad: " + result[0].current.humidity + "%\n" +
            "Dirección del viento: " + result[0].current.winddisplay + "\n"
            ,{parse_mode: 'Markdown'});

        }
    })
});

bot.onText(/^\/start/, function(msg, match){
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, "Hola, bienvenido a mi bot de clima. Para usarlo, escribe /clima y el nombre de la ciudad que quieras consultar. Por ejemplo: /clima Madrid",{parse_mode: 'Markdown'});
}
);

bot.onText(/^\/help/, function(msg, match){
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, "Para usar el bot, escribe /clima y el nombre de la ciudad que quieras consultar. Por ejemplo: /clima Madrid",{parse_mode: 'Markdown'});
});

bot.onText(/^\/clima/, function(msg, match){
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, "Para usar el bot, escribe /clima y el nombre de la ciudad que quieras consultar. Por ejemplo: /clima Madrid",{parse_mode: 'Markdown'});
}
);