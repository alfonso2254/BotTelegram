const axios = require("axios");
const tokenAndino =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMDY5OWU3Y2E1NWQ1OThkMjNjNzRmZDcxOGU5NTI0MWFlMGY2ZGY5YjYwMTRmZDgxNWFkZTc1YTUyYTQ3YzkwYzRmYjExOGY3MDM4M2Q2NmUiLCJpYXQiOjE2NjQ5MzM0ODMuMTQxODEzLCJuYmYiOjE2NjQ5MzM0ODMuMTQxODE3LCJleHAiOjE2OTY0Njk0ODMuMTM0ODIsInN1YiI6IjEiLCJzY29wZXMiOltdfQ.KxOk867kRtSIeQ5t1yUe9MXbWDiUc0KXXt7MxutLFg4BoL2C79ulDtBVCXwnJpvJi3A60JDkLqCasz8kFNSnSk_5yMxylIr-9MKmfMlMQ8_TTEqaQWyefWbVEd8GXY6jCunZFCfkX0dmwQ20FuacavlIdnf7ZK2uxcWQywrLTTPxJL73GuDeXW_JcgKXFZPJdXElP8iHxoA8HXkY5TZzX7BCB9XUOjhh8R8pVWFqjDkeGanXqi3m8u6VfF14deBgh0tSCJWVb5fcFBdfFBbI8G7gf5HGz_RUHBAKNnxKhfLqjZti-caoAMWCYNX9nkGvhejE1VyFPloTu_O_YfLTvKpciPlW33rUHNNHSLykvLZXX1hYwvz7dLprRk1UsJok8AP4zkEHwLICvrCIqlICh-hQN0Dp6xzEm3Inq6CugyMmd7BuLqs_dwsZPiV-GcH24HoinnxW2jO3vblabDRJl12NUIbbgoQ9hJzprS1eqBxCwYscurQLKaDj3FJJAJNBVHCfnUTWGBAV3827QNoFj9oycVQItvz6ciPKyPfobLAAxYXw4T2Fwi4-j8EOPl5dg0DZco2ia2UeLkOGjckMNdDgpit88dUXuTnWa_Nz9s-psQOmTfDV75CpZ9GQpoOMmSZzuof3J8sJMkw8AYOii_rXifLCmDOT6t4OaPXG0Iw";

const ButtonsReply_markup = {
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
};
sendInfoAndino = (indSms, bot) => {
  axios
    .get("https://andinoapp.com/api/apps/ecommerce/data", {
      headers: {
        Authorization: "Bearer " + tokenAndino,
      },
    })
    .then(function (response) {
      // handle success
      // generar sms html
      let sms = "<b>Informacion de andino App</b> \n\n";
      response.data.statisticsItems.forEach((element) => {
        sms += `<b>${element.subtitle}:</b> ` + element.title + "\n";
      });
      // enviar sms
      bot.sendMessage(indSms, sms, { parse_mode: "HTML" });

    //   setTimeout(() => {
    //     bot.sendMessage(indSms, "Opciones para andino app", {
    //         reply_markup: ButtonsReply_markup,
    //       });
    //     }, 1000);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      bot.sendMessage(indSms, "Error al consultar la api");
    });
};

sendTransactionAndino = (indSms, bot) => {
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
      bot.sendMessage(indSms, sms, { parse_mode: "HTML" });

    //   setTimeout(() => {
    //     bot.sendMessage(indSms, "Opciones para andino app", {
    //         reply_markup: ButtonsReply_markup,
    //       });
    //     }, 1000);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      bot.sendMessage(indSms, "Error al consultar la api");
    });
};
