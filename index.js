// first bot telegram
const TelegramBot = require("node-telegram-bot-api");

const token = "5673928106:AAElA19DDDMM5wPyCxwz_S5ZTTGZGu83uDs";
const weather = require("weather-js");
const axios = require("axios");

const tokenAndino =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMDY5OWU3Y2E1NWQ1OThkMjNjNzRmZDcxOGU5NTI0MWFlMGY2ZGY5YjYwMTRmZDgxNWFkZTc1YTUyYTQ3YzkwYzRmYjExOGY3MDM4M2Q2NmUiLCJpYXQiOjE2NjQ5MzM0ODMuMTQxODEzLCJuYmYiOjE2NjQ5MzM0ODMuMTQxODE3LCJleHAiOjE2OTY0Njk0ODMuMTM0ODIsInN1YiI6IjEiLCJzY29wZXMiOltdfQ.KxOk867kRtSIeQ5t1yUe9MXbWDiUc0KXXt7MxutLFg4BoL2C79ulDtBVCXwnJpvJi3A60JDkLqCasz8kFNSnSk_5yMxylIr-9MKmfMlMQ8_TTEqaQWyefWbVEd8GXY6jCunZFCfkX0dmwQ20FuacavlIdnf7ZK2uxcWQywrLTTPxJL73GuDeXW_JcgKXFZPJdXElP8iHxoA8HXkY5TZzX7BCB9XUOjhh8R8pVWFqjDkeGanXqi3m8u6VfF14deBgh0tSCJWVb5fcFBdfFBbI8G7gf5HGz_RUHBAKNnxKhfLqjZti-caoAMWCYNX9nkGvhejE1VyFPloTu_O_YfLTvKpciPlW33rUHNNHSLykvLZXX1hYwvz7dLprRk1UsJok8AP4zkEHwLICvrCIqlICh-hQN0Dp6xzEm3Inq6CugyMmd7BuLqs_dwsZPiV-GcH24HoinnxW2jO3vblabDRJl12NUIbbgoQ9hJzprS1eqBxCwYscurQLKaDj3FJJAJNBVHCfnUTWGBAV3827QNoFj9oycVQItvz6ciPKyPfobLAAxYXw4T2Fwi4-j8EOPl5dg0DZco2ia2UeLkOGjckMNdDgpit88dUXuTnWa_Nz9s-psQOmTfDV75CpZ9GQpoOMmSZzuof3J8sJMkw8AYOii_rXifLCmDOT6t4OaPXG0Iw";

const bot = new TelegramBot(token, { polling: true });

require("./actionsAndino");

bot.onText(/^\/info_andino/, (msg, match) => {
  const chatId = msg.chat.id;

  sendInfoAndino(chatId, bot);
});

bot.onText(/^\/transacciones_andino/, (msg, match) => {
  const chatId = msg.chat.id;

  // consultar api https://andinoapp.com/api/apps/ecommerce/data con axios
  axios
    .get(
      "https://andinoapp.com/api/transactions",
      { headers: { Authorization: "Bearer " + tokenAndino } },
      { params: { limit: 5, page: 1 } }
    )
    .then(function (response) {
      // handle success
      // generar sms html
      let sms = "<b>Ultimas 10 transacciones andino App</b> \n\n";
      response.data.data.forEach((item) => {
        sms += `<b>Colegio:</b> ` + item.school.name + "\n";
        sms += `<b>Operación:</b> ` + item.type + "\n";
        sms += `<b>Movimiento:</b> ` + item.user.name + "\n";
        sms += `<b>Estatus:</b> ` + item.status + "\n";
        sms += `<b>Monto:</b> ` + item.amount + "\n";
        sms += `<b>Pago:</b> ` + item.payment_type.name + "\n";
        sms += `<b>Fecha:</b> ` + item.created_at + "\n";

        sms += "\n";
      });
      // enviar sms
      bot.sendMessage(chatId, sms, { parse_mode: "HTML" });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      bot.sendMessage(chatId, "Error al consultar la api");
    });
});

bot.onText(/^\/start/, (msg, match) => {
  bot.sendMessage(msg.chat.id, "Opciones para andino app", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Informacion",
            callback_data: "info_andino",
          },
          {
            text: "Transacciones",
            callback_data: "transacciones_andino",
          },
        ],
      ],
    },
  });
});

bot.on("callback_query", function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };
  const chatId = msg.chat.id;

  switch (action) {
    case "info_andino":
      sendInfoAndino(chatId, bot);
      break;
    case "transacciones_andino":
      sendTransactionAndino(chatId, bot);
      break;
  }
});

bot.onText(/^\/clima (.+)/, function(msg, match){
    var chatId = msg.chat.id;
    var ciudad = match[1];
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


// create server node api
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World");
});

server.listen(process.env.PORT || 5000);